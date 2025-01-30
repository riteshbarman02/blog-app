import React from "react";
import "./Home.scss";
import Three from "../threejs/Three";

const Home = () => {
  return (
    <div className="home ">
      <div className="primary-container">
        <div className="threejs-container">
          <Three />
        </div>
        <div className="about-section"></div>
      </div>
    </div>
  );
};

export default Home;
