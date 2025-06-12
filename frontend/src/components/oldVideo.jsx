// // // // // import React, { useEffect, useRef, useState } from "react";
// // // // // import styled from "styled-components";

// // // // // const Style = styled.div`
// // // // //   .frame {
// // // // //     display: none;
// // // // //     width: ${(props) => props.width}px;
// // // // //     height: ${(props) => props.height}px;
// // // // //   }
// // // // //   .visible {
// // // // //     display: block !important;
// // // // //   }
// // // // // `;

// // // // // const OldVideo = () => {
// // // // //   const socket = useRef(null);
// // // // //   const camera = useRef(null);
// // // // //   const canvas = useRef(null);
// // // // //   const time = useRef(new Date());
// // // // //   const [frame, setFrame] = useState(null);

// // // // //   const WIDTH = 720;
// // // // //   const HEIGHT = 360;
// // // // //   const FPS = 1;
// // // // //   const TIMER = 1000 / FPS;

// // // // //   useEffect(() => {
// // // // //     startWebSocket();
// // // // //   }, []);

// // // // //   const startWebSocket = () => {
// // // // //     socket.current = new WebSocket("wss://ai-app.p-e.kr/streaming/video");

// // // // //     socket.current.onopen = async () => {
// // // // //       console.log("WebSocket opened");
// // // // //       await startWebCam();
// // // // //     };

// // // // //     socket.current.onmessage = (event) => {
// // // // //       let data = JSON.parse(event.data);
// // // // //       let cur_time = new Date(data.time.slice(0, -1));
// // // // //       console.log(cur_time.toString());
// // // // //       console.log(time.current.toString());

// // // // //       if (data.image && time.current.getTime() <= cur_time.getTime()) {
// // // // //         setFrame("data:image/webp;base64," + data.image);
// // // // //       }
// // // // //       time.current = cur_time;
// // // // //     };

// // // // //     socket.current.onerror = (error) => {
// // // // //       console.error("WebSocket error:", error);
// // // // //     };

// // // // //     return () => {
// // // // //       if (socket.current) socket.current.close();
// // // // //     };
// // // // //   };

// // // // //   const startWebCam = async () => {
// // // // //     try {
// // // // //       const stream = await navigator.mediaDevices.getUserMedia({
// // // // //         video: {
// // // // //           width: { ideal: WIDTH },
// // // // //           height: { ideal: HEIGHT },
// // // // //           frameRate: { ideal: FPS },
// // // // //         },
// // // // //       });
// // // // //       camera.current.srcObject = stream;
// // // // //       camera.current.play();

// // // // //       const ctx = canvas.current.getContext("2d");

// // // // //       const intervalId = setInterval(() => {
// // // // //         ctx.drawImage(
// // // // //           camera.current,
// // // // //           0,
// // // // //           0,
// // // // //           canvas.current.width,
// // // // //           canvas.current.height
// // // // //         );

// // // // //         canvas.current.toBlob(async (blob) => {
// // // // //           if (blob) {
// // // // //             const image = await blobToBase64(blob);
// // // // //             const time = new Date().toISOString();
// // // // //             const jsonData = {
// // // // //               image: image,
// // // // //               time: time,
// // // // //             };
// // // // //             if (
// // // // //               socket.current &&
// // // // //               socket.current.readyState === WebSocket.OPEN
// // // // //             ) {
// // // // //               socket.current.send(JSON.stringify(jsonData));
// // // // //             }
// // // // //             console.log("프레임 캡처됨!", image);
// // // // //           }
// // // // //         }, "image/webp");
// // // // //       }, TIMER);

// // // // //       return () => clearInterval(intervalId);
// // // // //     } catch (error) {
// // // // //       console.error("Error starting webcam:", error);
// // // // //     }
// // // // //   };

// // // // //   const blobToBase64 = (blob) => {
// // // // //     return new Promise((resolve, reject) => {
// // // // //       const reader = new FileReader();
// // // // //       reader.onloadend = () => {
// // // // //         resolve(reader.result);
// // // // //       };
// // // // //       reader.onerror = reject;
// // // // //       reader.readAsDataURL(blob);
// // // // //     });
// // // // //   };

