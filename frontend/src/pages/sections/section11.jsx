import React from "react";
import Section from "../utils/section";
import styled from "styled-components";

const Style = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const Section11 = () => {
  const handleClick = () => {
    window.open(
      "https://www.notion.so/20c22a85cf3a8087a347c66dc1fe0f1a?source=copy_link",
      "_blank"
    );
  };

  return (
    <Section
      src="https://cdn-sv.p-e.kr/assets/wallpaper11.mp4"
      title={"회고록"}
    >
      <Style>
        <button
          style={{
            padding: "16px 32px",
            fontSize: "18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={handleClick}
        >
          Notion
        </button>
      </Style>
    </Section>
  );
};
export default Section11;
