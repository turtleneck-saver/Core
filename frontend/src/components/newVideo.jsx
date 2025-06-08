// // // import {
// // //   PoseLandmarker,
// // //   FilesetResolver,
// // //   DrawingUtils,
// // // } from "@mediapipe/tasks-vision";
// // // import React, { useEffect } from "react";

// // // const NewVideo = () => {
// // //   useEffect(() => {
// // //     let poseLandmarker = undefined;
// // //     let runningMode = "VIDEO";
// // //     let enableWebcamButton;
// // //     let webcamRunning = false;
// // //     const videoHeight = "360px";
// // //     const videoWidth = "480px";
// // //     const wasmAssetPath =
// // //       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm";
// // //     const modelAssetPath = `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task`;
// // //     const createPoseLandmarker = async () => {
// // //       const vision = await FilesetResolver.forVisionTasks(wasmAssetPath);
// // //       poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
// // //         baseOptions: {
// // //           modelAssetPath: modelAssetPath,
// // //           delegate: "GPU",
// // //         },
// // //         runningMode: runningMode,
// // //         numPoses: 2,
// // //       });
// // //     };
// // //     createPoseLandmarker();

// // //     const video = document.getElementById("webcam");
// // //     const canvasElement = document.getElementById("output_canvas");
// // //     const canvasCtx = canvasElement.getContext("2d");
// // //     const drawingUtils = new DrawingUtils(canvasCtx);

// // //     const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

// // //     if (hasGetUserMedia()) {
// // //       enableWebcamButton = document.getElementById("webcamButton");
// // //       enableWebcamButton.addEventListener("click", enableCam);
// // //     } else {
// // //       console.warn("getUserMedia() is not supported by your browser");
// // //     }

// // //     function enableCam(event) {
// // //       if (!poseLandmarker) {
// // //         console.log("Wait! poseLandmaker not loaded yet.");
// // //         return;
// // //       }

// // //       if (webcamRunning === true) {
// // //         webcamRunning = false;
// // //         enableWebcamButton.innerText = "ENABLE PREDICTIONS";
// // //       } else {
// // //         webcamRunning = true;
// // //         enableWebcamButton.innerText = "DISABLE PREDICTIONS";
// // //       }

// // //       const constraints = {
// // //         video: true,
// // //       };

// // //       navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
// // //         video.srcObject = stream;
// // //         video.addEventListener("loadeddata", predictWebcam);
// // //       });
// // //     }

// // //     let lastVideoTime = -1;
// // //     async function predictWebcam() {
// // //       try {
// // //         canvasElement.style.height = videoHeight;
// // //         video.style.height = videoHeight;
// // //         canvasElement.style.width = videoWidth;
// // //         video.style.width = videoWidth;

// // //         let startTimeMs = performance.now();
// // //         if (lastVideoTime !== video.currentTime) {
// // //           lastVideoTime = video.currentTime;
// // //           poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
// // //             canvasCtx && canvasCtx.save();
// // //             canvasCtx &&
// // //               canvasCtx.clearRect(
// // //                 0,
// // //                 0,
// // //                 canvasElement.width,
// // //                 canvasElement.height
// // //               );
// // //             for (const landmark of result.landmarks) {
// // //               drawingUtils.drawLandmarks(landmark, {
// // //                 radius: (data) =>
// // //                   DrawingUtils.lerp(data.from && data.from.z, -0.15, 0.1, 5, 1),
// // //               });
// // //               drawingUtils.drawConnectors(
// // //                 landmark,
// // //                 PoseLandmarker.POSE_CONNECTIONS
// // //               );
// // //             }
// // //             canvasCtx && canvasCtx.restore();
// // //           });
// // //         }

// // //         if (webcamRunning === true) {
// // //           window.requestAnimationFrame(predictWebcam);
// // //         }
// // //       } catch (error) {
// // //         console.error("Error in predictWebcam:", error);
// // //       }
// // //     }
// // //   }, []);
// // //   return (
// // //     <div className="video">
// // //       <div id="liveView" className="videoView">
// // //         <button
// // //           id="webcamButton"
// // //           className="mdc-button mdc-button--raised"
// // //           onClick={() => window.parent.postMessage("enableDrawing", "*")}
// // //         >
// // //           <span className="mdc-button__label">ENABLE WEBCAM</span>
// // //         </button>
// // //         <div style={{ position: "relative" }}>
// // //           <video
// // //             id="webcam"
// // //             style={{ width: "1280px", height: "720px", position: "absolute" }}
// // //             autoPlay
// // //             playsInline
// // //           ></video>

