import React from "react";
// import wallpaper5 from "../../assets/wallpaper5.mp4";
import Section from "../utils/section";
import styled from "styled-components";
// import different from "../../assets/different.png";
const Style = styled.div``;
const Section6 = () => {
  return (
    <Section
      src="https://cdn-sv.p-e.kr/assets/wallpaper5.mp4"
      title={"기존 프로젝트와의 차별점"}
    >
      <Style>
        <img
          className="info"
          src="https://cdn-sv.p-e.kr/assets/different.png"
          alt="different"
        />
      </Style>
    </Section>
  );
};
export default Section6;
