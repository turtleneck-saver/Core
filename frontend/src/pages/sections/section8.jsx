import React from "react";
// import wallpaper5 from "../../assets/wallpaper5.mp4";
import Section from "../utils/section";
import styled from "styled-components";

// import different from "../../assets/different.png";

const Style = styled.div``;
const Section8 = () => {
  return (
    <Section
      src="https://cdn-sv.p-e.kr/assets/wallpaper9.mp4"
      title={"웹 어셈블리"}
    >
      <Style>
        <img
          className="info"
          src="https://cdn-sv.p-e.kr/assets/wasm.png"
          alt="wasm"
        />
      </Style>
    </Section>
  );
};
export default Section8;
