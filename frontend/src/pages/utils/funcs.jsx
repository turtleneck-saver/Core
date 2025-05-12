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

///////////////////////////////////////////////////////////////////////

const preprocessWithWasm = ({ imageData, wasmFunc, radius, amount }) => {
  if (!wasmFunc || !wasmFunc.current || !wasmFunc.current._processImage) {
    console.warn(
      "WASM 모듈이 아직 로드되지 않았거나 필요한 함수가 준비되지 않았습니다."
    );
    return null;
  }

  const { _malloc, _free, _processImage } = wasmFunc.current;

  let HEAPU8 = wasmFunc.current.HEAPU8;

  const inputData = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const numBytes = inputData.length;

  let inputPtr = 0;
  let outputPtr = 0;

  try {
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

      if (inputPtr !== 0) _free(inputPtr);
      if (outputPtr !== 0) _free(outputPtr);
      return null;
    }

    HEAPU8.set(inputData, inputPtr);

    _processImage(inputPtr, outputPtr, width, height, radius, amount);

    HEAPU8 = wasmFunc.current.HEAPU8;

    const outputDataWasmRaw = HEAPU8.slice(outputPtr, outputPtr + numBytes);

    const outputDataWasm = new Uint8ClampedArray(outputDataWasmRaw);

    _free(inputPtr);
    _free(outputPtr);
    return new ImageData(outputDataWasm, width, height);
  } catch (error) {
    console.error("WASM 함수 실행 중 오류 발생:", error);
    if (inputPtr !== 0) _free(inputPtr);
    if (outputPtr !== 0) _free(outputPtr);
    return null;
  }
};

export { preprocessWithJs, preprocessWithWasm };
