import React from "react";
import styled from "styled-components";
import wallpaper2 from "../../assets/wallpaper2.mp4";
import landmarks from "../../assets/landmarks.png";

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
    <section>
      <Style>
        <video className="background" autoPlay loop muted>
          <source src={wallpaper2} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h2 className="title">서론[목적 및 목표]</h2>
        <img className="info" src={landmarks} alt="Landmarks" />
      </Style>
    </section>
  );
};

export default Section4;
