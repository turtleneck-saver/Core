import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
// import applecat from "../../assets/apple-cat.gif";
// import intro from "../../assets/intro.mp4";

const Style = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;

  .index {
    font-size: 1em;
    font-weight: bold;
    color: #6f42c1;
  }
  .gif {
    position: absolute;
    width: 1.4em;
    height: auto;
    display: none;
    top: -35%;
    left: -20%;
    z-index: 1;
  }
  .index:hover {
    transform: translateY(-5px);
  }
`;

const Section2 = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    video.loop = true; // 무한 반복 설정 (필요한 경우)
    video.muted = true; // 소리 제거 (필요한 경우)
    video.play().catch((error) => {
      // 자동 재생 실패 처리 (브라우저 정책에 따라)
      console.warn("자동 재생 실패:", error);
    });

    return () => {
      // 컴포넌트 언마운트 시 비디오 정지
      video.pause();
    };
  }, []);

  return (
    <section>
      <Style>
        <video className="background" ref={videoRef} autoPlay muted>
          <source
            src="http://210.109.82.36/assets/intro.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <h2 className="title">목차</h2>
        <ol>
          {[
            "서론",
            "문제 정의",
            "프로젝트 개요",
            "설계 및 개발",
            "기존 프로젝트와의 차별점",
          ].map((item, index) => (
            <li
              key={index}
              className="index"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {item}
              {hoveredIndex === index && (
                <img
                  src="http://210.109.82.36/assets/apple-cat.gif"
                  alt="GIF"
                  className="gif"
                  style={{ display: "block" }}
                />
              )}
            </li>
          ))}
        </ol>
      </Style>
    </section>
  );
};

export default Section2;
