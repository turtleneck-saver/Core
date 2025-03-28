import React, { useEffect, useRef, useState } from "react";
import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/white.css";
import styled from "styled-components";
import applecat from "/app/frontend/src/assets/apple-cat.gif";
const Style = styled.div`
  .reveal {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .slides {
    width: 100%;
    height: 100%;
  }

  section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    position: relative;
  }
`;

const Page1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;

  #title {
    font-size: 2em;
    color: white;
    transform: translateY(-20%);
    z-index: 1;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  #sub-title {
    font-size: 1em;
    color: white;
    transform: translateY(-50%);
    z-index: 1;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  video {
    border-radius: 0.8em;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: translate(-50%, -50%);
    z-index: 0;
  }
  .member {
    transform: translateX(150%);
    font-size: 0.8em;
    font-weight: bold;
    color: skyblue;
  }
`;
const Page2 = styled.div`
  cursor: url("/app/frontend/src/assets/apple-cat.gif"), auto; /* GIF를 커서로 설정 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
  z-index: -10;
  video {
    border-radius: 0.8em;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: translate(-50%, -50%);
    z-index: -1;
  }

  #title {
    font-size: 4em;
    font-weight: bold;
  }

  .index {
    font-size: 1.4em;
    font-weight: bold;
    color: #6f42c1;
    transition: transform 0.3s ease; /* 부드러운 전환 효과 */
  }
  .gif {
    position: absolute;
    width: 1.4em; /* GIF의 크기 조정 */
    height: auto;
    display: none; /* 기본적으로 숨김 */
    top: -20%; /* 중앙에 위치하도록 설정 */
    left: -20%; /* 항목 오른쪽에 위치 */
    z-index: 1; /* 텍스트 위에 표시 */
  }
  .index:hover {
    transform: translateY(-5px); /* 마우스 오버 시 위로 이동 */
  }
`;

const About = () => {
  const videoRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  useEffect(() => {
    const deck = new Reveal({
      backgroundTransition: "slide",
      transition: "slide",
      width: "100%",
      height: "100%",
    });

    deck.initialize();

    // 슬라이드 변경 이벤트 리스너 추가
    deck.on("slidechanged", (event) => {
      // const currentSlide = event.currentSlide;
      // const video = videoRef.current;
      // if (currentSlide.querySelector("video")) {
      //   video.play(); // 현재 슬라이드에서 비디오 재생
      // } else {
      //   video.pause(); // 이전 슬라이드에서 비디오 정지
      // }
    });

    return () => {
      deck.destroy(); // 컴포넌트 언마운트 시 정리
    };
  }, []);

  return (
    <Style>
      <div className="reveal">
        <div className="slides">
          {/* <section>
            <Page1>
              <video ref={videoRef} autoPlay loop muted>
                <source
                  src="https://videos.pexels.com/video-files/8343369/8343369-uhd_2560_1440_25fps.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <h2 id="title">인공지능종합설계</h2>
              <p id="sub-title">거북목 방지 프로젝트</p>
              <li className="member">최지웅</li>
              <li className="member">서정빈</li>
              <li className="member">이나연</li>
            </Page1>
          </section> */}

          <section>
            <Page2>
              <video ref={videoRef} autoPlay loop muted>
                <source
                  src="https://videos.pexels.com/video-files/10741100/10741100-hd_2560_1440_30fps.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <h2 id="title">목차</h2>
              <ol>
                {[
                  "서론",
                  "문제 정의",
                  "리서치 및 조사",
                  "프로젝트 개요",
                  "설계 및 개발",
                  "기존 프로젝트와의 차별점",
                  "프로토타입",
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
                        src={applecat} // 여기에 표시할 GIF의 경로를 입력하세요
                        alt="GIF"
                        className="gif"
                        style={{ display: "block" }} // 마우스 오버 시 보이도록 설정
                      />
                    )}
                  </li>
                ))}
              </ol>
            </Page2>
          </section>
          <section>
            <h2>Third Slide</h2>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </section>
        </div>
      </div>
    </Style>
  );
};

export default About;
