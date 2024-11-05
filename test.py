import cv2
import numpy as np

import matplotlib.pyplot as plt
import mediapipe as mp

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose
image = cv2.imread("test.jpg")
# 포즈 감지
with mp_pose.Pose() as pose:
    results = pose.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

# 결과 그리기
if results.pose_landmarks:
    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

# # Matplotlib으로 결과 이미지 보여주기
plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
plt.axis("off")  # 축 숨기기
plt.show()