// // // // //   return (
// // // // //     <Style width={WIDTH} height={HEIGHT}>
// // // // //       <h1>Webcam Stream</h1>
// // // // //       <video ref={camera} className="frame" autoPlay />
// // // // //       <canvas ref={canvas} className="frame" />
// // // // //       {frame && (
// // // // //         <img
// // // // //           src={frame}
// // // // //           className={`frame visible`}
// // // // //           id="result"
// // // // //           alt="Webcam Frame"
// // // // //         />
// // // // //       )}
// // // // //     </Style>
// // // // //   );
// // // // // };

// // // // // export default OldVideo;
// // // // import React, { useEffect, useRef, useState } from "react";
// // // // import styled from "styled-components";

// // // // const Style = styled.div`
// // // //   .frame {
// // // //     display: none;
// // // //     width: ${(props) => props.width}px;
// // // //     height: ${(props) => props.height}px;
// // // //   }
// // // //   .visible {
// // // //     display: block !important;
// // // //   }
// // // // `;

// // // // const OldVideo = () => {
// // // //   const socket = useRef(null);
// // // //   const camera = useRef(null);
// // // //   const canvas = useRef(null);
// // // //   const time = useRef(new Date());
// // // //   const [frame, setFrame] = useState(null);

// // // //   const WIDTH = 720;
// // // //   const HEIGHT = 360;
// // // //   const FPS = 1;
// // // //   const TIMER = 1000 / FPS;

// // // //   // 캔버스 변경 감지용
// // // //   const prevCanvasData = useRef(null);

// // // //   useEffect(() => {
// // // //     startWebSocket();
// // // //   }, []);

// // // //   const startWebSocket = () => {
// // // //     socket.current = new WebSocket("wss://ai-app.p-e.kr/streaming/video");

// // // //     socket.current.onopen = async () => {
// // // //       console.log("WebSocket opened");
// // // //       await startWebCam();
// // // //     };

// // // //     socket.current.onmessage = (event) => {
// // // //       let data = JSON.parse(event.data);
// // // //       let cur_time = new Date(data.time.slice(0, -1));
// // // //       console.log(cur_time.toString());
// // // //       console.log(time.current.toString());

// // // //       if (data.image && time.current.getTime() <= cur_time.getTime()) {
// // // //         setFrame("data:image/webp;base64," + data.image);
// // // //       }
// // // //       time.current = cur_time;
// // // //     };

// // // //     socket.current.onerror = (error) => {
// // // //       console.error("WebSocket error:", error);
// // // //     };

// // // //     return () => {
// // // //       if (socket.current) socket.current.close();
// // // //     };
// // // //   };

// // // //   const startWebCam = async () => {
// // // //     try {
// // // //       const stream = await navigator.mediaDevices.getUserMedia({
// // // //         video: {
// // // //           width: { ideal: WIDTH },
// // // //           height: { ideal: HEIGHT },
// // // //           frameRate: { ideal: FPS },
// // // //         },
// // // //       });
// // // //       camera.current.srcObject = stream;
// // // //       camera.current.play();

// // // //       const ctx = canvas.current.getContext("2d");

// // // //       const intervalId = setInterval(() => {
// // // //         ctx.drawImage(
// // // //           camera.current,
// // // //           0,
// // // //           0,
// // // //           canvas.current.width,
// // // //           canvas.current.height
// // // //         );

// // // //         // === 캔버스 변경 감지 및 로그 ===
// // // //         const imageData = ctx.getImageData(
// // // //           0,
// // // //           0,
// // // //           canvas.current.width,
// // // //           canvas.current.height
// // // //         ).data;
// // // //         if (prevCanvasData.current) {
// // // //           let changed = false;
// // // //           for (let i = 0; i < imageData.length; i += 20) {
// // // //             // 20픽셀마다 비교 (속도 최적화)
// // // //             if (imageData[i] !== prevCanvasData.current[i]) {
// // // //               changed = true;
// // // //               break;
// // // //             }
// // // //           }
// // // //           if (changed) {
// // // //             console.log("캔버스 내용이 변경되었습니다.");
// // // //           }
// // // //         }
// // // //         prevCanvasData.current = new Uint8ClampedArray(imageData);

