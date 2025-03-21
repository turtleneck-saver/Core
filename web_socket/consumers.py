import base64
import json
import numpy as np
import cv2
import mediapipe as mp
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import datetime
import joblib
import os

NOSE = 0
LEFT_EYE = 7
RIGHT_EYE = 8
LEFT_SHOULDER = 11
RIGHT_SHOULDER = 12
CHIN = 152

logger = logging.getLogger("prod")

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose
mp_face_mesh = mp.solutions.face_mesh


class VideoConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        self.time = None
        self.image = None

        self.model = joblib.load("./web_socket/random_forest_model.pkl")
        logger.info("클라이언트와 연결되었습니다.")

    async def receive(self, text_data=None):
        try:
            result_data = {}
            json_data = json.loads(text_data)
            base64_image = json_data["image"]
            base64_image = base64_image.split(",")[1]
            image = base64.b64decode(base64_image)
            time_str = json_data["time"]
            time = datetime.datetime.fromisoformat(time_str[:-1])
            if self.time is None or time < self.time:
                self.time = time
            else:
                self.time = time

                logger.info("이미지 수신 중...")

                np_img = np.frombuffer(image, np.uint8)
                self.image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

                with mp_pose.Pose() as pose:
                    pose_results = pose.process(cv2.cvtColor(self.image, cv2.COLOR_BGR2RGB))

                with mp_face_mesh.FaceMesh() as face_mesh:
                    face_results = face_mesh.process(cv2.cvtColor(self.image, cv2.COLOR_BGR2RGB))

                if pose_results.pose_landmarks and face_results.multi_face_landmarks:
                    mp_drawing.draw_landmarks(
                        self.image, pose_results.pose_landmarks, mp_pose.POSE_CONNECTIONS
                    )
                    face_landmarks = face_results.multi_face_landmarks[0]

                    chin_landmark = self._change_to_np(face_landmarks.landmark[CHIN])
                    nose_landmark = self._change_to_np(pose_results.pose_landmarks.landmark[NOSE])
                    left_eye_landmark = self._change_to_np(face_landmarks.landmark[LEFT_EYE])
                    right_eye_landmark = self._change_to_np(face_landmarks.landmark[RIGHT_EYE])
                    left_shoulder_landmark = self._change_to_np(
                        pose_results.pose_landmarks.landmark[LEFT_SHOULDER]
                    )
                    right_shoulder_landmark = self._change_to_np(
                        pose_results.pose_landmarks.landmark[RIGHT_SHOULDER]
                    )
                    middle_shoulder_landmark = (
                        left_shoulder_landmark + right_shoulder_landmark
                    ) / 2
                    left_frame_landmark = np.array([0, chin_landmark[1]])
                    h, w, _ = self.image.shape
                    cx, cy = int(chin_landmark[0] * w), int(chin_landmark[1] * h)
                    cv2.circle(self.image, (cx, cy), 5, (255, 0, 0), -1)

                    results = self._preprocess(
                        nose_landmark,
                        left_eye_landmark,
                        right_eye_landmark,
                        left_shoulder_landmark,
                        right_shoulder_landmark,
                        chin_landmark,
                        middle_shoulder_landmark,
                        left_frame_landmark,
                    )

                    result_data["state"] = self._predict(results)
                else:

                    logger.info("포즈 또는 얼굴 감지 실패.")

                _, buffer = cv2.imencode(".webp", self.image)
                self.image = base64.b64encode(buffer).decode("utf-8")
                result_data["image"] = self.image
                result_data["time"] = self.time.isoformat()

                await self.send(text_data=json.dumps(result_data))
                logger.info("이미지를 클라이언트에 전송했습니다.")

        except json.JSONDecodeError:
            logger.error("JSON 디코딩 오류 발생.")
            await self.send(text_data=json.dumps({"error": "Invalid JSON"}))
        except BrokenPipeError:
            logger.warning("클라이언트와의 연결이 끊어졌습니다.")
        except Exception as e:
            logger.error(f"오류 발생: {str(e)}")
            await self.send(text_data=json.dumps({"error": str(e)}))

    def _preprocess(
        self,
        nose,
        left_eye,
        right_eye,
        left_shoulder,
        right_shoulder,
        middle_shoulder,
        chin,
        left_frame,
    ):

        parameters_combination = [
            [(nose, left_eye, right_eye), self._calculate_ratio],
            [(nose, left_shoulder, right_shoulder), self._calculate_angle],
            [(nose, middle_shoulder), self._calculate_angle],
            [(left_shoulder, right_shoulder), self._calculate_angle],
            [(left_frame, nose, chin), self._calculate_angle],
        ]
        results = []
        for parameters, func in parameters_combination:
            result = func(*parameters)
            results.append(result)
            logging.info(result)
        return results

    def _predict(self, results):
        input_features = np.array(results).reshape(1, -1)
        prediction = self.model.predict(input_features)[0]
        if prediction == 1:
            cv2.putText(self.image, "danger", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        else:
            cv2.putText(self.image, "safe", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        return str(prediction)

    def change_to_vector(func):
        def wrapper(self, A, B, C=None):

            if C is not None:

                AB = B - A
                AC = C - A
                return func(self, AB, AC)
            else:
                AB = B - A
                return func(self, AB)

        return wrapper

    def _change_to_np(self, joint):
        np_list = np.array([joint.x, joint.y])
        return np_list

    @change_to_vector
    def _calculate_ratio(self, AB, AC):
        ratio = np.linalg.norm(AB) / np.linalg.norm(AC)
        return ratio

    @change_to_vector
    def _calculate_angle(self, AB, AC=None):
        if AC is not None:
            cos_theta = np.dot(AB, AC) / (np.linalg.norm(AB) * np.linalg.norm(AC))
            theta = np.arccos(cos_theta)

        else:
            tan_theta = AB[1] / AB[0]
            theta = np.arctan(tan_theta)

        angle = np.degrees(theta)
        return angle
