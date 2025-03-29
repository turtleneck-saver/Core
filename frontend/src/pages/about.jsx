import React, { useEffect, useRef, useState } from "react";
import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/white.css";
import styled from "styled-components";
import applecat from "/app/frontend/src/assets/apple-cat.gif";
import turtleman from "/app/frontend/src/assets/turtleman.mp4";
import intro from "/app/frontend/src/assets/intro.mp4";
import pikachu from "/app/frontend/src/assets/pikachu.cur";
import turtleneck from "/app/frontend/src/assets/turtleneck.jpg";
import turtleneckstep from "/app/frontend/src/assets/turtleneck-step.png";
import businessman from "/app/frontend/src/assets/businessman.png";
import landmarks from "/app/frontend/src/assets/landmarks.png";
import wallpaper1 from "/app/frontend/src/assets/wallpaper1.jpg";
const Style = styled.div`
  cursor: url(${pikachu}), auto !important;
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
    font-size: 3em;
    font-weight: bold;
  }

  .index {
    font-size: 1em;
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
const Page3 = styled.div`
  background-image: url(${businessman});

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
  z-index: -10;

  .info {
    height: 80%;
    transition: transform 0.3s ease;
  }
  #statistics:hover {
    transform: scale(1.1);
  }

  /* 모달 스타일 */
  .modal {
    display: ${(props) => (props.show ? "block" : "none")};
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 1em;
  }

  .modal-content {
    border-radius: 1em;
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
`;

const Page4 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
  z-index: -10;
  #title {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 0.5em;
    padding: 10px;
    font-size: 1.5em;
    font-weight: bold;
  }
  #background {
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
  .info {
    height: 80%;
    transition: transform 0.3s ease;
  }
  .info:hover {
    transform: scale(1.1);
  }
`;

const About = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
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

    deck.on("slidechanged", (event) => {
      const currentSlide = event.currentSlide;

      // 현재 슬라이드의 모든 비디오 태그 선택
      const videos = currentSlide.querySelectorAll("video");
      try {
        // 모든 비디오에 대해 작업 수행
        if (videos.length > 0) {
          videos.forEach((video) => {
            video.play(); // 현재 슬라이드에서 비디오 재생
          });
        } else {
          const allVideos = document.querySelectorAll("video");
          allVideos.forEach((video) => {
            video.pause(); // 비디오가 없다면 모든 비디오 정지
          });
        }
      } catch (error) {
        console.error(error);
      }
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
                <source src={turtleman} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <h2 id="title">인공지능종합설계</h2>
              <p id="sub-title">거북목 방지 프로젝트</p>
              <li className="member">최지웅</li>
              <li className="member">서정빈</li>
              <li className="member">이나연</li>
            </Page1>
          </section>

          <section>
            <Page2>
              <video ref={videoRef} autoPlay loop muted>
                <source src={intro} type="video/mp4" />
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
          </section> */}
          {/* <section>
            <Page3 show={modalVisible}>
              <h2>서론[주제 소개]</h2>
              <img
                className="info"
                src={turtleneck}
                onClick={toggleModal}
                alt="Turtleneck"
              />
              <div
                className="modal"
                style={{ display: modalVisible ? "block" : "none" }}
              >
                <div className="modal-content">
                  <span className="close" onClick={toggleModal}>
                    &times;
                  </span>
                  <h2>거북목의 단계</h2>
                  <img src={turtleneckstep}></img>
                </div>
              </div>
            </Page3>
          </section> */}
          <section>
            <Page4>
              <img id="background" src={wallpaper1} />
              <h2 id="title">서론[목적 및 목표]</h2>
              <img className="info" src={landmarks} alt="Landmarks" />
            </Page4>
          </section>
        </div>
      </div>
    </Style>
  );
};

export default About;
