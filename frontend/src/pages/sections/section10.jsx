// import React, { useRef, useEffect, useState } from "react";
// import Section from "../utils/section";
// import styled from "styled-components";

// const Style = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   height: 700px;
//   position: relative;
//   overflow: hidden;
//   margin: 0 auto;
// `;

// const DrawingCanvas = styled.canvas`
//   position: absolute;
//   left: 50%;
//   top: 50%;
//   transform: translate(-50%, -50%);
//   z-index: 10;
// `;

// const IframeWrapper = styled.div`
//   position: relative;
//   width: 700px;
//   height: 700px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

// const Section10 = () => {
//   const canvasRef = useRef(null);
//   const [canDraw, setCanDraw] = useState(false);
//   const [canvasVisible, setCanvasVisible] = useState(true);

//   useEffect(() => {
//     // 메시지 리스너
//     const handleMessage = (event) => {
//       if (event.data === "enableDrawing") {
//         setCanDraw(true);
//       }
//     };
//     window.addEventListener("message", handleMessage);

//     // Q 키로 캔버스 show/hide 토글
//     const handleKeyDown = (e) => {
//       if (e.key === "q" || e.key === "Q") {
//         setCanvasVisible((prev) => !prev);
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("message", handleMessage);
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   useEffect(() => {
//     if (!canDraw) return;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     let drawing = false;
//     let lastX = 0;
//     let lastY = 0;

//     const handleMouseDown = (e) => {
//       drawing = true;
//       const rect = canvas.getBoundingClientRect();
//       lastX = e.clientX - rect.left;
//       lastY = e.clientY - rect.top;
//     };

//     const handleMouseMove = (e) => {
//       if (!drawing) return;
//       const rect = canvas.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
//       ctx.strokeStyle = "#ff0000";
//       ctx.lineWidth = 3;
//       ctx.beginPath();
//       ctx.moveTo(lastX, lastY);
//       ctx.lineTo(x, y);
//       ctx.stroke();
//       lastX = x;
//       lastY = y;
//     };

//     const handleMouseUp = () => {
//       drawing = false;
//     };

//     canvas.addEventListener("mousedown", handleMouseDown);
//     canvas.addEventListener("mousemove", handleMouseMove);
//     canvas.addEventListener("mouseup", handleMouseUp);
//     canvas.addEventListener("mouseleave", handleMouseUp);

//     return () => {
//       canvas.removeEventListener("mousedown", handleMouseDown);
//       canvas.removeEventListener("mousemove", handleMouseMove);
//       canvas.removeEventListener("mouseup", handleMouseUp);
//       canvas.removeEventListener("mouseleave", handleMouseUp);
//     };
//   }, [canDraw]);

//   return (
//     <Section
//       src="https://cdn-sv.p-e.kr/assets/wallpaper10.mp4"
//       title={"구글 에서 제공하는 wasm 파일 사용"}
//     >
//       <Style>
//         <IframeWrapper>
//           <iframe
//             src="/new"
//             title="외부 웹사이트"
//             width="700"
//             height="700"
//             style={{
//               objectFit: "cover",
//               border: "none",
//               overflow: "hidden",
//               display: "block",
//               position: "absolute",
//               left: 0,
//               top: 0,
//               zIndex: 1,
//               pointerEvents: "auto",
//             }}
//             scrolling="no"
//           ></iframe>
//           {canvasVisible && (
//             <DrawingCanvas
//               ref={canvasRef}
//               width={700}
//               height={700}
//               style={{
//                 pointerEvents: canDraw ? "auto" : "none",
//               }}
//             />
//           )}
//         </IframeWrapper>
//       </Style>
//     </Section>
//   );
// };
// export default Section10;
import React, { useRef, useEffect, useState } from "react";
import Section from "../utils/section";
import styled from "styled-components";

const Style = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 700px;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
`;

const DrawingCanvas = styled.canvas`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
`;

const IframeWrapper = styled.div`
  position: relative;
  width: 700px;
  height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Section10 = () => {
  const canvasRef = useRef(null);
  const [canDraw, setCanDraw] = useState(false);
  const [canvasVisible, setCanvasVisible] = useState(true);

  useEffect(() => {
    // 메시지 리스너
    const handleMessage = (event) => {
      if (event.data === "enableDrawing") {
        setCanDraw(true);
      }
    };
    window.addEventListener("message", handleMessage);

    // Q 키로 캔버스 show/hide 토글
    const handleKeyDown = (e) => {
      if (e.key === "q" || e.key === "Q") {
        setCanvasVisible((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!canDraw || !canvasVisible) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let drawing = false;
    let lastX = 0;
    let lastY = 0;

    const handleMouseDown = (e) => {
      drawing = true;
      const rect = canvas.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
    };

    const handleMouseMove = (e) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastX = x;
      lastY = y;
    };

    const handleMouseUp = () => {
      drawing = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [canDraw, canvasVisible]);

  return (
    <Section
      src="https://cdn-sv.p-e.kr/assets/wallpaper10.mp4"
      title={"wasm 최적화"}
    >
      <Style>
        <IframeWrapper>
          <iframe
            src="/new"
            title="외부 웹사이트"
            width="700"
            height="700"
            style={{
              objectFit: "cover",
              border: "none",
              overflow: "hidden",
              display: "block",
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: 1,
              pointerEvents: "auto",
            }}
            scrolling="no"
          ></iframe>
          {canvasVisible && (
            <DrawingCanvas
              ref={canvasRef}
              width={700}
              height={700}
              style={{
                pointerEvents: canDraw ? "auto" : "none",
              }}
            />
          )}
        </IframeWrapper>
      </Style>
    </Section>
  );
};
export default Section10;
