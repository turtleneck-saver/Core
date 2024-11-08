import base64
import json
import numpy as np
import cv2
import mediapipe as mp
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import datetime

# 랜드마크 인덱스 정의
NOSE = 0
LEFT_EAR = 7
RIGHT_EAR = 8
LEFT_SHOULDER = 11
RIGHT_SHOULDER = 12
CHIN = 152

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("video_consumer.log"), logging.StreamHandler()],
)

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose
mp_face_mesh = mp.solutions.face_mesh


class VideoConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        self.time = None
        self.result_data = {}
        logging.info("클라이언트와 연결되었습니다.")

    async def receive(self, text_data=None):
        try:
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

                logging.info("이미지 수신 중...")

                np_img = np.frombuffer(image, np.uint8)
                image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

                with mp_pose.Pose() as pose:
                    pose_results = pose.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

                with mp_face_mesh.FaceMesh() as face_mesh:
                    face_results = face_mesh.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

                if pose_results.pose_landmarks and face_results.multi_face_landmarks:
                    mp_drawing.draw_landmarks(image, pose_results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
                    face_landmarks = face_results.multi_face_landmarks[0]

                    chin_landmark = self._change_to_vector(face_landmarks.landmark[CHIN])
                    nose_landmark = self._change_to_vector(pose_results.pose_landmarks.landmark[NOSE])
                    left_eye_landmark = self._change_to_vector(face_landmarks.landmark[LEFT_EYE])
                    right_eye_landmark = self._change_to_vector(face_landmarks.landmark[RIGHT_EYE])
                    left_shoulder_landmark = self._change_to_vector(pose_results.pose_landmarks.landmark[LEFT_SHOULDER])
                    right_shoulder_landmark = self._change_to_vector(pose_results.pose_landmarks.landmark[RIGHT_SHOULDER])
                    h, w, _ = image.shape
                    cx, cy = int(chin_landmark[0] * w), int(chin_landmark[1] * h)
                    cv2.circle(image, (cx, cy), 5, (255, 0, 0), -1)

                    self._preprocess(
                        nose_landmark,
                        left_eye_landmark,
                        right_eye_landmark,
                        left_shoulder_landmark,
                        right_shoulder_landmark,
                        chin_landmark,
                    )
                else:
                    logging.info("포즈 또는 얼굴 감지 실패.")

                _, buffer = cv2.imencode(".webp", image)
                processed_image = base64.b64encode(buffer).decode("utf-8")
                self.result_data["image"] = processed_image
                self.result_data["time"] = self.time.isoformat()

                await self.send(text_data=json.dumps(self.result_data))
                logging.info("이미지를 클라이언트에 전송했습니다.")

        except json.JSONDecodeError:
            logging.error("JSON 디코딩 오류 발생.")
            await self.send(text_data=json.dumps({"error": "Invalid JSON"}))
        except BrokenPipeError:
            logging.warning("클라이언트와의 연결이 끊어졌습니다.")
        except Exception as e:
            logging.error(f"오류 발생: {str(e)}")
            await self.send(text_data=json.dumps({"error": str(e)}))

    def _preprocess(self, nose, left_eye, right_eye, left_shoulder, right_shoulder, chin):
        parameters = [(nose, left_eye, right_eye), (nose, left_shoulder, right_shoulder)]
        pass

    def _change_to_vector(self, A, B, C):
        AB = B - A
        AC = C - A
        return AB, AC

    def _change_to_np(self, joint):
        np_list = np.array([joint.x, joint.y])
        return np_list

    def _calculate_ratio(self, AB, AC):
        ratio = np.linalg.norm(AB) / np.linalg.norm(AC)
        return ratio

    def _calculate_angle(self, AB, AC):
        cos_theta = np.dot(AB, AC) / (np.linalg.norm(AB) * np.linalg.norm(AC))
        theta = np.arccos(cos_theta)
        angle = np.degrees(theta)
        return angle


class RecordingConsumer(VideoConsumer):
    async def connect(self):
        await super().connect()
        self.path = os.path.join(os.getcwd(), "poses.csv")
        try:
            self.df = pd.read_csv(self.path)

        except FileNotFoundError:
            self.df = pd.DataFrame(columns=["", "landmarks"])

    def preprocess(self, landmarks):
        landmarks = joints.landmark
        nose = landmarks[mp_pose.PoseLandmark.NOSE]
        left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
        right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
        horizon_angle = calculate_horizon_angle(left_shoulder, right_shoulder)
