// import React, { useEffect, useRef, useState } from "react";
// import styled from "styled-components";

// const Style = styled.div``;

// const Video = () => {
//   const socket = useRef(null);
//   const camera = useRef(null);
//   const interval = useRef(null);
//   const [frame, setFrame] = useState(null);

//   useEffect(() => {
//     try {
//       startWebSocket();
//     } catch (error) {
//       alert("Error starting video: ", error);
//     }
//     return () => {
//       if (interval.current) clearInterval(interval.current);
//       if (socket.current) socket.current.close();
//     };
//   }, []);

//   const startWebSocket = () => {
//     const url = "wss://ai-app.p-e.kr/streaming/video";
//     socket.current = new WebSocket(url);

//     socket.current.onopen = async () => {
//       console.log("WebSocket opened");
//       startWebCam();
//     };

//     socket.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.image) {
//         setFrame(data.image);
//       }
//     };

//     socket.current.onerror = (error) => {
//       alert("WebSocket error:", error);
//     };
//   };

//   const startWebCam = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       camera.current.srcObject = stream;
//       camera.current.play();

//       interval.current = setInterval(() => {
//         captureImage();
//       }, 1000);
//     } catch (error) {
//       alert("Error starting webcam: ", error);
//     }
//   };

//   const captureImage = () => {
//     if (!camera.current) return;
//     try {
//       const canvas = document.createElement("canvas");
//       const context = canvas.getContext("2d");
//       canvas.width = camera.current.videoWidth;
//       canvas.height = camera.current.videoHeight;

//       context.drawImage(camera.current, 0, 0, canvas.width, canvas.height);
//       const imageData = canvas.toDataURL("image/jpeg");

//       if (socket.current.readyState === WebSocket.OPEN) {
//         socket.current.send(JSON.stringify({ image: imageData }));
//       }
//     } catch (error) {
//       alert("Error capturing image: ", error);
//     }
//   };

//   return (
//     <Style>
//       <h1>Webcam Stream</h1>
//       <video ref={camera} style={{ display: "none" }} autoPlay />
//       {frame && <img src={frame} style={{ width: "100%" }} />}
//     </Style>
//   );
// };

// export default Video;
// import React, { useEffect, useRef, useState } from "react";
// import styled from "styled-components";

// const Style = styled.div``;

// const Video = () => {
//   const socket = useRef(null);
//   const camera = useRef(null);
//   const canvasRef = useRef(null);
//   const [frame, setFrame] = useState(null);

//   useEffect(() => {
//     startWebSocket();

//     return () => {
//       if (socket.current) socket.current.close();
//     };
//   }, []);

//   const startWebSocket = () => {
//     const url = "wss://ai-app.p-e.kr/streaming/video";
//     socket.current = new WebSocket(url);

//     socket.current.onopen = async () => {
//       console.log("WebSocket opened");
//       await startWebCam();
//     };

//     socket.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.image) {
//         setFrame(data.image);
//       }
//     };

//     socket.current.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };
//   };

//   const startWebCam = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       camera.current.srcObject = stream;
//       camera.current.play();

//       // 캔버스를 사용하여 비디오 프레임을 캡처
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");

//       const processFrame = () => {
//         if (camera.current && frame.current) {
//           // 비디오 프레임을 캔버스에 그리기
//           ctx.drawImage(camera.current, 0, 0, canvas.width, canvas.height);

//           // 캔버스에서 이미지 데이터 가져오기
//           canvas.toBlob((blob) => {
//             if (blob) {
//               const frameURL = URL.createObjectURL(blob);

//               // 웹소켓을 통해 프레임 데이터 전송
//               if (
//                 socket.current &&
//                 socket.current.readyState === WebSocket.OPEN
//               ) {
//                 socket.current.send(blob);
//               }

//               // 상태 업데이트 (뷰어에 표시)
//               setFrame(frameURL);
//             }
//           }, "image/png");

//           // 다음 프레임을 처리하기 위해 재귀 호출
//           requestAnimationFrame(processFrame);
//         }
//       };

//       processFrame(); // 프레임 처리 시작
//     } catch (error) {
//       console.error("Error starting webcam:", error);
//     }
//   };

//   return (
//     <Style>
//       <h1>Webcam Stream</h1>
//       <video ref={camera} style={{ display: "none" }} autoPlay />
//       <canvas
//         ref={canvasRef}
//         style={{ display: "none" }}
//         width={640}
//         height={480}
//       />
//       {frame && (
//         <img src={frame} style={{ width: "100%" }} alt="Webcam Frame" />
//       )}
//     </Style>
//   );
// };

// export default Video;
// import React, { useEffect, useRef, useState } from "react";
// import styled from "styled-components";

// const Style = styled.div``;

