import React, { useState } from "react";
import styled from "styled-components";
import turtleneck from "../../assets/turtleneck.jpg";
import turtleneckstep from "../../assets/turtleneck-step.png";
import wallpaper1 from "../../assets/wallpaper1.mp4";

const Style = styled.div`
  .modal {
    display: ${(props) => (props.show ? "block" : "none")};
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 1em;
  }

  .modal-content {
    border-radius: 1em;
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
`;

const Section3 = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <section>
      <Style show={modalVisible}>
        <h2 className="title">서론[주제 소개]</h2>
        <img
          className="info"
          src={turtleneck}
          alt="Turtleneck"
          onClick={toggleModal}
        />
        <video className="background" autoPlay loop muted>
          <source src={wallpaper1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div
          className="modal"
          style={{ display: modalVisible ? "block" : "none" }}
        >
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>
              &times;
            </span>
            <h2>거북목의 단계</h2>
            <img className="info" src={turtleneckstep} alt="Turtleneck Step" />
          </div>
        </div>
      </Style>
    </section>
  );
};

export default Section3;