// // // //         canvas.current.toBlob(async (blob) => {
// // // //           if (blob) {
// // // //             const image = await blobToBase64(blob);
// // // //             const time = new Date().toISOString();
// // // //             const jsonData = {
// // // //               image: image,
// // // //               time: time,
// // // //             };
// // // //             if (
// // // //               socket.current &&
// // // //               socket.current.readyState === WebSocket.OPEN
// // // //             ) {
// // // //               socket.current.send(JSON.stringify(jsonData));
// // // //             }
// // // //             console.log("프레임 캡처됨!", image);
// // // //           }
// // // //         }, "image/webp");
// // // //       }, TIMER);

// // // //       return () => clearInterval(intervalId);
// // // //     } catch (error) {
// // // //       console.error("Error starting webcam:", error);
// // // //     }
// // // //   };

// // // //   const blobToBase64 = (blob) => {
// // // //     return new Promise((resolve, reject) => {
// // // //       const reader = new FileReader();
// // // //       reader.onloadend = () => {
// // // //         resolve(reader.result);
// // // //       };
// // // //       reader.onerror = reject;
// // // //       reader.readAsDataURL(blob);
// // // //     });
// // // //   };

// // // //   return (
// // // //     <Style width={WIDTH} height={HEIGHT}>
// // // //       <h1>Webcam Stream</h1>
// // // //       <video ref={camera} className="frame" autoPlay />
// // // //       <canvas ref={canvas} className="frame" />
// // // //       {frame && (
// // // //         <img
// // // //           src={frame}
// // // //           className={`frame visible`}
// // // //           id="result"
// // // //           alt="Webcam Frame"
// // // //         />
// // // //       )}
// // // //     </Style>
// // // //   );
// // // // };

// // // // export default OldVideo;
// // // import React, { useEffect, useRef, useState } from "react";
// // // import styled from "styled-components";

// // // const Style = styled.div`
// // //   .frame {
// // //     display: none;
// // //     width: ${(props) => props.width}px;
// // //     height: ${(props) => props.height}px;
// // //   }
// // //   .visible {
// // //     display: block !important;
// // //   }
// // // `;

// // // const OldVideo = () => {
// // //   const socket = useRef(null);
// // //   const camera = useRef(null);
// // //   const canvas = useRef(null);
// // //   const time = useRef(new Date());
// // //   const [frame, setFrame] = useState(null);

// // //   const WIDTH = 720;
// // //   const HEIGHT = 360;
// // //   const FPS = 1;
// // //   const TIMER = 1000 / FPS;

// // //   // 캔버스 변경 감지용
// // //   const prevCanvasData = useRef(null);
// // //   const canvasChangeCount = useRef(0); // 변경 카운트

// // //   useEffect(() => {
// // //     startWebSocket();
// // //   }, []);

// // //   const startWebSocket = () => {
// // //     socket.current = new WebSocket("wss://ai-app.p-e.kr/streaming/video");

// // //     socket.current.onopen = async () => {
// // //       console.log("WebSocket opened");
// // //       await startWebCam();
// // //     };

// // //     socket.current.onmessage = (event) => {
// // //       let data = JSON.parse(event.data);
// // //       let cur_time = new Date(data.time.slice(0, -1));
// // //       console.log(cur_time.toString());
// // //       console.log(time.current.toString());

// // //       if (data.image && time.current.getTime() <= cur_time.getTime()) {
// // //         setFrame("data:image/webp;base64," + data.image);
// // //       }
// // //       time.current = cur_time;
// // //     };

// // //     socket.current.onerror = (error) => {
// // //       console.error("WebSocket error:", error);
// // //     };