// const Video = () => {
//   const socket = useRef(null);
//   const camera = useRef(null);
//   const canvasRef = useRef(null);
//   const [frame, setFrame] = useState(null);

//   useEffect(() => {
//     startWebSocket();

//     return () => {
//       if (socket.current) socket.current.close();
//     };
//   }, []);

//   const startWebSocket = () => {
//     const url = "wss://ai-app.p-e.kr/streaming/video";
//     socket.current = new WebSocket(url);

//     socket.current.onopen = async () => {
//       console.log("WebSocket opened");
//       await startWebCam();
//     };

//     socket.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.image) {
//         setFrame(data.image);
//       }
//     };

//     socket.current.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };
//   };

//   const startWebCam = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       camera.current.srcObject = stream;
//       camera.current.play();

//       // 캔버스를 사용하여 비디오 프레임을 캡처
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");

//       const processFrame = () => {
//         if (camera.current && frame.current) {
//           // 비디오 프레임을 캔버스에 그리기
//           ctx.drawImage(camera.current, 0, 0, canvas.width, canvas.height);

//           // 캔버스에서 이미지 데이터 가져오기
//           canvas.toBlob((blob) => {
//             if (blob) {
//               const frameURL = URL.createObjectURL(blob);

//               // 웹소켓을 통해 프레임 데이터 전송
//               if (
//                 socket.current &&
//                 socket.current.readyState === WebSocket.OPEN
//               ) {
//                 socket.current.send(blob);
//               }

//               // 상태 업데이트 (뷰어에 표시)
//               setFrame(frameURL);
//             }
//           }, "image/png");

//           // 다음 프레임을 처리하기 위해 재귀 호출
//           requestAnimationFrame(processFrame);
//         }
//       };

//       processFrame(); // 프레임 처리 시작
//     } catch (error) {
//       console.error("Error starting webcam:", error);
//     }
//   };

//   return (
//     <Style>
//       <h1>Webcam Stream</h1>
//       <video ref={camera} style={{ display: "none" }} autoPlay />
//       <canvas
//         ref={canvasRef}
//         style={{ display: "none" }}
//         width={640}
//         height={480}
//       />
//       {frame && (
//         <img src={frame} style={{ width: "100%" }} alt="Webcam Frame" />
//       )}
//     </Style>
//   );
// };

// export default Video;
// import React, { useEffect, useRef, useState } from "react";
// import styled from "styled-components";

// const Style = styled.div``;

// const Video = () => {
//   const socket = useRef(null);
//   const camera = useRef(null);
//   const canvasRef = useRef(null);
//   const [frame, setFrame] = useState(null);

//   useEffect(() => {
//     startWebSocket();

//     return () => {
//       if (socket.current) socket.current.close();
//     };
//   }, []);

//   const startWebSocket = () => {
//     const url = "wss://ai-app.p-e.kr/streaming/video";
//     socket.current = new WebSocket(url);

//     socket.current.onopen = async () => {
//       console.log("WebSocket opened");
//       await startWebCam();
//     };

//     socket.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.image) {
//         setFrame(data.image);
//       }
//     };

//     socket.current.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };
//   };

//   const startWebCam = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       camera.current.srcObject = stream;
//       camera.current.play();

//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");

//       const processFrame = () => {
//         const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//         if (camera.current) {
//           ctx.drawImage(camera.current, 0, 0, canvas.width, canvas.height);

//           canvas.toBlob((blob) => {
//             if (blob) {
//               const frameURL = URL.createObjectURL(blob);

//               // 웹소켓을 통해 프레임 데이터 전송
//               if (
//                 socket.current &&
//                 socket.current.readyState === WebSocket.OPEN
//               ) {
//                 socket.current.send(blob);
//               }

//               // 상태 업데이트 (뷰어에 표시)
//               setFrame(frameURL);
//               sleep(100); // 1초 대기
//               // 프레임 캡처 시 추가 작업 (예: 콘솔에 로그 출력)
//               console.log("프레임 캡처됨!", frameURL); // 이벤트 발생
//             }
//           }, "image/png");
//         }

//         // 다음 프레임을 처리하기 위해 재귀 호출
//         requestAnimationFrame(processFrame);
//       };

//       processFrame(); // 프레임 처리 시작
//     } catch (error) {
//       console.error("Error starting webcam:", error);
//     }
//   };

//   return (
//     <Style>
//       <h1>Webcam Stream</h1>
//       <video ref={camera} style={{ display: "none" }} autoPlay />
//       <canvas
//         ref={canvasRef}
//         style={{ display: "none" }}
//         width={640}
//         height={480}
//       />
//       {frame && (
//         <img src={frame} style={{ width: "100%" }} alt="Webcam Frame" />
//       )}
//     </Style>
//   );
// };