// // //           <canvas
// // //             className="output_canvas"
// // //             id="output_canvas"
// // //             width="1280"
// // //             height="720"
// // //             style={{ position: "absolute", left: "0px", top: "0px" }}
// // //           ></canvas>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default NewVideo;
// // import {
// //   PoseLandmarker,
// //   FilesetResolver,
// //   DrawingUtils,
// // } from "@mediapipe/tasks-vision";
// // import React, { useEffect, useRef, useState } from "react";

// // const NewVideo = () => {
// //   const [status, setStatus] = useState("normal"); // "normal" or "warning"
// //   const [showStatus, setShowStatus] = useState(false);
// //   const statusRef = useRef(null);

// //   useEffect(() => {
// //     let poseLandmarker = undefined;
// //     let runningMode = "VIDEO";
// //     let enableWebcamButton;
// //     let webcamRunning = false;
// //     const videoHeight = "360px";
// //     const videoWidth = "480px";
// //     const wasmAssetPath =
// //       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm";
// //     const modelAssetPath = `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task`;
// //     const createPoseLandmarker = async () => {
// //       const vision = await FilesetResolver.forVisionTasks(wasmAssetPath);
// //       poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
// //         baseOptions: {
// //           modelAssetPath: modelAssetPath,
// //           delegate: "GPU",
// //         },
// //         runningMode: runningMode,
// //         numPoses: 2,
// //       });
// //     };
// //     createPoseLandmarker();

// //     const video = document.getElementById("webcam");
// //     const canvasElement = document.getElementById("output_canvas");
// //     const canvasCtx = canvasElement.getContext("2d");
// //     const drawingUtils = new DrawingUtils(canvasCtx);

// //     const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

// //     if (hasGetUserMedia()) {
// //       enableWebcamButton = document.getElementById("webcamButton");
// //       enableWebcamButton.addEventListener("click", enableCam);
// //     } else {
// //       console.warn("getUserMedia() is not supported by your browser");
// //     }

// //     function enableCam(event) {
// //       if (!poseLandmarker) {
// //         console.log("Wait! poseLandmaker not loaded yet.");
// //         return;
// //       }

// //       if (webcamRunning === true) {
// //         webcamRunning = false;
// //         enableWebcamButton.innerText = "ENABLE PREDICTIONS";
// //       } else {
// //         webcamRunning = true;
// //         enableWebcamButton.innerText = "DISABLE PREDICTIONS";
// //       }

// //       const constraints = {
// //         video: true,
// //       };

// //       navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
// //         video.srcObject = stream;
// //         video.addEventListener("loadeddata", predictWebcam);
// //       });
// //     }

// //     let lastVideoTime = -1;
// //     async function predictWebcam() {
// //       try {
// //         canvasElement.style.height = videoHeight;
// //         video.style.height = videoHeight;
// //         canvasElement.style.width = videoWidth;
// //         video.style.width = videoWidth;

// //         let startTimeMs = performance.now();
// //         if (lastVideoTime !== video.currentTime) {
// //           lastVideoTime = video.currentTime;
// //           poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
// //             canvasCtx && canvasCtx.save();
// //             canvasCtx &&
// //               canvasCtx.clearRect(
// //                 0,
// //                 0,
// //                 canvasElement.width,
// //                 canvasElement.height
// //               );
// //             for (const landmark of result.landmarks) {
// //               drawingUtils.drawLandmarks(landmark, {
// //                 radius: (data) =>
// //                   DrawingUtils.lerp(data.from && data.from.z, -0.15, 0.1, 5, 1),
// //               });
// //               drawingUtils.drawConnectors(
// //                 landmark,
// //                 PoseLandmarker.POSE_CONNECTIONS
// //               );
// //             }
// //             // --- 목, 어깨, 턱 각도 계산 및 상태 표시 ---
// //             if (
// //               result.landmarks &&
// //               result.landmarks.length > 0 &&
// //               result.landmarks[0].length > 0
// //             ) {
// //               // Mediapipe pose keypoints
// //               // 0: nose, 7: left_shoulder, 8: right_shoulder, 9: left_elbow, 10: right_elbow, 11: left_wrist, 12: right_wrist, 13: left_pinky, 14: right_pinky, 15: left_index, 16: right_index, 17: left_thumb, 18: right_thumb, 23: left_hip, 24: right_hip
// //               // 1: left_eye_inner, 2: left_eye, 3: left_eye_outer, 4: right_eye_inner, 5: right_eye, 6: right_eye_outer
// //               // 17: left_thumb, 18: right_thumb, 19: left_hip, 20: right_hip, 21: left_knee, 22: right_knee, 23: left_ankle, 24: right_ankle
// //               // 0: nose, 1: left_eye_inner, 2: left_eye, 3: left_eye_outer, 4: right_eye_inner, 5: right_eye, 6: right_eye_outer, 7: left_ear, 8: right_ear, 9: mouth_left, 10: mouth_right
// //               // 11: left_shoulder, 12: right_shoulder, 13: left_elbow, 14: right_elbow, 15: left_wrist, 16: right_wrist
// //               // 23: left_hip, 24: right_hip