// // //     return () => {
// // //       if (socket.current) socket.current.close();
// // //     };
// // //   };

// // //   const startWebCam = async () => {
// // //     try {
// // //       const stream = await navigator.mediaDevices.getUserMedia({
// // //         video: {
// // //           width: { ideal: WIDTH },
// // //           height: { ideal: HEIGHT },
// // //           frameRate: { ideal: FPS },
// // //         },
// // //       });
// // //       camera.current.srcObject = stream;
// // //       camera.current.play();

// // //       const ctx = canvas.current.getContext("2d");

// // //       const intervalId = setInterval(() => {
// // //         ctx.drawImage(
// // //           camera.current,
// // //           0,
// // //           0,
// // //           canvas.current.width,
// // //           canvas.current.height
// // //         );

// // //         // === 캔버스 변경 감지 및 로그 ===
// // //         const imageData = ctx.getImageData(
// // //           0,
// // //           0,
// // //           canvas.current.width,
// // //           canvas.current.height
// // //         ).data;
// // //         if (prevCanvasData.current) {
// // //           let changed = false;
// // //           for (let i = 0; i < imageData.length; i += 20) {
// // //             // 20픽셀마다 비교 (속도 최적화)
// // //             if (imageData[i] !== prevCanvasData.current[i]) {
// // //               changed = true;
// // //               break;
// // //             }
// // //           }
// // //           if (changed) {
// // //             canvasChangeCount.current += 1;
// // //             console.log(
// // //               "캔버스 내용이 변경되었습니다. 총 변경 횟수:",
// // //               canvasChangeCount.current
// // //             );
// // //           }
// // //         }
// // //         prevCanvasData.current = new Uint8ClampedArray(imageData);

// // //         canvas.current.toBlob(async (blob) => {
// // //           if (blob) {
// // //             const image = await blobToBase64(blob);
// // //             const time = new Date().toISOString();
// // //             const jsonData = {
// // //               image: image,
// // //               time: time,
// // //             };
// // //             if (
// // //               socket.current &&
// // //               socket.current.readyState === WebSocket.OPEN
// // //             ) {
// // //               socket.current.send(JSON.stringify(jsonData));
// // //             }
// // //             console.log("프레임 캡처됨!", image);
// // //           }
// // //         }, "image/webp");
// // //       }, TIMER);

// // //       return () => clearInterval(intervalId);
// // //     } catch (error) {
// // //       console.error("Error starting webcam:", error);
// // //     }
// // //   };

// // //   const blobToBase64 = (blob) => {
// // //     return new Promise((resolve, reject) => {
// // //       const reader = new FileReader();
// // //       reader.onloadend = () => {
// // //         resolve(reader.result);
// // //       };
// // //       reader.onerror = reject;
// // //       reader.readAsDataURL(blob);
// // //     });
// // //   };

// // //   return (
// // //     <Style width={WIDTH} height={HEIGHT}>
// // //       <h1>Webcam Stream</h1>
// // //       <video ref={camera} className="frame" autoPlay />
// // //       <canvas ref={canvas} className="frame" />
// // //       {frame && (
// // //         <img
// // //           src={frame}
// // //           className={`frame visible`}
// // //           id="result"
// // //           alt="Webcam Frame"
// // //         />
// // //       )}
// // //     </Style>
// // //   );
// // // };

// // // export default OldVideo;
// // import React, { useEffect, useRef, useState } from "react";
// // import styled from "styled-components";

// // const Style = styled.div`
// //   .frame {
// //     display: none;
// //     width: ${(props) => props.width}px;
// //     height: ${(props) => props.height}px;
// //   }
// //   .visible {
// //     display: block !important;
// //   }
// // `;

// // const OldVideo = () => {
// //   const socket = useRef(null);
// //   const camera = useRef(null);
// //   const canvas = useRef(null);
// //   const time = useRef(new Date());
// //   const [frame, setFrame] = useState(null);

