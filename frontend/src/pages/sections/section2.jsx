import React, { useState } from "react";
import styled from "styled-components";
import applecat from "../../assets/apple-cat.gif";
import intro from "../../assets/intro.mp4";

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

  return (
    <section>
      <Style>
        <video className="background" autoPlay loop muted>
          <source src={intro} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h2 className="title">목차</h2>
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
                  src={applecat}
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
