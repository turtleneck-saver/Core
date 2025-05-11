import React, { useRef, useState, useEffect } from "react"; // useEffect, useState, useRef 임포트
import Section from "../utils/section";
import styled from "styled-components";
import { preprocessWithJs, preprocessWithWasm, compare } from "../utils/funcs";

const Style = styled.div`
  /* Section7 컴포넌트 내부 요소들을 위한 컨테이너 스타일 */
  display: flex; /* 자식 요소들을 Flexbox로 배치 */
  flex-direction: column; /* 요소들을 세로 방향으로 정렬 */
  align-items: center; /* 가로축 중앙 정렬 */
  gap: 20px; /* 자식 요소들 사이에 간격 추가 */
  padding: 20px; /* 내부 여백 추가 */
  color: #fff; /* 텍스트 색상 흰색 (배경 영상 위에 잘 보이도록) */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5); /* 텍스트 그림자 추가 */
  z-index: 1; /* 배경 영상 위에 오도록 z-index 설정 */
  position: relative; /* 자식 요소의 absolute/relative 기준 설정 */

  h3 {
    /* 준비중 메시지 스타일 */
    color: #fff;
  }

  div {
    /* WASM 로드 완료 후 표시되는 컨트롤 컨테이너 스타일 */
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px; /* 내부 요소 간격 */
  }

  p {
    /* WASM 로드 상태 메시지 스타일 */
    margin: 0; /* 기본 마진 제거 */
  }

  /* 파일 선택 UI (label과 input) 스타일 */
  label {
    display: inline-block; /* inline-block으로 margin 등 적용 용이하게 */
    cursor: pointer; /* 마우스 오버 시 포인터 변경 */
    background-color: #f0f0f0; /* 배경색 */
    color: #333; /* 텍스트 색상 */
    padding: 8px 15px; /* 패딩 */
    border-radius: 5px; /* 모서리 둥글게 */
    transition: background-color 0.3s ease; /* 호버 시 부드러운 전환 효과 */

    &:hover {
      background-color: #e0e0e0; /* 호버 시 배경색 변경 */
    }
  }

  label input[type="file"] {
    display: none; /* 실제 파일 input 숨기기 */
  }

  /* 블러 반경 및 선명화 강도 입력 필드 컨테이너 스타일 */
  div > div {
    /* 컨트롤 컨테이너 안의 div */
    display: flex;
    flex-direction: row; /* 입력 필드는 가로로 배치 */
    align-items: center;
    gap: 15px; /* 입력 필드 그룹 간 간격 */
    flex-wrap: wrap; /* 작은 화면에서 줄바꿈 */
  }

  /* 입력 필드와 레이블 스타일 */
  label[htmlFor="blurRadius"],
  label[htmlFor="sharpenAmount"] {
    background: none; /* 배경색 제거 */
    color: #fff; /* 텍스트 색상 흰색 */
    padding: 0; /* 패딩 제거 */
    cursor: default; /* 커서 변경 안 함 */
    margin-right: 5px; /* 입력 필드와의 간격 */

    &:hover {
      background: none; /* 호버 효과 제거 */
    }
  }

  input[type="number"] {
    padding: 5px;
    border-radius: 3px;
    border: 1px solid #ccc;
    width: 60px; /* 너비 조정 */
  }

  /* 버튼 스타일 */
  button {
    padding: 8px 15px;
    border-radius: 5px;
    border: none;
    background-color: #007bff; /* 기본 버튼 색상 */
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3; /* 호버 시 색상 변경 */
    }

    &:disabled {
      background-color: #cccccc; /* 비활성화 시 색상 */
      cursor: not-allowed; /* 비활성화 시 커서 */
    }
  }

  /* 파일 선택 label 안의 button 스타일 (label 스타일을 따르도록) */
  label button {
    background: none; /* label의 배경색 제거 */
    color: inherit; /* label의 텍스트 색상 상속 */
    padding: 0; /* label의 패딩 제거 */
    border: none; /* 테두리 제거 */
    cursor: inherit; /* label의 커서 상속 */
    margin: 0; /* 마진 제거 */
    font-size: inherit; /* 폰트 크기 상속 */
  }

  /* 캔버스 컨테이너 스타일 */
  .canvas-container {
    display: flex;
    justify-content: center; /* 캔버스들을 중앙에 배치 */
    gap: 20px; /* 캔버스 간 간격 */
    flex-wrap: wrap; /* 화면이 작아지면 캔버스가 아래로 떨어지도록 */
    width: 100%; /* 부모 너비에 맞춤 */
    margin-top: 20px; /* 위쪽 여백 */
  }

  /* 개별 캔버스 아이템 (h2와 canvas) 스타일 */
  .canvas-item {
    width: 30%; /* 캔버스 너비 */
    height: auto; /* 높이 자동 조정 */
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .canvas-item h2 {
    font-size: 1.2em;
    margin-bottom: 10px;
    color: #fff;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }

  canvas {
    border: 1px solid #ccc;
    background-color: #333; /* 배경이 투명할 경우 대비 */
    max-width: 100%; /* 캔버스가 컨테이너 너비를 넘지 않도록 조정 */
    height: auto; /* 비율 유지 */
    display: block; /* inline 요소의 하단 공백 제거 */
  }

  #timeResults {
    margin-top: 20px;
    font-size: 1.1em;
    color: #fff;
  }
`;

