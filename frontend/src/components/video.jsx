import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import Webcam from "react-webcam"; // react-webcam 임포트

// Emscripten이 생성한 process_image.js 파일이 HTML <head> 태그 등에
// <script src="process_image.js"></script> 형태로 이미 로드되어 있고,
// 전역 'Module' 객체를 노출한다고 가정합니다.
// 이 스크립트는 process_image.wasm 파일도 로드합니다.

const Style = styled.div`
  /* .frame 스타일 수정 - display: none; 제거 */
  .frame {
    /* display: none;  // 이 줄을 제거하여 기본적으로 보이도록 함 */
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
  }
  /* .visible 스타일은 그대로 유지하여 display: block을 강제 적용 */
  .visible {
    display: block !important;
  }

  /* Input 필드 스타일 (이전과 동일) */
  div {
    margin-bottom: 10px;
  }
  label {
    margin-right: 5px;
  }

  /* 캔버스들을 가로로 나란히 표시하기 위한 스타일 */
  .video-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px; /* 요소들 사이에 간격 추가 */
    justify-content: center; /* 컨테이너 중앙 정렬 (선택 사항) */
  }

  .video-item {
    text-align: center;
    border: 1px solid #ccc; /* 시각적 구분을 위한 테두리 */
  }
`;

const Video = () => {
  const socket = useRef(null);
  const webcamRef = useRef(null); // Webcam 컴포넌트의 ref
  const time = useRef(new Date());
  const [frame, setFrame] = useState(null); // 서버에서 받은 처리된 프레임을 표시하기 위한 state

  const WIDTH = 720;
  const HEIGHT = 360;
  const FPS = 1; // 프레임 전송 속도
  const TIMER = 1000 / FPS; // setInterval 간격 (ms)

  // WASM 관련 Ref
  const wasmReadyRef = useRef(false); // WASM 모듈 초기화 완료 여부
  const wasmFunctionsRef = useRef(null); // WASM 함수 및 HEAPU8 참조 저장

  // 이미지 처리를 위한 Hidden Canvas Ref
  const canvasRef = useRef(null); // 이미지를 픽셀 데이터로 변환하거나, 픽셀 데이터를 다시 이미지로 변환할 때 사용

  // 블러 반경 및 선명화 강도 입력 필드 Ref
  const blurRadiusRef = useRef(null);
  const sharpenAmountRef = useRef(null);

  useEffect(() => {
    let intervalId = null; // setInterval ID를 관리하기 위한 변수

    // --- WASM Module Initialization ---
    if (typeof Module !== "undefined") {
      console.log("Emscripten Module object found.");

      // WASM 런타임 초기화 완료 콜백 설정
      Module.onRuntimeInitialized = function () {
        console.log("WASM Runtime Initialized.");
        wasmReadyRef.current = true; // WASM 준비 완료 상태 업데이트

        // WASM 모듈의 필요한 함수 및 메모리 뷰를 Ref에 저장
        wasmFunctionsRef.current = {
          _malloc: Module._malloc,
          _free: Module._free,
          HEAPU8: Module.HEAPU8, // WASM 메모리의 Uint8Array 뷰
          _processImage: Module._processImage, // 우리가 C에서 내보낸 함수
        };

        // 이미지 처리를 위해 사용할 Hidden Canvas 생성 및 Ref에 저장
        canvasRef.current = document.createElement("canvas");
        canvasRef.current.width = WIDTH;
        canvasRef.current.height = HEIGHT;
        console.log("Hidden canvas created for image processing.");

        // WASM 초기화 완료 후 WebSocket 연결 및 프레임 캡처 시작
        startWebSocket();
        // setInterval ID를 변수에 저장하여 cleanup에서 사용
        intervalId = setInterval(captureFrame, TIMER); // 주기적으로 프레임 캡처 시작
      };

      // 만약 useEffect가 실행될 때 이미 WASM 런타임이 초기화되어 있다면
      if (Module.calledRun) {
        console.log("WASM Runtime already initialized.");
        wasmReadyRef.current = true;
        wasmFunctionsRef.current = {
          _malloc: Module._malloc,
          _free: Module._free,
          HEAPU8: Module.HEAPU8,
          _processImage: Module._processImage,
        };
        canvasRef.current = document.createElement("canvas");
        canvasRef.current.width = WIDTH;
        canvasRef.current.height = HEIGHT;
        console.log(
          "Hidden canvas created for image processing (runtime already initialized)."
        );

        // WASM 초기화 완료 후 WebSocket 연결 및 프레임 캡처 시작
        startWebSocket();
        // setInterval ID를 변수에 저장하여 cleanup에서 사용
        intervalId = setInterval(captureFrame, TIMER); // 주기적으로 프레임 캡처 시작
      }
    } else {
      console.error(
        "Emscripten Module object not found. Make sure process_image.js is loaded via a script tag."
      );
      // WASM 없이는 동작하지 않으므로 에러만 로깅하고 종료
    }

    // Cleanup 함수: 컴포넌트 언마운트 시 소켓 및 인터벌 정리
    return () => {
      if (socket.current) socket.current.close();
      if (intervalId !== null) clearInterval(intervalId); // intervalId가 설정된 경우에만 정리
    };
  }, [TIMER]); // TIMER 값이 변경될 때만 useEffect 다시 실행 (상수이므로 사실상 마운트 시 1회)

  const startWebSocket = () => {
    // WebSocket 연결 로직 (이전과 동일)
    if (!socket.current || socket.current.readyState === WebSocket.CLOSED) {
      // 연결이 없거나 끊겼을 때만 새로 연결
      socket.current = new WebSocket("wss://ai-app.p-e.kr/streaming/video");

      socket.current.onopen = () => {
        console.log("WebSocket opened");
      };

      socket.current.onmessage = (event) => {
        let data = JSON.parse(event.data);
        // 서버에서 받은 프레임 처리 (이 예제에서는 state 업데이트하여 화면에 표시)
        if (data.image) {
          // 타임스탬프 비교 로직은 필요에 따라 유지하거나 제거
          let cur_time = new Date();
          console.log(`Received frame with time: ${cur_time.toISOString()}`);
          console.log(`Current component time: ${time.current.toISOString()}`);

          // if (time.current.getTime() <= cur_time.getTime()) { // 서버 시간 비교 로직
          setFrame("data:image/webp;base64," + data.image);
          //   time.current = cur_time;
          // } else {
          //    console.log("Received older frame, discarding.");
          // }
        }
      };

      socket.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.current.onclose = (event) => {
        console.log("WebSocket closed", event);
        // 연결이 끊겼을 때 재접속 로직 추가 가능 (예: setTimeout을 사용하여 일정 시간 후 재시도)
      };
    }
  };

  // react-webcam의 getScreenshot 함수를 이용하여 이미지 캡처, WASM 처리 후 WebSocket 전송
  const captureFrame = useCallback(() => {
    // WASM, Webcam, Canvas, Input Refs가 모두 준비되었는지 확인
    // WebSocket 연결도 열려 있는지 확인하여 불필요한 처리를 막습니다.
    if (
      !wasmReadyRef.current ||
      !webcamRef.current ||
      !canvasRef.current ||
      !blurRadiusRef.current ||
      !sharpenAmountRef.current ||
      !socket.current ||
      socket.current.readyState !== WebSocket.OPEN
    ) {
      // console.warn("Prerequisites not ready for frame capture/processing."); // 너무 자주 출력될 수 있으므로 주석 처리
      return;
    }

    // 1. 웹캠에서 현재 프레임 캡처 (Base64 Data URL 형식)
    const imageSrc = webcamRef.current.getScreenshot({
      width: WIDTH,
      height: HEIGHT,
    });

    if (!imageSrc) {
      console.warn("Failed to capture frame from webcam.");
      return;
    }

    // --- 2. Base64 Data URL을 Raw 픽셀 데이터로 변환 (Image -> Canvas -> ImageData) ---
    const img = new Image(); // 임시 Image 객체 생성

    img.onload = () => {
      const ctx = canvasRef.current.getContext("2d");
      // 원본 이미지를 Hidden Canvas에 그립니다.
      ctx.clearRect(0, 0, WIDTH, HEIGHT); // 캔버스 초기화
      ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);

      // Canvas에서 픽셀 데이터(RGBA)를 가져옵니다.
      const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
      const pixelData = imageData.data; // Uint8ClampedArray (WASM HEAPU8과 호환)

      // --- 3. WASM 메모리에 데이터 복사 및 처리 ---
      const numBytes = WIDTH * HEIGHT * 4; // RGBA 4채널

      // WASM 메모리에 입력 및 출력 버퍼를 위한 공간 할당
      const inputPtr = wasmFunctionsRef.current._malloc(numBytes);
      const outputPtr = wasmFunctionsRef.current._malloc(numBytes);

      if (inputPtr === 0 || outputPtr === 0) {
        console.error("Failed to allocate memory in WASM.");
        // 메모리 할당 실패 시, 혹시 하나라도 할당되었으면 해제
        if (inputPtr !== 0) wasmFunctionsRef.current._free(inputPtr);
        if (outputPtr !== 0) wasmFunctionsRef.current._free(outputPtr);
        return; // 처리 중단
      }

      // JavaScript의 픽셀 데이터를 WASM 메모리의 입력 버퍼로 복사
      wasmFunctionsRef.current.HEAPU8.set(pixelData, inputPtr);

      // Input 필드에서 블러 반경과 선명화 강도 값을 읽어옵니다.
      const radius = parseInt(blurRadiusRef.current.value, 10);
      const amount = parseFloat(sharpenAmountRef.current.value);

      // 입력 값 유효성 검사 (간단)
      if (isNaN(radius) || radius < 1 || isNaN(amount)) {
        console.error("Invalid blur radius or sharpen amount value.");
        // WASM 메모리 해제
        wasmFunctionsRef.current._free(inputPtr);
        wasmFunctionsRef.current._free(outputPtr);
        return; // 처리 중단
      }
      // console.log(`Applying Unsharp Mask: Radius=${radius}, Amount=${amount}`);

      // WASM 이미지 처리 함수 호출 (C에서 내보낸 _processImage 함수)
      // 인자 순서: inputDataPtr, outputDataPtr, width, height, blurRadius, amount (총 6개)
      wasmFunctionsRef.current._processImage(
        inputPtr,
        outputPtr,
        WIDTH,
        HEIGHT,
        radius,
        amount
      );
      // console.log("WASM processImage function executed.");

      // 처리된 결과를 WASM 메모리의 출력 버퍼에서 읽어옵니다.
      const processedPixelData = wasmFunctionsRef.current.HEAPU8.subarray(
        outputPtr,
        outputPtr + numBytes
      );

      // --- 4. 처리된 Raw 픽셀 데이터를 다시 Base64 Data URL로 변환 (ImageData -> Canvas -> Data URL) ---
      // ImageData 객체 생성 (subarray는 뷰이므로 복사본을 만드는 것이 안전)
      const processedImageData = new ImageData(
        new Uint8ClampedArray(processedPixelData),
        WIDTH,
        HEIGHT
      );

      // 처리된 픽셀 데이터를 Hidden Canvas에 그립니다.
      ctx.clearRect(0, 0, WIDTH, HEIGHT); // 캔버스 초기화
      ctx.putImageData(processedImageData, 0, 0);

      // Canvas의 이미지를 Base64 Data URL 형식으로 가져옵니다.
      const processedImageSrc = canvasRef.current.toDataURL("image/webp"); // 웹 서버에서 webp를 지원한다고 가정

      // --- 5. WASM 메모리 해제 ---
      wasmFunctionsRef.current._free(inputPtr);
      wasmFunctionsRef.current._free(outputPtr);
      // console.log("WASM memory freed.");

      // --- 6. 처리된 데이터 WebSocket으로 전송 ---
      // WebSocket 연결이 열려 있는지 다시 확인
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        const base64Image = processedImageSrc; // 'data:image/webp;base64,' 접두사 제거

        const currentTime = new Date().toISOString();
        const jsonData = {
          image: base64Image, // 처리된 Base64 이미지 데이터
          time: currentTime,
        };

        socket.current.send(JSON.stringify(jsonData));
        // console.log("Processed frame sent!");
      } else {
        // console.warn("WebSocket not open. Could not send processed frame."); // 자주 출력될 수 있으므로 주석 처리
      }
    }; // --- End img.onload ---

    // 이미지 로드 실패 시 에러 처리
    img.onerror = (e) => {
      console.error("Error loading image for processing:", e);
    };

    // Image 객체의 src를 설정하여 로드를 시작 -> onload 이벤트 발생
    img.src = imageSrc;
  }, [
    webcamRef,
    wasmReadyRef,
    canvasRef,
    blurRadiusRef,
    sharpenAmountRef,
    WIDTH,
    HEIGHT,
    socket,
    TIMER,
  ]);
  // useCallback 종속성 배열에 필요한 Ref와 상수들 포함. TIMER 추가.

  // Webcam 스트림 준비가 완료되었을 때 호출될 콜백 (선택 사항)
  // const handleUserMedia = (stream) => {
  //     console.log("Webcam stream ready:", stream);
  //     // 스트림이 준비된 후에 프레임 캡처 인터벌을 시작할 수 있음 (현재는 WASM 초기화 완료 시 시작)
  // };

  return (
    <Style width={WIDTH} height={HEIGHT}>
      <h1>Webcam Stream with WASM Processing</h1>

      {/* WASM 필터 파라미터 입력 필드 */}
      <div>
        <label htmlFor="blurRadius">Blur Radius:</label>
        {/* Ref를 사용하여 DOM 요소에 접근 */}
        <input
          type="number"
          id="blurRadius"
          defaultValue="2"
          min="1"
          max="20"
          step="1"
          ref={blurRadiusRef}
        />
      </div>
      <div>
        <label htmlFor="sharpenAmount">Sharpen Amount:</label>
        {/* Ref를 사용하여 DOM 요소에 접근 */}
        <input
          type="number"
          id="sharpenAmount"
          defaultValue="2.0"
          min="0"
          max="10"
          step="0.1"
          ref={sharpenAmountRef}
        />
      </div>

      {/* 원본 웹캠 화면 및 처리된 결과를 나란히 표시할 컨테이너 */}
      <div className="video-container">
        <div className="video-item">
          <h2>원본 웹캠 스트림</h2>
          {/* Webcam 컴포넌트 - 이제 화면에 표시됩니다 */}
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/webp"
            width={WIDTH}
            height={HEIGHT}
            videoConstraints={{
              width: WIDTH,
              height: HEIGHT,
              frameRate: FPS,
            }}
            className="frame visible" // 이제 보이도록 visible 클래스 유지
            // style={{ position: 'absolute', left: '-9999px' }} // 이 스타일을 제거합니다.
            // onUserMedia={handleUserMedia} // 스트림 준비 콜백 (선택 사항)
          />
        </div>

        <div className="video-item">
          <h2>서버에서 받은 처리 결과</h2>
          {/* 서버에서 받은 프레임을 표시 */}
          {frame && (
            <img
              src={frame}
              className={`frame visible`} // 보이도록 visible 클래스 적용
              id="result"
              alt="Processed Frame Received"
            />
          )}
        </div>
      </div>

      {/* Hidden Canvas는 useEffect에서 동적으로 생성하여 Ref에 저장됩니다. */}
      {/* JSX에 직접 추가해도 되지만, 여기서는 동적 생성을 선택했습니다. */}
    </Style>
  );
};

export default Video;
