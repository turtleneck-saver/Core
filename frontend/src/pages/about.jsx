import React, { useEffect } from "react";
import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/white.css";
import styled from "styled-components";

import pikachu from "../assets/pikachu.cur";

import Section1 from "./sections/section1";
import Section2 from "./sections/section2";
import Section3 from "./sections/section3";
import Section4 from "./sections/section4";
import Section5 from "./sections/section5";
const Style = styled.div`
  * {
    cursor: url(${pikachu}), auto !important;
  }
  .info {
    transition: transform 0.6s ease;
    height: 17em;
    margin: 0px;
    z-index: 2;
  }
  .info:hover {
    transform: scale(1.1);
  }
  .background {
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
  .title {
    font-size: 2em;
    color: rgb(145, 252, 216);
    transform: translateY(-20%);
    z-index: 1;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    animation: bounce 2s infinite; /* 애니메이션 적용 */
  }
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px); /* 위로 이동 */
    }
  }
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

const About = () => {
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
          <Section1 />
          <Section2 />
          <Section3 />
          <Section4 />
          <Section5 />
        </div>
      </div>
    </Style>
  );
};

export default About;