// Module 객체는 process_image.js 파일이 HTML에서 로드될 때 전역으로 생성됩니다.
// 이 파일에서는 별도로 선언할 필요 없습니다.

const Section7 = () => {
  const wasmFunc = useRef(null);
  // isWasmReady 상태와 상태 업데이트 함수 선언
  const [isWasmReady, setIsWasmReady] = useState(false);
  const [loadedImageData, setLoadedImageData] = useState(null); // 이미지 데이터 상태
  const [blurRadius, setBlurRadius] = useState(5); // 블러 반경 상태
  const [sharpenAmount, setSharpenAmount] = useState(1.5); // 선명화 강도 상태

  // 캔버스 Ref들
  const originalCanvasRef = useRef(null);
  const processedJsCanvasRef = useRef(null);
  const processedWasmCanvasRef = useRef(null);

  // WASM 런타임 초기화 Side Effect 관리
  // 컴포넌트 마운트 시 (dependencies: []) 한 번만 실행
  useEffect(() => {
    console.log("useEffect: WASM 초기화 로직 실행");
    // Module 객체가 존재하는지 확인
    if (typeof Module !== "undefined") {
      // WASM 런타임이 이미 초기화되었는지 확인
      if (Module.calledRun) {
        console.log("WASM 런타임 이미 초기화됨.");
        // WASM 함수 및 메모리 뷰를 useRef에 저장
        wasmFunc.current = {
          _malloc: Module._malloc,
          _free: Module._free,
          HEAPU8: Module.HEAPU8,
          _processImage: Module._processImage,
        };
        // 상태 업데이트: WASM 준비 완료
        setIsWasmReady(true);
      } else {
        // 런타임 초기화 콜백 설정
        Module.onRuntimeInitialized = () => {
          console.log("WASM 런타임 초기화 완료!");
          // WASM 함수 및 메모리 뷰를 useRef에 저장
          wasmFunc.current = {
            _malloc: Module._malloc,
            _free: Module._free,
            HEAPU8: Module.HEAPU8,
            _processImage: Module._processImage,
          };
          // 상태 업데이트: WASM 준비 완료
          setIsWasmReady(true);
        };
      }
    } else {
      console.error(
        "Emscripten Module 객체를 찾을 수 없습니다. public/index.html에 process_image.js 스크립트 태그가 있는지 확인하세요."
      );
      // WASM 로딩 실패 상태 처리 로직 추가 가능
    }

    // 클린업 함수 (필요시)
    return () => {
      console.log("useEffect cleanup 실행");
      // WASM 관련 정리 작업 (필요하다면)
    };
  }, []); // 빈 의존성 배열: 컴포넌트 마운트 및 언마운트 시에만 실행

  // 이미지 파일 선택 핸들러 (이전 답변 코드 참조)
  const handleImageChange = (event) => {
    // ... 파일 읽고 ImageData 얻어서 setLoadedImageData 업데이트, 원본 캔버스에 그리는 로직 ...
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          setLoadedImageData(imageData);

          const originalCanvas = originalCanvasRef.current;
          if (originalCanvas) {
            originalCanvas.width = img.width;
            originalCanvas.height = img.height;
            const originalCtx = originalCanvas.getContext("2d");
            originalCtx.drawImage(img, 0, 0);
          }

          const processedJsCanvas = processedJsCanvasRef.current;
          if (processedJsCanvas) {
            processedJsCanvas.width = img.width;
            processedJsCanvas.height = img.height;
            const ctx = processedJsCanvas.getContext("2d");
            ctx.clearRect(0, 0, img.width, img.height);
          }
          const processedWasmCanvas = processedWasmCanvasRef.current;
          if (processedWasmCanvas) {
            processedWasmCanvas.width = img.width;
            processedWasmCanvas.height = img.height;
            const ctx = processedWasmCanvas.getContext("2d");
            ctx.clearRect(0, 0, img.width, img.height);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessClick = () => {
    if (!isWasmReady || !loadedImageData) {
      console.warn(
        "WASM 모듈이 준비되지 않았거나 이미지가 로드되지 않았습니다."
      );
      return;
    }

    console.log("속도 비교 시작...");

    const startTimeJs = performance.now();
    const resultJs = preprocessWithJs({
      imageData: loadedImageData,
      radius: blurRadius,
      amount: sharpenAmount,
    });
    const endTimeJs = performance.now();
    const timeJs = endTimeJs - startTimeJs;
    console.log(`JavaScript 처리 시간: ${timeJs} ms`);

    const startTimeWasm = performance.now();
    const resultWasm = preprocessWithWasm({
      imageData: loadedImageData,
      wasmFunc: wasmFunc,
      radius: blurRadius,
      amount: sharpenAmount,
    });
    const endTimeWasm = performance.now();
    const timeWasm = endTimeWasm - startTimeWasm;
    console.log(`WASM 처리 시간: ${timeWasm} ms`);

    const processedJsCanvas = processedJsCanvasRef.current;
    if (processedJsCanvas && resultJs)
      processedJsCanvas.getContext("2d").putImageData(resultJs, 0, 0);
    const processedWasmCanvas = processedWasmCanvasRef.current;
    if (processedWasmCanvas && resultWasm)
      processedWasmCanvas.getContext("2d").putImageData(resultWasm, 0, 0);
  };

  return (
    <Section
      src="https://cdn-sv.p-e.kr/assets/wallpaper6.mp4"
      title={"WASM VS JS"}
    >
      <Style>
        <p>속도 비교</p>

        {!isWasmReady ? (
          <h3>WASM 모듈 준비중...</h3>
        ) : (
          <div>
            <label htmlFor="imageInput">
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              <span>이미지 선택</span>
            </label>

            <div>
              <label htmlFor="blurRadius">블러 반경 (Radius):</label>
              <input
                type="number"
                id="blurRadius"
                value={blurRadius}
                onChange={(e) =>
                  setBlurRadius(parseInt(e.target.value, 10) || 0)
                }
                min="0"
                max="50"
              />
              <label htmlFor="sharpenAmount">선명화 강도 (Amount):</label>
              <input
                type="number"
                id="sharpenAmount"
                value={sharpenAmount}
                onChange={(e) =>
                  setSharpenAmount(parseFloat(e.target.value) || 0)
                }
                step="0.1"
                min="0"
              />
            </div>

            <button
              id="processButton"
              onClick={handleProcessClick}
              disabled={!isWasmReady || !loadedImageData}
            >
              이미지 처리 시작
            </button>

            <div className="canvas-container">
              <div className="canvas-item">
                <h2>원본 이미지</h2>
                <canvas ref={originalCanvasRef}></canvas>
              </div>
              <div className="canvas-item">
                <h2>WASM 처리 결과</h2>
                <canvas ref={processedWasmCanvasRef}></canvas>
              </div>
              <div className="canvas-item">
                <h2>JavaScript 처리 결과</h2>
                <canvas ref={processedJsCanvasRef}></canvas>
              </div>
            </div>
          </div>
        )}
      </Style>
    </Section>
  );
};

export default Section7;