// //               const keypoints = result.landmarks[0];

// //               // 목(목 기준점: 0(nose)), 어깨(왼쪽: 11, 오른쪽: 12), 턱(9: mouth_left, 10: mouth_right)
// //               // 턱 중앙: (mouth_left + mouth_right) / 2
// //               // 어깨 중앙: (left_shoulder + right_shoulder) / 2
// //               // 목: nose

// //               const nose = keypoints[0];
// //               const leftShoulder = keypoints[11];
// //               const rightShoulder = keypoints[12];
// //               const mouthLeft = keypoints[9];
// //               const mouthRight = keypoints[10];

// //               if (
// //                 nose &&
// //                 leftShoulder &&
// //                 rightShoulder &&
// //                 mouthLeft &&
// //                 mouthRight
// //               ) {
// //                 // 어깨 중앙
// //                 const shoulderCenter = {
// //                   x: (leftShoulder.x + rightShoulder.x) / 2,
// //                   y: (leftShoulder.y + rightShoulder.y) / 2,
// //                 };
// //                 // 턱 중앙
// //                 const jawCenter = {
// //                   x: (mouthLeft.x + mouthRight.x) / 2,
// //                   y: (mouthLeft.y + mouthRight.y) / 2,
// //                 };

// //                 // 목-턱-어깨 각도 계산 (목이 앞으로 나왔는지)
// //                 // 벡터: 어깨->목, 목->턱
// //                 const v1 = {
// //                   x: nose.x - shoulderCenter.x,
// //                   y: nose.y - shoulderCenter.y,
// //                 };
// //                 const v2 = {
// //                   x: jawCenter.x - nose.x,
// //                   y: jawCenter.y - nose.y,
// //                 };

// //                 // 각도 계산 (코사인 법칙)
// //                 const dot = v1.x * v2.x + v1.y * v2.y;
// //                 const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
// //                 const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
// //                 let angle = Math.acos(dot / (mag1 * mag2));
// //                 angle = (angle * 180) / Math.PI; // 라디안 → 도

// //                 // 기준 각도: 40도 이하(정상), 40~60도(경고), 60도 이상(위험)
// //                 if (angle > 50) {
// //                   setStatus("warning");
// //                   setShowStatus(true);
// //                 } else {
// //                   setStatus("normal");
// //                   setShowStatus(true);
// //                 }
// //               } else {
// //                 setShowStatus(false);
// //               }
// //             } else {
// //               setShowStatus(false);
// //             }
// //             // --- 상태 표시 끝 ---
// //             canvasCtx && canvasCtx.restore();
// //           });
// //         }

// //         if (webcamRunning === true) {
// //           window.requestAnimationFrame(predictWebcam);
// //         }
// //       } catch (error) {
// //         console.error("Error in predictWebcam:", error);
// //       }
// //     }
// //   }, []);

// //   return (
// //     <div className="video" style={{ position: "relative" }}>
// //       <div id="liveView" className="videoView">
// //         <button
// //           id="webcamButton"
// //           className="mdc-button mdc-button--raised"
// //           onClick={() => window.parent.postMessage("enableDrawing", "*")}
// //         >
// //           <span className="mdc-button__label">ENABLE WEBCAM</span>
// //         </button>
// //         <div style={{ position: "relative" }}>
// //           <video
// //             id="webcam"
// //             style={{ width: "1280px", height: "720px", position: "absolute" }}
// //             autoPlay
// //             playsInline
// //           ></video>

// //           <canvas
// //             className="output_canvas"
// //             id="output_canvas"
// //             width="1280"
// //             height="720"
// //             style={{ position: "absolute", left: "0px", top: "0px" }}
// //           ></canvas>
// //           {showStatus && (
// //             <div
// //               ref={statusRef}
// //               style={{
// //                 position: "absolute",
// //                 top: 30,
// //                 left: 30,
// //                 zIndex: 1000,
// //                 fontSize: "2rem",
// //                 fontWeight: "bold",
// //                 color: status === "warning" ? "red" : "green",
// //                 background: "rgba(255,255,255,0.7)",
// //                 padding: "10px 24px",
// //                 borderRadius: "12px",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //               }}
// //             >
// //               {status === "warning" ? "WARNING" : "NORMAL"}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default NewVideo;
// import {
//   PoseLandmarker,
//   FilesetResolver,
//   DrawingUtils,
// } from "@mediapipe/tasks-vision";
// import React, { useEffect, useRef, useState } from "react";

