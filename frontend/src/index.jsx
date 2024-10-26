import { render } from "react-dom";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Main = () => {
  return (
    <Router>
      <Routes></Routes>
    </Router>
  );
};

const appDiv = document.getElementById("app");
render(<Main />, appDiv);
