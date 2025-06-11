import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import React, { useEffect, useRef, useState } from "react";

const NewVideo = () => {
  const [status, setStatus] = useState("normal"); // "normal" or "warning"
  const [showStatus, setShowStatus] = useState(false);
  const [angleThreshold, setAngleThreshold] = useState(70); // 사용자가 조절할 각도
  const statusRef = useRef(null);

  useEffect(() => {
    let poseLandmarker = undefined;
    let runningMode = "VIDEO";
    let enableWebcamButton;
    let webcamRunning = false;
    const videoHeight = "360px";
    const videoWidth = "480px";
    const wasmAssetPath =
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm";
    const modelAssetPath = `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task`;
    const createPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(wasmAssetPath);
      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: modelAssetPath,
          delegate: "GPU",
        },
        runningMode: runningMode,
        numPoses: 2,
      });
    };
    createPoseLandmarker();

    const video = document.getElementById("webcam");
    const canvasElement = document.getElementById("output_canvas");
    const canvasCtx = canvasElement.getContext("2d");
    const drawingUtils = new DrawingUtils(canvasCtx);

    const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

    if (hasGetUserMedia()) {
      enableWebcamButton = document.getElementById("webcamButton");
      enableWebcamButton.addEventListener("click", enableCam);
    } else {
      console.warn("getUserMedia() is not supported by your browser");
    }

    function enableCam(event) {
      if (!poseLandmarker) {
        console.log("Wait! poseLandmaker not loaded yet.");
        return;
      }

      if (webcamRunning === true) {
        webcamRunning = false;
        enableWebcamButton.innerText = "ENABLE PREDICTIONS";
      } else {
        webcamRunning = true;
        enableWebcamButton.innerText = "DISABLE PREDICTIONS";
      }

      const constraints = {
        video: true,
      };

      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
      });
    }

    let lastVideoTime = -1;
    async function predictWebcam() {
      try {
        canvasElement.style.height = videoHeight;
        video.style.height = videoHeight;
        canvasElement.style.width = videoWidth;
        video.style.width = videoWidth;

        let lastAlarmStatus = false; // 알람 상태 저장

        let startTimeMs = performance.now();
        if (lastVideoTime !== video.currentTime) {
          lastVideoTime = video.currentTime;
          poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
            canvasCtx && canvasCtx.save();
            canvasCtx &&
              canvasCtx.clearRect(
                0,
                0,
                canvasElement.width,
                canvasElement.height
              );
            for (const landmark of result.landmarks) {
              drawingUtils.drawLandmarks(landmark, {
                radius: (data) =>
                  DrawingUtils.lerp(data.from && data.from.z, -0.15, 0.1, 5, 1),
              });
              drawingUtils.drawConnectors(
                landmark,
                PoseLandmarker.POSE_CONNECTIONS
              );
            }
            // --- 어깨선과 코 기준 각도 계산 및 상태 표시 ---
            if (
              result.landmarks &&
              result.landmarks.length > 0 &&
              result.landmarks[0].length > 0
            ) {
              const keypoints = result.landmarks[0];
              const nose = keypoints[0];
              const leftShoulder = keypoints[11];
              const rightShoulder = keypoints[12];

              if (nose && leftShoulder && rightShoulder) {
                // === 각도 계산용 벡터 ===
                // 벡터: 왼쪽 어깨 → 코
                const noseLeftAngle = {
                  x: nose.x - leftShoulder.x,
                  y: nose.y - leftShoulder.y,
                };
                // 벡터: 오른쪽 어깨 → 코
                const noseRightAngle = {
                  x: nose.x - rightShoulder.x,
                  y: nose.y - rightShoulder.y,
                };

                // 두 벡터의 각도 계산
                const dot =
                  noseLeftAngle.x * noseRightAngle.x +
                  noseLeftAngle.y * noseRightAngle.y;
                const mag1 = Math.sqrt(
                  noseLeftAngle.x * noseLeftAngle.x +
                    noseLeftAngle.y * noseLeftAngle.y
                );
                const mag2 = Math.sqrt(
                  noseRightAngle.x * noseRightAngle.x +
                    noseRightAngle.y * noseRightAngle.y
                );
                let angle = Math.acos(dot / (mag1 * mag2));
                angle = (angle * 180) / Math.PI; // 라디안 → 도

                // === 각도 시각화 ===
                // 좌표 변환 (0~1 → 실제 캔버스 픽셀)
                const toCanvas = (pt) => ({
                  x: pt.x * canvasElement.width,
                  y: pt.y * canvasElement.height,
                });
                const nosePt = toCanvas(nose);
                const leftShoulderPt = toCanvas(leftShoulder);
                const rightShoulderPt = toCanvas(rightShoulder);

                // 선 그리기
                canvasCtx.save();
                canvasCtx.strokeStyle = "yellow";
                canvasCtx.lineWidth = 4;
                // 왼쪽 어깨 → 코
                canvasCtx.beginPath();
                canvasCtx.moveTo(leftShoulderPt.x, leftShoulderPt.y);
                canvasCtx.lineTo(nosePt.x, nosePt.y);
                canvasCtx.stroke();
                // 오른쪽 어깨 → 코
                canvasCtx.beginPath();
                canvasCtx.moveTo(rightShoulderPt.x, rightShoulderPt.y);
                canvasCtx.lineTo(nosePt.x, nosePt.y);
                canvasCtx.stroke();

                // 각도 텍스트 표시 (코 근처)
                canvasCtx.font = "bold 32px Arial";
                canvasCtx.fillStyle = "yellow";
                canvasCtx.strokeStyle = "black";
                canvasCtx.lineWidth = 2;
                const angleText = `${angle.toFixed(1)}°`;
                // 텍스트 테두리
                canvasCtx.strokeText(angleText, nosePt.x + 10, nosePt.y - 10);
                // 텍스트 본문
                canvasCtx.fillText(angleText, nosePt.x + 10, nosePt.y - 10);
                canvasCtx.restore();

                // === 판정 및 알람 ===
                if (angle > localStorage.getItem("angleThreshold")) {
                  setStatus("warning");
                  setShowStatus(true);
                  // 알람(소리) 울리기
                  if (typeof window !== "undefined") {
                    if (!window.warningAudio) {
                      window.warningAudio = new Audio(
                        "https://cdn-sv.p-e.kr/assets/alarm.mp3"
                      );
                      window.warningAudio.loop = true;
                    }
                    if (window.warningAudio.paused) {
                      window.warningAudio.play();
                    }
                  }
                } else {
                  setStatus("normal");
                  setShowStatus(true);
                  // 알람(소리) 끄기
                  if (typeof window !== "undefined" && window.warningAudio) {
                    window.warningAudio.pause();
                    window.warningAudio.currentTime = 0;
                  }
                }
              } else {
                setShowStatus(false);
              }
            } else {
              setShowStatus(false);
            }
            // --- 상태 표시 끝 ---
            canvasCtx && canvasCtx.restore();
          });
        }

        if (webcamRunning === true) {
          window.requestAnimationFrame(predictWebcam);
        }
      } catch (error) {
        console.error("Error in predictWebcam:", error);
      }
    }
  }, [angleThreshold]); // 각도 임계값이 바뀌면 다시 적용

  return (
    <div className="video" style={{ position: "relative" }}>
      <div id="liveView" className="videoView">
        <button
          id="webcamButton"
          className="mdc-button mdc-button--raised"
          onClick={() => window.parent.postMessage("enableDrawing", "*")}
        >
          <span className="mdc-button__label">ENABLE WEBCAM</span>
        </button>
        <div style={{ position: "relative" }}>
          {/* 각도 임계값 입력창 */}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 30,
              zIndex: 1100,
              background: "rgba(255,255,255,0.9)",
              padding: "8px 16px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <label htmlFor="angle-threshold" style={{ fontWeight: "bold" }}>
              Warning 각도:
            </label>
            <input
              id="angle-threshold"
              type="number"
              min={10}
              max={170}
              value={angleThreshold}
              onChange={(e) => {
                setAngleThreshold(Number(e.target.value));
                localStorage.setItem("angleThreshold", Number(e.target.value));
              }}
              style={{
                width: "60px",
                fontSize: "1rem",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <span style={{ fontWeight: "bold" }}>°</span>
          </div>
          <video
            id="webcam"
            style={{ width: "1280px", height: "720px", position: "absolute" }}
            autoPlay
            playsInline
          ></video>

          <canvas
            className="output_canvas"
            id="output_canvas"
            width="1280"
            height="720"
            style={{ position: "absolute", left: "0px", top: "0px" }}
          ></canvas>
          {showStatus && (
            <div
              ref={statusRef}
              style={{
                position: "absolute",
                top: 30,
                left: 30,
                zIndex: 1000,
                fontSize: "2rem",
                fontWeight: "bold",
                color: status === "warning" ? "red" : "green",
                background: "rgba(255,255,255,0.7)",
                padding: "10px 24px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {status === "warning" ? "WARNING" : "NORMAL"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewVideo;