// const NewVideo = () => {
//   const [status, setStatus] = useState("normal"); // "normal" or "warning"
//   const [showStatus, setShowStatus] = useState(false);
//   const statusRef = useRef(null);

//   useEffect(() => {
//     let poseLandmarker = undefined;
//     let runningMode = "VIDEO";
//     let enableWebcamButton;
//     let webcamRunning = false;
//     const videoHeight = "360px";
//     const videoWidth = "480px";
//     const wasmAssetPath =
//       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm";
//     const modelAssetPath = `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task`;
//     const createPoseLandmarker = async () => {
//       const vision = await FilesetResolver.forVisionTasks(wasmAssetPath);
//       poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
//         baseOptions: {
//           modelAssetPath: modelAssetPath,
//           delegate: "GPU",
//         },
//         runningMode: runningMode,
//         numPoses: 2,
//       });
//     };
//     createPoseLandmarker();

//     const video = document.getElementById("webcam");
//     const canvasElement = document.getElementById("output_canvas");
//     const canvasCtx = canvasElement.getContext("2d");
//     const drawingUtils = new DrawingUtils(canvasCtx);

//     const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

//     if (hasGetUserMedia()) {
//       enableWebcamButton = document.getElementById("webcamButton");
//       enableWebcamButton.addEventListener("click", enableCam);
//     } else {
//       console.warn("getUserMedia() is not supported by your browser");
//     }

//     function enableCam(event) {
//       if (!poseLandmarker) {
//         console.log("Wait! poseLandmaker not loaded yet.");
//         return;
//       }

//       if (webcamRunning === true) {
//         webcamRunning = false;
//         enableWebcamButton.innerText = "ENABLE PREDICTIONS";
//       } else {
//         webcamRunning = true;
//         enableWebcamButton.innerText = "DISABLE PREDICTIONS";
//       }

//       const constraints = {
//         video: true,
//       };

//       navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
//         video.srcObject = stream;
//         video.addEventListener("loadeddata", predictWebcam);
//       });
//     }

//     let lastVideoTime = -1;
//     async function predictWebcam() {
//       try {
//         canvasElement.style.height = videoHeight;
//         video.style.height = videoHeight;
//         canvasElement.style.width = videoWidth;
//         video.style.width = videoWidth;

//         let startTimeMs = performance.now();
//         if (lastVideoTime !== video.currentTime) {
//           lastVideoTime = video.currentTime;
//           poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
//             canvasCtx && canvasCtx.save();
//             canvasCtx &&
//               canvasCtx.clearRect(
//                 0,
//                 0,
//                 canvasElement.width,
//                 canvasElement.height
//               );
//             for (const landmark of result.landmarks) {
//               drawingUtils.drawLandmarks(landmark, {
//                 radius: (data) =>
//                   DrawingUtils.lerp(data.from && data.from.z, -0.15, 0.1, 5, 1),
//               });
//               drawingUtils.drawConnectors(
//                 landmark,
//                 PoseLandmarker.POSE_CONNECTIONS
//               );
//             }
//             // --- 어깨선과 코 기준 각도 계산 및 상태 표시 ---
//             // ...생략...
//             if (
//               result.landmarks &&
//               result.landmarks.length > 0 &&
//               result.landmarks[0].length > 0
//             ) {
//               const keypoints = result.landmarks[0];
//               const nose = keypoints[0];
//               const leftShoulder = keypoints[11];
//               const rightShoulder = keypoints[12];

//               if (nose && leftShoulder && rightShoulder) {
//                 // === 각도 계산용 벡터 ===
//                 // 벡터: 왼쪽 어깨 → 코
//                 const noseLeftAngle = {
//                   x: nose.x - leftShoulder.x,
//                   y: nose.y - leftShoulder.y,
//                 };
//                 // 벡터: 오른쪽 어깨 → 코
//                 const noseRightAngle = {
//                   x: nose.x - rightShoulder.x,
//                   y: nose.y - rightShoulder.y,
//                 };

