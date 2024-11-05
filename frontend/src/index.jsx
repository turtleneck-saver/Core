import { render } from "react-dom";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Video from "./components/video";
const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Video />} />
      </Routes>
    </Router>
  );
};

const appDiv = document.getElementById("app");
render(<Main />, appDiv);
