import { render } from "react-dom";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Video from "./components/video";
import OldVideo from "./components/oldVideo";
import NewVideo from "./components/newVideo";
import About from "./pages/about";
const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Video />} />
        <Route path="/old" element={<OldVideo />} />
        <Route path="/new" element={<NewVideo />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

const appDiv = document.getElementById("app");
render(<Main />, appDiv);
