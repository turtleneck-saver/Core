import base64
import json
import numpy as np
import cv2
import mediapipe as mp
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import datetime

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("video_consumer.log"), logging.StreamHandler()],
)

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose


class VideoConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        self.time = None
        logging.info("클라이언트와 연결되었습니다.")

    async def receive(self, text_data=None, bytes_data=None):
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

                image = base64.b64decode(base64_image)
                np_img = np.frombuffer(image, np.uint8)
                image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

                with mp_pose.Pose() as pose:
                    results = pose.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

                if results.pose_landmarks:
                    mp_drawing.draw_landmarks(
                        image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS
                    )
                    logging.info("포즈 감지 완료.")
                else:
                    logging.info("포즈 감지 실패.")

                _, buffer = cv2.imencode(".webp", image)
                processed_image = base64.b64encode(buffer).decode("utf-8")

                await self.send(
                    text_data=json.dumps({"image": processed_image, "time": self.time.isoformat()})
                )
                logging.info("이미지를 클라이언트에 전송했습니다.")

        except json.JSONDecodeError:
            logging.error("JSON 디코딩 오류 발생.")
            await self.send(text_data=json.dumps({"error": "Invalid JSON"}))
        except BrokenPipeError:
            logging.warning("클라이언트와의 연결이 끊어졌습니다.")
        except Exception as e:
            logging.error(f"오류 발생: {str(e)}")
            await self.send(text_data=json.dumps({"error": str(e)}))
