import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import Webcam from "react-webcam"; // react-webcam 임포트

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
  const webcamRef = useRef(null); // Webcam 컴포넌트의 ref
  const time = useRef(new Date());
  const [frame, setFrame] = useState(null);

  const WIDTH = 720;
  const HEIGHT = 360;
  const FPS = 1;
  const TIMER = 1000 / FPS;

  useEffect(() => {
    startWebSocket();
    const intervalId = setInterval(() => {
      captureFrame(); // 주기적으로 프레임 캡처
    }, TIMER);

    return () => {
      if (socket.current) socket.current.close();
      clearInterval(intervalId);
    };
  }, []); // 빈 배열은 컴포넌트 마운트 시 한 번만 실행

  const startWebSocket = () => {
    socket.current = new WebSocket("wss://ai-app.p-e.kr/streaming/video");

    socket.current.onopen = () => {
      console.log("WebSocket opened");
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
  };

  // react-webcam의 getScreenshot 함수를 이용하여 이미지 캡처
  const captureFrame = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot({
        width: WIDTH,
        height: HEIGHT,
      });

      if (imageSrc) {
        // getScreenshot은 base64 데이터 URL을 반환
        const base64Image = imageSrc; // 'data:image/webp;base64,' 접두사 제거

        const currentTime = new Date().toISOString();
        const jsonData = {
          image: base64Image,
          time: currentTime,
        };
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
          socket.current.send(JSON.stringify(jsonData));
        }
        console.log("프레임 캡처됨!");
      }
    }
  }, [webcamRef, WIDTH, HEIGHT, socket]); // 종속성 배열에 webcamRef, WIDTH, HEIGHT, socket 추가

  return (
    <Style width={WIDTH} height={HEIGHT}>
      <h1>Webcam Stream</h1>
      {/* Webcam 컴포넌트 사용 */}
      <Webcam
        audio={false} // 오디오 사용 여부
        ref={webcamRef}
        screenshotFormat="image/webp" // 캡처 이미지 포맷
        width={WIDTH}
        height={HEIGHT}
        videoConstraints={{
          // 비디오 제약 조건 설정
          width: WIDTH,
          height: HEIGHT,
          frameRate: FPS,
        }}
        className="frame visible" // 스타일 유지를 위해 클래스 적용
      />

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
