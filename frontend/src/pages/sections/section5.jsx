// import React, { useState } from "react";
// import styled from "styled-components";
// import Section from "../utils/section";
// import wallpaper4 from "../../assets/wallpaper4.mp4";
// import { IonIcon } from "react-ion-icon";

// const Style = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   position: relative;
//   height: 100%;
// `;

// const MenuToggle = styled.div`
//   position: relative;
//   width: 60px;
//   height: 60px;
//   color: #fff;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 100;
//   border-radius: 50%;
//   cursor: pointer;
//   font-size: 32px;
//   transition: 1.5s;
//   background-color: #ff2972; /* Toggle button color */
// `;

// const Menu = styled.ul`
//   position: relative;
//   width: 260px;
//   height: 260px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   transition: 0.5s;
//   list-style: none;

//   li {
//     color: transparent;
//     position: absolute;
//     left: 0;
//     transform: rotate(0deg) translateX(100px);
//     transform-origin: 130px;
//     transition: 0.5s;
//     transition-delay: calc(0.1s * var(--i));
//     text-align: center; /* 텍스트 정렬 */
//   }

//   &.active li {
//     transform: rotate(calc(360deg / 8 * var(--i)));
//   }

//   a {
//     display: flex;
//     flex-direction: column; /* 세로 방향으로 정렬 */
//     align-items: center;
//     justify-content: center;
//     width: 60px;
//     height: 60px;
//     text-decoration: none;
//     font-size: 22px;
//     border-radius: 50%;
//     color: transparent;
//     transition: 1s;
//     transition-delay: 0.5s;
//     filter: drop-shadow(0 0 2px var(--clr));
//   }

//   &.active a {
//     color: var(--clr);
//   }

//   a::before {
//     content: "";
//     position: absolute;
//     width: 20px;
//     height: 2px;
//     border-radius: 2px;
//     background: var(--clr);
//     transform: rotate(calc(90deg * var(--i))) translate(0, 25px);
//     transition: width 0.5s, height 0.5s, transform 0.5s;
//     transition-delay: 0.5s, 1s, 1.5s;
//   }

//   &.active a::before {
//     width: 50px;
//     height: 50px;
//     background: rgba(255, 255, 255, 0.1);
//     border: 2px solid var(--clr);
//     transform: rotate(calc(0 * var(--i)));
//     transition: transform 0.5s, height 0.5s, width 0.5s;
//     transition-delay: 0.5s, 1.5s, 1.5s;
//     border-radius: 10px;
//     filter: drop-shadow(0 0 5px var(--clr));
//   }

//   /* 아이콘 설명 텍스트 스타일 */
//   .icon-label {
//     font-size: 12px;
//     margin-top: 5px; /* 아이콘과 텍스트 사이의 간격 */
//     color: var(--clr);
//     /* transform: translateY(0);  텍스트 회전 없음 */
//     transform: rotate(
//       calc(360deg / -8 * var(--i))
//     ); /* li 회전 방향과 반대로 회전 */
//   }
// `;

// const Section5 = () => {
//   const [isActive, setIsActive] = useState(false);

//   const handleToggle = () => {
//     setIsActive(!isActive);
//   };

//   const contents = [
//     {
//       icon: "home-outline",
//       color: "#ff2972",
//       label: "가설 검증",
//       url: "/",
//     },
//     {
//       icon: "settings-outline",
//       color: "#fee800",
//       label: "개발 방법론",
//       url: "https://turtleneck-preventor.atlassian.net/jira/software/projects/SCRUM/boards/1/timeline",
//     },
//     {
//       icon: "mail-outline",
//       color: "#04fc43",
//       label: "부하 테스트",
//       url: "https://locust.io/",
//     },
//     {
//       icon: "key-outline",
//       color: "#fe00f1",
//       label: "모니터링",
//       url: "https://velog.io/@kgh2120/%ED%94%84%EB%A1%9C%EB%A9%94%ED%85%8C%EC%9A%B0%EC%8A%A4%EC%99%80-%EA%B7%B8%EB%9D%BC%ED%8C%8C%EB%82%98",
//     },
//     {
//       icon: "camera-outline",
//       color: "#00b0fe",
//       label: "깃 전략",
//       url: "https://github.com/creepereye1204/turtleneck-saver",
//     },
//     {
//       icon: "game-controller-outline",
//       color: "#fea600",
//       label: "배포 방식",
//       url: "https://hudi.blog/zero-downtime-deployment/",
//     },
//     { icon: "person-outline", color: "#a529ff", label: "사용자", url: "/user" },
//     {
//       icon: "videocam-outline",
//       color: "#01bdab",
//       label: "아키텍쳐",
//       url: "https://github.com/creepereye1204/turtleneck-saver",
//     },
//   ];

