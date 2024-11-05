# import base64
# import json
# import numpy as np
# import cv2
# import mediapipe as mp
# from channels.generic.websocket import AsyncWebsocketConsumer
# import logging

# # 로깅 설정
# logging.basicConfig(
#     level=logging.INFO,
#     format="%(asctime)s - %(levelname)s - %(message)s",
#     handlers=[logging.FileHandler("video_consumer.log"), logging.StreamHandler()],
# )

# mp_drawing = mp.solutions.drawing_utils
# mp_pose = mp.solutions.pose


# class VideoConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         await self.accept()
#         logging.info("클라이언트와 연결되었습니다.")

#     async def receive(self, text_data=None, bytes_data=None):
#         try:
#             if bytes_data:
#                 logging.info("이미지 수신 중...")

#                 # Base64로 인코딩된 데이터 처리
#                 image_data = bytes_data
#                 # Base64 디코딩
#                 img_bytes = base64.b64decode(image_data.split(",")[1])
#                 # 이미지 변환
#                 np_img = np.frombuffer(img_bytes, np.uint8)
#                 image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

#                 # 포즈 감지
#                 with mp_pose.Pose() as pose:
#                     results = pose.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

#                 # 결과 그리기
#                 if results.pose_landmarks:
#                     mp_drawing.draw_landmarks(
#                         image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS
#                     )
#                     logging.info("포즈 감지 완료.")
#                 else:
#                     logging.info("dpfj.")
#                 # 이미지 인코딩
#                 _, buffer = cv2.imencode(".jpg", image)
#                 processed_image = base64.b64encode(buffer).decode("utf-8")

#                 # 클라이언트에 전송
#                 await self.send(text_data=json.dumps({"image": processed_image}))
#                 logging.info("이미지를 클라이언트에 전송했습니다.")

#         except json.JSONDecodeError:
#             logging.error("JSON 디코딩 오류 발생.")
#             await self.send(text_data=json.dumps({"error": "Invalid JSON"}))
#         except BrokenPipeError:
#             logging.warning("클라이언트와의 연결이 끊어졌습니다.")
#         except Exception as e:
#             logging.error(f"오류 발생: {str(e)}")
#             await self.send(text_data=json.dumps({"error": str(e)}))
import base64
import json
import numpy as np
import cv2
import mediapipe as mp
from channels.generic.websocket import AsyncWebsocketConsumer
import logging

# 로깅 설정
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
        logging.info("클라이언트와 연결되었습니다.")

    async def receive(self, text_data=None, bytes_data=None):
        try:
            if bytes_data:
                logging.info("이미지 수신 중...")

                # bytes_data를 직접 처리
                np_img = np.frombuffer(bytes_data, np.uint8)
                image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

                # 포즈 감지
                with mp_pose.Pose() as pose:
                    results = pose.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

                # 결과 그리기
                if results.pose_landmarks:
                    mp_drawing.draw_landmarks(
                        image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS
                    )
                    logging.info("포즈 감지 완료.")
                else:
                    logging.info("포즈 감지 실패.")

                # 이미지 인코딩
                _, buffer = cv2.imencode(".jpg", image)
                processed_image = base64.b64encode(buffer).decode("utf-8")

                # 클라이언트에 전송
                await self.send(text_data=json.dumps({"image": processed_image}))
                logging.info("이미지를 클라이언트에 전송했습니다.")

        except json.JSONDecodeError:
            logging.error("JSON 디코딩 오류 발생.")
            await self.send(text_data=json.dumps({"error": "Invalid JSON"}))
        except BrokenPipeError:
            logging.warning("클라이언트와의 연결이 끊어졌습니다.")
        except Exception as e:
            logging.error(f"오류 발생: {str(e)}")
            await self.send(text_data=json.dumps({"error": str(e)}))