// //   const WIDTH = 720;
// //   const HEIGHT = 360;
// //   const FPS = 1;
// //   const TIMER = 1000 / FPS;

// //   // 캔버스 변경 감지용
// //   const prevCanvasData = useRef(null);
// //   const canvasChangeCount = useRef(0); // 변경 카운트

// //   useEffect(() => {
// //     startWebSocket();
// //   }, []);

// //   const startWebSocket = () => {
// //     socket.current = new WebSocket("wss://ai-app.p-e.kr/streaming/video");

// //     socket.current.onopen = async () => {
// //       console.log("WebSocket opened");
// //       await startWebCam();
// //     };

// //     socket.current.onmessage = (event) => {
// //       let data = JSON.parse(event.data);
// //       let cur_time = new Date(data.time.slice(0, -1));
// //       console.log(cur_time.toString());
// //       console.log(time.current.toString());

// //       if (data.image && time.current.getTime() <= cur_time.getTime()) {
// //         setFrame("data:image/webp;base64," + data.image);
// //       }
// //       time.current = cur_time;
// //     };

// //     socket.current.onerror = (error) => {
// //       console.error("WebSocket error:", error);
// //     };

// //     return () => {
// //       if (socket.current) socket.current.close();
// //     };
// //   };

// //   const startWebCam = async () => {
// //     try {
// //       const stream = await navigator.mediaDevices.getUserMedia({
// //         video: {
// //           width: { ideal: WIDTH },
// //           height: { ideal: HEIGHT },
// //           frameRate: { ideal: FPS },
// //         },
// //       });
// //       camera.current.srcObject = stream;
// //       camera.current.play();

// //       const ctx = canvas.current.getContext("2d");

// //       const intervalId = setInterval(() => {
// //         ctx.drawImage(
// //           camera.current,
// //           0,
// //           0,
// //           canvas.current.width,
// //           canvas.current.height
// //         );

// //         // === 캔버스 변경 감지 및 로그 ===
// //         const imageData = ctx.getImageData(
// //           0,
// //           0,
// //           canvas.current.width,
// //           canvas.current.height
// //         ).data;
// //         if (prevCanvasData.current) {
// //           let changed = false;
// //           for (let i = 0; i < imageData.length; i += 20) {
// //             // 20픽셀마다 비교 (속도 최적화)
// //             if (imageData[i] !== prevCanvasData.current[i]) {
// //               changed = true;
// //               break;
// //             }
// //           }
// //           if (changed) {
// //             canvasChangeCount.current += 1;
// //             console.log(
// //               "캔버스 내용이 변경되었습니다. 총 변경 횟수:",
// //               canvasChangeCount.current
// //             );
// //             // 20번 변경 시 알람
// //             if (canvasChangeCount.current === 20) {
// //               const audio = new Audio("https://cdn-sv.p-e.kr/assets/alarm.mp3");
// //               audio.play();
// //               console.log("20번 변경! 알람 울림");
// //             }
// //           }
// //         }
// //         prevCanvasData.current = new Uint8ClampedArray(imageData);

// //         canvas.current.toBlob(async (blob) => {
// //           if (blob) {
// //             const image = await blobToBase64(blob);
// //             const time = new Date().toISOString();
// //             const jsonData = {
// //               image: image,
// //               time: time,
// //             };
// //             if (
// //               socket.current &&
// //               socket.current.readyState === WebSocket.OPEN
// //             ) {
// //               socket.current.send(JSON.stringify(jsonData));
// //             }
// //             console.log("프레임 캡처됨!", image);
// //           }
// //         }, "image/webp");
// //       }, TIMER);

// //       return () => clearInterval(intervalId);
// //     } catch (error) {
// //       console.error("Error starting webcam:", error);
// //     }
// //   };

// //   const blobToBase64 = (blob) => {
// //     return new Promise((resolve, reject) => {
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         resolve(reader.result);
// //       };
// //       reader.onerror = reject;
// //       reader.readAsDataURL(blob);
// //     });
// //   };