//   return (
//     <Section src={wallpaper4} title={"리서치 및 조사[리서치]"}>
//       <Style>
//         <MenuToggle onClick={handleToggle}>
//           <IonIcon name="add-outline" />
//         </MenuToggle>
//         <Menu className={isActive ? "active" : ""}>
//           {contents.map((content, index) => (
//             <li key={index} style={{ "--i": index, "--clr": content.color }}>
//               <a href={content.url} target="_blank" rel="noopener noreferrer">
//                 <IonIcon name={content.icon} />
//                 <span className="icon-label">{content.label}</span>
//               </a>
//             </li>
//           ))}
//         </Menu>
//       </Style>
//     </Section>
//   );
// };

// export default Section5;
import React, { useState } from "react";
import styled from "styled-components";
import Section from "../utils/section";
// import wallpaper4 from "../../assets/wallpaper4.mp4";
import { IonIcon } from "react-ion-icon";

const Style = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100%;
`;

const MenuToggle = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: 50%;
  cursor: pointer;
  font-size: 32px;
  transition: 1.5s;
  background-color: #ff2972; /* Toggle button color */
`;

const Menu = styled.ul`
  position: relative;
  width: 260px;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s;
  list-style: none;

  li {
    color: transparent;
    position: absolute;
    left: 0;
    transform: rotate(0deg) translateX(100px);
    transform-origin: 130px;
    transition: 0.5s;
    transition-delay: calc(0.1s * var(--i));
    text-align: center; /* 텍스트 정렬 */
  }

  &.active li {
    transform: rotate(calc(360deg / 8 * var(--i)));
  }

  a {
    display: flex;
    flex-direction: column; /* 세로 방향으로 정렬 */
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    text-decoration: none;
    font-size: 22px;
    border-radius: 50%;
    color: transparent;
    transition: 1s;
    transition-delay: 0.5s;
    filter: drop-shadow(0 0 2px var(--clr));
  }

  &.active a {
    color: var(--clr);
  }

  a::before {
    content: "";
    position: absolute;
    width: 20px;
    height: 2px;
    border-radius: 2px;
    background: var(--clr);
    transform: rotate(calc(90deg * var(--i))) translate(0, 25px);
    transition: width 0.5s, height 0.5s, transform 0.5s;
    transition-delay: 0.5s, 1s, 1.5s;
  }

  &.active a::before {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid var(--clr);
    transform: rotate(calc(0 * var(--i)));
    transition: transform 0.5s, height 0.5s, width 0.5s;
    transition-delay: 0.5s, 1.5s, 1.5s;
    border-radius: 10px;
    filter: drop-shadow(0 0 5px var(--clr));
  }

  /* 아이콘 설명 텍스트 스타일 */
  .icon-label {
    font-size: 12px;
    margin-top: 5px; /* 아이콘과 텍스트 사이의 간격 */
    color: var(--clr);
    transform: rotate(
      calc(360deg / -8 * var(--i))
    ); /* li 회전 방향과 반대로 회전 */
    display: inline-block; /* span 태그를 inline-block으로 변경 */
  }
`;

const Section5 = () => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const contents = [
    {
      icon: "home-outline",
      color: "#ff2972",
      label: "가설 검증",
      url: "/",
    },
    {
      icon: "settings-outline",
      color: "#fee800",
      label: "개발 방법론",
      url: "https://turtleneck-preventor.atlassian.net/jira/software/projects/SCRUM/boards/1/timeline",
    },
    {
      icon: "mail-outline",
      color: "#04fc43",
      label: "부하 테스트",
      url: "https://locust.io/",
    },
    {
      icon: "key-outline",
      color: "#fe00f1",
      label: "모니터링",
      url: "https://velog.io/@kgh2120/%ED%94%84%EB%A1%9C%EB%A9%94%ED%85%8C%EC%9A%B0%EC%8A%A4%EC%99%80-%EA%B7%B8%EB%9D%BC%ED%8C%8C%EB%82%98",
    },
    {
      icon: "camera-outline",
      color: "#00b0fe",
      label: "깃 전략",
      url: "https://github.com/creepereye1204/turtleneck-saver",
    },
    {
      icon: "game-controller-outline",
      color: "#fea600",
      label: "배포 방식",
      url: "https://hudi.blog/zero-downtime-deployment/",
    },
    { icon: "person-outline", color: "#a529ff", label: "피드백", url: "/user" },
    {
      icon: "videocam-outline",
      color: "#01bdab",
      label: "아키텍쳐",
      url: "https://github.com/creepereye1204/turtleneck-saver",
    },
  ];

  return (
    <Section
      src="http://210.109.82.36/assets/wallpaper4.mp4"
      title={"프로젝트 개요"}
    >
      <Style>
        <MenuToggle onClick={handleToggle}>
          <IonIcon name="add-outline" />
        </MenuToggle>
        <Menu className={isActive ? "active" : ""}>
          {contents.map((content, index) => (
            <li key={index} style={{ "--i": index, "--clr": content.color }}>
              <a href={content.url} target="_blank" rel="noopener noreferrer">
                <IonIcon name={content.icon}>
                  <span className="icon-label">{content.label}</span>
                </IonIcon>
              </a>
            </li>
          ))}
        </Menu>
      </Style>
    </Section>
  );
};

export default Section5;
