import React from "react";
import styled from "styled-components";
import wallpaper2 from "../../assets/wallpaper2.mp4";
import landmarks from "../../assets/landmarks.png";
import Section from "../utils/section";
const Style = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;

  .title {
    margin-top: 1em;
  }

  .info:hover {
    transform: scale(1.1);
  }
`;

const Section4 = () => {
  return (
    <Section src={wallpaper2} title={"문제 정의"}>
      <Style>
        <img className="info" src={landmarks} alt="Landmarks" />
      </Style>
    </Section>
  );
};

export default Section4;