// //   return (
// //     <Style width={WIDTH} height={HEIGHT}>
// //       <h1>Webcam Stream</h1>
// //       <video ref={camera} className="frame" autoPlay />
// //       <canvas ref={canvas} className="frame" />
// //       {frame && (
// //         <img
// //           src={frame}
// //           className={`frame visible`}
// //           id="result"
// //           alt="Webcam Frame"
// //         />
// //       )}
// //     </Style>
// //   );
// // };

// // export default OldVideo;
// import React, { useEffect, useRef, useState } from "react";
// import styled from "styled-components";

// const Style = styled.div`
//   .frame {
//     display: none;
//     width: ${(props) => props.width}px;
//     height: ${(props) => props.height}px;
//   }
//   .visible {
//     display: block !important;
//   }
// `;

// const OldVideo = () => {
//   const socket = useRef(null);
//   const camera = useRef(null);
//   const canvas = useRef(null);
//   const time = useRef(new Date());
//   const [frame, setFrame] = useState(null);

//   const WIDTH = 720;
//   const HEIGHT = 360;
//   const FPS = 1;
//   const TIMER = 1000 / FPS;

//   // frame 변경 카운트
//   const frameChangeCount = useRef(0);
//   const prevFrame = useRef(null);

//   useEffect(() => {
//     startWebSocket();
//   }, []);

//   useEffect(() => {
//     // frame이 바뀔 때마다 카운트 및 알람
//     if (frame && frame !== prevFrame.current) {
//       frameChangeCount.current += 1;
//       console.log("frame 변경! 총 변경 횟수:", frameChangeCount.current);
//       if (frameChangeCount.current % 10 === 0) {
//         const audio = new Audio("https://cdn-sv.p-e.kr/assets/alarm.mp3");
//         audio.play();
//         console.log("frame 20번 변경! 알람 울림");
//       }
//       prevFrame.current = frame;
//     }
//   }, [frame]);

//   const startWebSocket = () => {
//     socket.current = new WebSocket("wss://ai-app.p-e.kr/streaming/video");

//     socket.current.onopen = async () => {
//       console.log("WebSocket opened");
//       await startWebCam();
//     };

//     socket.current.onmessage = (event) => {
//       let data = JSON.parse(event.data);
//       let cur_time = new Date(data.time.slice(0, -1));
//       console.log(cur_time.toString());
//       console.log(time.current.toString());

//       if (data.image && time.current.getTime() <= cur_time.getTime()) {
//         setFrame("data:image/webp;base64," + data.image);
//       }
//       time.current = cur_time;
//     };

//     socket.current.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     return () => {
//       if (socket.current) socket.current.close();
//     };
//   };

//   const startWebCam = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: { ideal: WIDTH },
//           height: { ideal: HEIGHT },
//           frameRate: { ideal: FPS },
//         },
//       });
//       camera.current.srcObject = stream;
//       camera.current.play();

//       const ctx = canvas.current.getContext("2d");

//       const intervalId = setInterval(() => {
//         ctx.drawImage(
//           camera.current,
//           0,
//           0,
//           canvas.current.width,
//           canvas.current.height
//         );

//         canvas.current.toBlob(async (blob) => {
//           if (blob) {
//             const image = await blobToBase64(blob);
//             const time = new Date().toISOString();
//             const jsonData = {
//               image: image,
//               time: time,
//             };
//             if (
//               socket.current &&
//               socket.current.readyState === WebSocket.OPEN
//             ) {
//               socket.current.send(JSON.stringify(jsonData));
//             }
//             console.log("프레임 캡처됨!", image);
//           }
//         }, "image/webp");
//       }, TIMER);

//       return () => clearInterval(intervalId);
//     } catch (error) {
//       console.error("Error starting webcam:", error);
//     }
//   };

//   const blobToBase64 = (blob) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         resolve(reader.result);
//       };
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   };

