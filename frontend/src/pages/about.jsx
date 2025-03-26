import React, { useEffect } from "react";
import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/white.css"; // 원하는 테마로 변경
import styled from "styled-components";

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
    height: 100%; /* 각 슬라이드가 전체 화면을 사용하도록 설정 */
    position: relative; /* 비디오 배경을 위한 상대 위치 */
  }
`;

const Page1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; /* 수직 중앙 정렬 */
  align-items: center; /* 수평 중앙 정렬 */
  height: 100%; /* 부모 요소의 높이를 100%로 설정 */
  position: relative; /* 자식 요소를 위한 상대 위치 */

  #title {
    font-size: 2em;
    color: white; /* 텍스트 색상을 흰색으로 변경 */
    transform: translateY(-20%); /* 상단 50% 위치로 이동 */
    z-index: 1; /* 텍스트가 비디오 위에 보이도록 설정 */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  #sub-title {
    font-size: 1em;
    color: white; /* 텍스트 색상을 흰색으로 변경 */
    transform: translateY(-50%); /* 상단 50% 위치로 이동 */
    z-index: 1; /* 텍스트가 비디오 위에 보이도록 설정 */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* 그림자 추가 */
  }

  /* 비디오 스타일 */
  video {
    border-radius: 10%;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover; /* 비디오가 영역을 가득 채우도록 설정 */
    transform: translate(-50%, -50%);
    z-index: 0; /* 비디오가 배경으로 보이도록 설정 */
  }
  .member {
    transform: translateX(150%);
  }
`;

const About = () => {
  useEffect(() => {
    const deck = new Reveal({
      backgroundTransition: "slide",
      transition: "slide",
      width: "100%",
      height: "100%",
    });
    deck.initialize();

    return () => {
      deck.destroy(); // 컴포넌트 언마운트 시 정리
    };
  }, []);

  return (
    <Style>
      <div className="reveal">
        <div className="slides">
          <section>
            <Page1>
              <video autoPlay loop muted>
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
          </section>

          <section>
            <h2>Second Slide</h2>
            <p>Here is some information.</p>
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
