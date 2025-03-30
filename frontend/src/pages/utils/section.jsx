import React from "react";

const Section = ({ src, title, children }) => {
  return (
    <section>
      <video className="background" autoPlay loop muted>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <h2 className="title">{title}</h2>
      {children} {/* 자식 요소를 렌더링 */}
    </section>
  );
};

export default Section;
