const preprocessWithJs = ({ imageData, radius, amount }) => {
  const inputData = imageData.data; //
  const width = imageData.width;
  const height = imageData.height;
  const channels = 4;
  const numPixels = width * height;
  const numBytes = numPixels * channels;
  const blurredData = new Uint8ClampedArray(numBytes);
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      let pixelCount = 0;

      for (let ky = -radius; ky <= radius; ++ky) {
        for (let kx = -radius; kx <= radius; ++kx) {
          const sx = x + kx;
          const sy = y + ky;

          if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
            const inputIndex = (sy * width + sx) * channels;
            sumR += inputData[inputIndex];
            sumG += inputData[inputIndex + 1];
            sumB += inputData[inputIndex + 2];
            pixelCount++;
          }
        }
      }

      const blurredIndex = (y * width + x) * channels;
      if (pixelCount > 0) {
        blurredData[blurredIndex] = sumR / pixelCount;
        blurredData[blurredIndex + 1] = sumG / pixelCount;
        blurredData[blurredIndex + 2] = sumB / pixelCount;
        blurredData[blurredIndex + 3] = inputData[blurredIndex + 3];
      } else {
        blurredData[blurredIndex] = 0;
        blurredData[blurredIndex + 1] = 0;
        blurredData[blurredIndex + 2] = 0;
        blurredData[blurredIndex + 3] = inputData[blurredIndex + 3];
      }
    }
  }

  const outputData = new Uint8ClampedArray(numBytes);

  for (let i = 0; i < numPixels; ++i) {
    const index = i * channels;

    const originalR = inputData[index];
    const originalG = inputData[index + 1];
    const originalB = inputData[index + 2];

    const blurredR = blurredData[index];
    const blurredG = blurredData[index + 1];
    const blurredB = blurredData[index + 2];

    const sharpenedR = originalR + (originalR - blurredR) * amount;
    const sharpenedG = originalG + (originalG - blurredG) * amount;
    const sharpenedB = originalB + (originalB - blurredB) * amount;

    outputData[index] = sharpenedR;
    outputData[index + 1] = sharpenedG;
    outputData[index + 2] = sharpenedB;
    outputData[index + 3] = inputData[index + 3];
  }

  return new ImageData(outputData, width, height);
};

const preprocessWithWasm = ({ imageData, wasmFunc, radius, amount }) => {
  if (!wasmFunc || !wasmFunc.current || !wasmFunc.current._processImage) {
    console.warn(
      "WASM 모듈이 아직 로드되지 않았거나 필요한 함수가 준비되지 않았습니다."
    );
    return null;
  }

  // wasmFunc.current에서 필요한 함수와 초기 HEAPU8 뷰를 가져옵니다.
  const { _malloc, _free, _processImage } = wasmFunc.current;
  // HEAPU8은 WASM 메모리 뷰이며, WASM 메모리 성장 시 Emscripten에 의해 갱신될 수 있습니다.
  // 따라서 매 실행마다 최신 뷰를 가져오는 것이 안전할 수 있습니다.
  let HEAPU8 = wasmFunc.current.HEAPU8; // 초기 HEAPU8 뷰

  const inputData = imageData.data; // Uint8ClampedArray
  const width = imageData.width;
  const height = imageData.height;
  const numBytes = inputData.length;

  let inputPtr = 0;
  let outputPtr = 0;

  try {
    // WASM 힙에 입력 및 출력 버퍼 할당
    // WASM 메모리가 성장하면 _malloc은 새로운 메모리 공간에 할당할 수 있습니다.
    inputPtr = _malloc(numBytes);
    outputPtr = _malloc(numBytes);

    if (inputPtr === 0 || outputPtr === 0) {
      console.error(
        "WASM 메모리 할당에 실패했습니다. (inputPtr:",
        inputPtr,
        ", outputPtr:",
        outputPtr,
        ")"
      );
      // 할당 실패 시 이미 할당된 메모리가 있다면 해제
      if (inputPtr !== 0) _free(inputPtr);
      if (outputPtr !== 0) _free(outputPtr);
      return null;
    }

    // 자바스크립트 데이터를 WASM 힙으로 복사
    // 이 시점의 HEAPU8 뷰를 사용합니다.
    HEAPU8.set(inputData, inputPtr);

    // WASM 함수 실행
    // _processImage 함수 내부에서 WASM 메모리가 성장할 가능성이 있습니다.
    // 메모리가 성장하면 Emscripten은 wasmFunc.current.HEAPU8를 새로운 뷰로 갱신할 수 있습니다.
    _processImage(inputPtr, outputPtr, width, height, radius, amount);

    // WASM 힙에서 결과 데이터 읽기
    // *** 오류가 발생하는 지점 바로 전에 최신 HEAPU8 뷰를 다시 가져옵니다. ***
    // 이렇게 함으로써 _processImage 실행 후 WASM 메모리가 성장하여 HEAPU8 뷰가 갱신되었더라도,
    // slice는 항상 최신 메모리 뷰를 사용하게 됩니다.
    HEAPU8 = wasmFunc.current.HEAPU8; // <<< 핵심 수정: 최신 HEAPU8 뷰 다시 가져오기

    // 이제 최신 HEAPU8 뷰에 대해 slice를 호출합니다.
    // HEAPU8.slice()는 WASM 메모리의 특정 범위에 해당하는 데이터를
    // 새로운 ArrayBuffer에 복사하여 새로운 TypedArray를 반환합니다.
    const outputDataWasmRaw = HEAPU8.slice(outputPtr, outputPtr + numBytes);

    // WASM 힙에서 읽어온 데이터를 기반으로 새로운 Uint8ClampedArray 생성
    // outputDataWasmRaw는 이미 새로운 ArrayBuffer 기반이므로 안전합니다.
    const outputDataWasm = new Uint8ClampedArray(outputDataWasmRaw);

    // 메모리 해제
    _free(inputPtr);
    _free(outputPtr);

    // 새로운 ImageData 객체 생성 및 반환
    return new ImageData(outputDataWasm, width, height);
  } catch (error) {
    console.error("WASM 함수 실행 중 오류 발생:", error);
    // 오류 발생 시에도 할당된 메모리가 있다면 해제
    // wasmFunc.current._free는 WASM 메모리에 대한 해제이므로,
    // HEAPU8이 분리되었더라도 free 자체는 문제없이 동작할 수 있습니다.
    if (inputPtr !== 0) _free(inputPtr);
    if (outputPtr !== 0) _free(outputPtr);
    return null;
  }
};

// compare 함수는 이전과 동일하게 사용하시면 됩니다.
const compare = (imageData, wasmFunc, radius, amount) => {
  const jsStart = performance.now();
  const jsResult = preprocessWithJs({ imageData, radius, amount });
  const jsEnd = performance.now();

  const wasmStart = performance.now();
  const wasmResult = preprocessWithWasm({
    imageData,
    wasmFunc,
    radius,
    amount,
  });
  const wasmEnd = performance.now();

  return {
    jsTime: jsEnd - jsStart,
    wasmTime: wasmEnd - wasmStart,
    jsResult,
    wasmResult,
  };
};

// export는 동일합니다.
export { preprocessWithJs, preprocessWithWasm, compare };