// export default Video;
// import React, { useEffect, useRef, useState } from "react";
// import styled from "styled-components";

// const Style = styled.div``;

// const Video = () => {
//   const socket = useRef(null);
//   const camera = useRef(null);
//   const canvas = useRef(null);
//   const [frame, setFrame] = useState(null);

//   const frameRate = 10; // 초당 프레임 수 (FPS)
//   const captureInterval = 1000 / frameRate; // 프레임 캡처 간격 (ms)

//   useEffect(() => {
//     startWebSocket();

//     return () => {
//       if (socket.current) socket.current.close();
//     };
//   }, []);

//   const startWebSocket = () => {
//     const url = "wss://ai-app.p-e.kr/streaming/video";
//     socket.current = new WebSocket(url);

//     socket.current.onopen = async () => {
//       console.log("WebSocket opened");
//       await startWebCam();
//     };

//     socket.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.image) {
//         setFrame(data.image);
//       }
//     };

//     socket.current.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };
//   };

//   const startWebCam = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: { ideal: 1280 }, // 원하는 해상도
//           height: { ideal: 720 }, // 원하는 해상도
//           frameRate: { ideal: frameRate }, // 원하는 프레임 속도
//         },
//       });
//       camera.current.srcObject = stream;
//       camera.current.play();

//       const canvas = canvas.current;
//       const ctx = canvas.getContext("2d");

//       const processFrame = () => {
//         ctx.drawImage(camera.current, 0, 0, canvas.width, canvas.height);

//         canvas.toBlob((blob) => {
//           if (blob) {
//             const frameURL = URL.createObjectURL(blob);

//             // 웹소켓을 통해 프레임 데이터 전송
//             if (
//               socket.current &&
//               socket.current.readyState === WebSocket.OPEN
//             ) {
//               socket.current.send(blob);
//             }

//             // 상태 업데이트 (뷰어에 표시)
//             setFrame(frameURL);
//             console.log("프레임 캡처됨!", frameURL); // 이벤트 발생
//           }
//         }, "image/png");
//       };

//       const intervalId = setInterval(processFrame, captureInterval); // 일정 간격으로 프레임 처리

//       return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
//     } catch (error) {
//       console.error("Error starting webcam:", error);
//     }
//   };

//   return (
//     <Style>
//       <h1>Webcam Stream</h1>
//       <video ref={camera} style={{ display: "none" }} autoPlay />
//       <canvas
//         ref={canvas}
//         style={{ display: "none" }}
//         width={640}
//         height={480}
//       />
//       {frame && (
//         <img src={frame} style={{ width: "100%" }} alt="Webcam Frame" />
//       )}
//     </Style>
//   );
// };

// export default Video;
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Style = styled.div``;

const Video = () => {
  const socket = useRef(null);
  const camera = useRef(null);
  const canvasRef = useRef(null);
  const [frame, setFrame] = useState(null);

  const frameRate = 10;
  const captureInterval = 1000 / frameRate;

  useEffect(() => {
    startWebSocket();

    return () => {
      if (socket.current) socket.current.close();
    };
  }, []);

  const startWebSocket = () => {
    const url = "wss://ai-app.p-e.kr/streaming/video";
    socket.current = new WebSocket(url);

    socket.current.onopen = async () => {
      console.log("WebSocket opened");
      await startWebCam();
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.image) {
        setFrame(data.image);
      }
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const startWebCam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 720 }, // 원하는 해상도
          height: { ideal: 1280 }, // 원하는 해상도
          frameRate: { ideal: frameRate }, // 원하는 프레임 속도
        },
      });
      camera.current.srcObject = stream;
      camera.current.play();

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const processFrame = () => {
        ctx.drawImage(camera.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const frameURL = URL.createObjectURL(blob);

            // 웹소켓을 통해 프레임 데이터 전송
            if (
              socket.current &&
              socket.current.readyState === WebSocket.OPEN
            ) {
              socket.current.send(blob);
            }

            // 상태 업데이트 (뷰어에 표시)
            setFrame(frameURL);
            console.log("프레임 캡처됨!", frameURL); // 이벤트 발생
          }
        }, "image/png");
      };

      const intervalId = setInterval(processFrame, captureInterval); // 일정 간격으로 프레임 처리

      return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
    } catch (error) {
      console.error("Error starting webcam:", error);
    }
  };

  return (
    <Style>
      <h1>Webcam Stream</h1>
      <video ref={camera} style={{ display: "none" }} autoPlay />
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width={640}
        height={480}
      />
      {frame && (
        <img src={frame} style={{ width: "100%" }} alt="Webcam Frame" />
      )}
    </Style>
  );
};

export default Video;
