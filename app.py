import cv2
import mediapipe as mp
import numpy as np
import pandas as pd

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils


def calculate_angle(a, b, c):
    """각도 계산 함수"""
    a = np.array(a)  # 첫 번째 관절
    b = np.array(b)  # 두 번째 관절
    c = np.array(c)  # 세 번째 관절

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    return angle if angle <= 180 else 360 - angle


# 비디오 캡처
cap = cv2.VideoCapture("http://192.168.219.113:4747/video")

# CSV 파일 초기화
data = []

with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            # 관절 좌표 추출
            neck = [
                landmarks[mp_pose.PoseLandmark.NOSE.value].x,
                landmarks[mp_pose.PoseLandmark.NOSE.value].y,
            ]  # 목
            shoulder = [
                landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y,
            ]  # 왼쪽 어깨
            elbow = [
                landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y,
            ]  # 왼쪽 팔꿈치
            wrist = [
                landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y,
            ]  # 왼쪽 손목
            spine = [
                landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y,
            ]  # 왼쪽 엉덩이

            # 각도 계산
            shoulder_neck_angle = calculate_angle(neck, shoulder, elbow)  # 목과 어깨, 팔꿈치
            elbow_wrist_angle = calculate_angle(shoulder, elbow, wrist)  # 어깨, 팔꿈치, 손목
            neck_spine_angle = calculate_angle(neck, shoulder, spine)  # 목과 어깨, 엉덩이

            # 데이터 저장
            data.append(
                {
                    "Neck_X": neck[0],
                    "Neck_Y": neck[1],
                    "Shoulder_X": shoulder[0],
                    "Shoulder_Y": shoulder[1],
                    "Elbow_X": elbow[0],
                    "Elbow_Y": elbow[1],
                    "Wrist_X": wrist[0],
                    "Wrist_Y": wrist[1],
                    "Spine_X": spine[0],
                    "Spine_Y": spine[1],
                    "Shoulder_Neck_Angle": shoulder_neck_angle,
                    "Elbow_Wrist_Angle": elbow_wrist_angle,
                    "Neck_Spine_Angle": neck_spine_angle,
                }
            )

            # 관절 표시
            for idx, landmark in enumerate(landmarks):
                h, w, _ = frame.shape
                x, y = int(landmark.x * w), int(landmark.y * h)
                cv2.circle(frame, (x, y), 5, (0, 255, 0), -1)

            # 각도 표시
            cv2.putText(
                frame,
                f"Shoulder-Neck Angle: {shoulder_neck_angle:.2f}",
                (50, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (255, 0, 0),
                2,
                cv2.LINE_AA,
            )
            cv2.putText(
                frame,
                f"Elbow-Wrist Angle: {elbow_wrist_angle:.2f}",
                (50, 100),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (255, 0, 0),
                2,
                cv2.LINE_AA,
            )
            cv2.putText(
                frame,
                f"Neck-Spine Angle: {neck_spine_angle:.2f}",
                (50, 150),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (255, 0, 0),
                2,
                cv2.LINE_AA,
            )

        # 결과 이미지 표시
        cv2.imshow("Pose", frame)
        if cv2.waitKey(10) & 0xFF == ord("q"):
            break

# 캡처 종료
cap.release()
cv2.destroyAllWindows()

# 데이터프레임으로 변환 후 CSV로 저장
df = pd.DataFrame(data)
df.to_csv("D:\project\python\joint_angles.csv", index=False)
print("CSV 파일로 저장 완료: joint_angles.csv")
