import React from "react";
import styled from "styled-components";
// import turtleman from "../../assets/turtleman.mp4";

const Style = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;

  #sub-title {
    font-size: 1em;
    color: white;
    transform: translateY(-50%);
    z-index: 1;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  .member {
    transform: translateX(150%);
    font-size: 0.8em;
    font-weight: bold;
    color: skyblue;
  }
`;

const Section1 = () => {
  return (
    <section>
      <Style>
        <video className="background" autoPlay loop muted>
          <source
            src="https://cdn-sv.p-e.kr/assets/turtleman.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <h2 className="title">인공지능종합설계</h2>
        <p id="sub-title">거북목 방지 프로젝트</p>
        <li className="member">최지웅</li>
        <li className="member">서정빈</li>
        <li className="member">이나연</li>
      </Style>
    </section>
  );
};

export default Section1;
