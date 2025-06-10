import React from "react";
import Section from "../utils/section";
import styled from "styled-components";

const Style = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: relative;
  background: rgba(255, 255, 255, 0.2);
`;

const NotionButton = styled.button`
  padding: 16px 40px;
  font-size: 20px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f5ba8b 0%, #b8e1fc 100%);
  color: #222;
  font-weight: bold;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  margin-bottom: 24px;
  transition: transform 0.1s, box-shadow 0.1s;
  &:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.13);
    background: linear-gradient(90deg, #f7c59f 0%, #aee2ff 100%);
  }
`;

const DashboardFrame = styled.iframe`
  width: 90%;
  height: 600px; /* 높이 늘림 */
  margin-top: 0;
  border: none;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
  background: #fff;
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
        <NotionButton onClick={handleClick}>Notion 바로가기</NotionButton>
        <DashboardFrame src="/dashboard" title="Notion Iframe" />
      </Style>
    </Section>
  );
};
export default Section11;
