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

const Video = () => {
  const socket = useRef(null);
  const camera = useRef(null);
  const canvas = useRef(null);
  const time = useRef(new Date());
  const [frame, setFrame] = useState(null);

  const WIDTH = 720;
  const HEIGHT = 360;
  const FPS = 1;
  const TIMER = 1000 / FPS;

  useEffect(() => {
    startWebSocket();
  }, []);

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
      if (data.image && time.current <= cur_time) {
        time.current = cur_time;
        setFrame("data:image/webp;base64," + data.image);
      }
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
    </Style>
  );
};

export default Video;