//                 // 두 벡터의 각도 계산
//                 const dot =
//                   noseLeftAngle.x * noseRightAngle.x +
//                   noseLeftAngle.y * noseRightAngle.y;
//                 const mag1 = Math.sqrt(
//                   noseLeftAngle.x * noseLeftAngle.x +
//                     noseLeftAngle.y * noseLeftAngle.y
//                 );
//                 const mag2 = Math.sqrt(
//                   noseRightAngle.x * noseRightAngle.x +
//                     noseRightAngle.y * noseRightAngle.y
//                 );
//                 let angle = Math.acos(dot / (mag1 * mag2));
//                 angle = (angle * 180) / Math.PI; // 라디안 → 도

//                 // === 각도 시각화 ===
//                 // 좌표 변환 (0~1 → 실제 캔버스 픽셀)
//                 const toCanvas = (pt) => ({
//                   x: pt.x * canvasElement.width,
//                   y: pt.y * canvasElement.height,
//                 });
//                 const nosePt = toCanvas(nose);
//                 const leftShoulderPt = toCanvas(leftShoulder);
//                 const rightShoulderPt = toCanvas(rightShoulder);

//                 // 선 그리기
//                 canvasCtx.save();
//                 canvasCtx.strokeStyle = "yellow";
//                 canvasCtx.lineWidth = 4;
//                 // 왼쪽 어깨 → 코
//                 canvasCtx.beginPath();
//                 canvasCtx.moveTo(leftShoulderPt.x, leftShoulderPt.y);
//                 canvasCtx.lineTo(nosePt.x, nosePt.y);
//                 canvasCtx.stroke();
//                 // 오른쪽 어깨 → 코
//                 canvasCtx.beginPath();
//                 canvasCtx.moveTo(rightShoulderPt.x, rightShoulderPt.y);
//                 canvasCtx.lineTo(nosePt.x, nosePt.y);
//                 canvasCtx.stroke();

//                 // 각도 텍스트 표시 (코 근처)
//                 canvasCtx.font = "bold 32px Arial";
//                 canvasCtx.fillStyle = "yellow";
//                 canvasCtx.strokeStyle = "black";
//                 canvasCtx.lineWidth = 2;
//                 const angleText = `${angle.toFixed(1)}°`;
//                 // 텍스트 테두리
//                 canvasCtx.strokeText(angleText, nosePt.x + 10, nosePt.y - 10);
//                 // 텍스트 본문
//                 canvasCtx.fillText(angleText, nosePt.x + 10, nosePt.y - 10);
//                 canvasCtx.restore();

//                 // === 판정 ===
//                 if (angle > 70) {
//                   setStatus("warning");
//                   setShowStatus(true);
//                 } else {
//                   setStatus("normal");
//                   setShowStatus(true);
//                 }
//               } else {
//                 setShowStatus(false);
//               }
//             } else {
//               setShowStatus(false);
//             }
//             // ...생략...
//             // --- 상태 표시 끝 ---
//             canvasCtx && canvasCtx.restore();
//           });
//         }

//         if (webcamRunning === true) {
//           window.requestAnimationFrame(predictWebcam);
//         }
//       } catch (error) {
//         console.error("Error in predictWebcam:", error);
//       }
//     }
//   }, []);

//   return (
//     <div className="video" style={{ position: "relative" }}>
//       <div id="liveView" className="videoView">
//         <button
//           id="webcamButton"
//           className="mdc-button mdc-button--raised"
//           onClick={() => window.parent.postMessage("enableDrawing", "*")}
//         >
//           <span className="mdc-button__label">ENABLE WEBCAM</span>
//         </button>
//         <div style={{ position: "relative" }}>
//           <video
//             id="webcam"
//             style={{ width: "1280px", height: "720px", position: "absolute" }}
//             autoPlay
//             playsInline
//           ></video>

//           <canvas
//             className="output_canvas"
//             id="output_canvas"
//             width="1280"
//             height="720"
//             style={{ position: "absolute", left: "0px", top: "0px" }}
//           ></canvas>
//           {showStatus && (
//             <div
//               ref={statusRef}
//               style={{
//                 position: "absolute",
//                 top: 30,
//                 left: 30,
//                 zIndex: 1000,
//                 fontSize: "2rem",
//                 fontWeight: "bold",
//                 color: status === "warning" ? "red" : "green",
//                 background: "rgba(255,255,255,0.7)",
//                 padding: "10px 24px",
//                 borderRadius: "12px",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//               }}
//             >
//               {status === "warning" ? "WARNING" : "NORMAL"}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewVideo;
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

                // === 판정 ===
                if (angle > angleThreshold) {
                  setStatus("warning");
                  setShowStatus(true);
                } else {
                  setStatus("normal");
                  setShowStatus(true);
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
              onChange={(e) => setAngleThreshold(Number(e.target.value))}
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