//   return (
//     <Style width={WIDTH} height={HEIGHT}>
//       <h1>Webcam Stream</h1>
//       <video ref={camera} className="frame" autoPlay />
//       <canvas ref={canvas} className="frame" />
//       {frame && (
//         <img
//           src={frame}
//           className={`frame visible`}
//           id="result"
//           alt="Webcam Frame"
//         />
//       )}
//     </Style>
//   );
// };

// export default OldVideo;
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Style = styled.div`
  .frame {
    display: none;
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
  }
  .visible {
    display: block !important;
  }
`;

const OldVideo = () => {
  const socket = useRef(null);
  const camera = useRef(null);
  const canvas = useRef(null);
  const time = useRef(new Date());
  const [frame, setFrame] = useState(null);

  const [frameList, setFrameList] = useState([]); // 프레임 리스트

  const WIDTH = 720;
  const HEIGHT = 360;
  const FPS = 1;
  const TIMER = 1000 / FPS;

  // frame 변경 카운트
  const frameChangeCount = useRef(0);
  const prevFrame = useRef(null);

  useEffect(() => {
    startWebSocket();
  }, []);

  useEffect(() => {
    // frame이 바뀔 때마다 카운트 및 알람, img 추가
    if (frame && frame !== prevFrame.current) {
      frameChangeCount.current += 1;
      console.log("frame 변경! 총 변경 횟수:", frameChangeCount.current);
      if (frameChangeCount.current % 10 === 0) {
        const audio = new Audio("https://cdn-sv.p-e.kr/assets/alarm.mp3");
        audio.play();
        console.log("frame 20번 변경! 알람 울림");
      }
      prevFrame.current = frame;
      setFrameList((prev) => [...prev, frame]); // 프레임 리스트에 추가
    }
  }, [frame]);

  const startWebSocket = () => {
    socket.current = new WebSocket("wss://ai-app.p-e.kr/streaming/video");

    socket.current.onopen = async () => {
      console.log("WebSocket opened");
      await startWebCam();
    };

    socket.current.onmessage = (event) => {
      let data = JSON.parse(event.data);
      let cur_time = new Date(data.time.slice(0, -1));
      console.log(cur_time.toString());
      console.log(time.current.toString());

      if (data.image && time.current.getTime() <= cur_time.getTime()) {
        setFrame("data:image/webp;base64," + data.image);
      }
      time.current = cur_time;
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (socket.current) socket.current.close();
    };
  };

  const startWebCam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: WIDTH },
          height: { ideal: HEIGHT },
          frameRate: { ideal: FPS },
        },
      });
      camera.current.srcObject = stream;
      camera.current.play();

      const ctx = canvas.current.getContext("2d");

      const intervalId = setInterval(() => {
        ctx.drawImage(
          camera.current,
          0,
          0,
          canvas.current.width,
          canvas.current.height
        );

        canvas.current.toBlob(async (blob) => {
          if (blob) {
            const image = await blobToBase64(blob);
            const time = new Date().toISOString();
            const jsonData = {
              image: image,
              time: time,
            };
            if (
              socket.current &&
              socket.current.readyState === WebSocket.OPEN
            ) {
              socket.current.send(JSON.stringify(jsonData));
            }
            console.log("프레임 캡처됨!", image);
          }
        }, "image/webp");
      }, TIMER);

      return () => clearInterval(intervalId);
    } catch (error) {
      console.error("Error starting webcam:", error);
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <Style width={WIDTH} height={HEIGHT}>
      <h1>Webcam Stream</h1>
      <video ref={camera} className="frame" autoPlay />
      <canvas ref={canvas} className="frame" />
      {frame && (
        <img
          src={frame}
          className={`frame visible`}
          id="result"
          alt="Webcam Frame"
        />
      )}
      {/* 프레임이 바뀔 때마다 아래에 img 추가 */}
      <div style={{ marginTop: "24px" }}>
        {frameList.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`frame-${idx}`}
            style={{
              width: "180px",
              height: "90px",
              marginRight: "8px",
              marginBottom: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        ))}
      </div>
    </Style>
  );
};

export default OldVideo;
