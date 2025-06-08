import React from "react";
// import wallpaper5 from "../../assets/wallpaper5.mp4";
import Section from "../utils/section";
import styled from "styled-components";

// import different from "../../assets/different.png";

const Style = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px; /* 필요에 따라 조정 */
`;

const Section11 = () => {
  const handleClick = () => {
    window.open("/new", "_blank");
  };

  return (
    <Section
      src="https://cdn-sv.p-e.kr/assets/wallpaper11.mp4"
      title={"구글 에서 제공하는 wasm 파일 사용"}
    >
      // ...existing code...
      <Style>
        <iframe
          src="https://www.notion.so/20c22a85cf3a8087a347c66dc1fe0f1a?source=copy_link"
          title="외부 웹사이트"
          width="100%"
          height="100%"
          style={{ border: "none", minHeight: "300px" }}
        ></iframe>
      </Style>
      // ...existing code...
    </Section>
  );
};
export default Section11;
