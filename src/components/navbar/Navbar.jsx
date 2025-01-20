import React from "react";
import "./navbar.scss";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="content">
        <div class="logo">
          <span class="letter r">R</span>
          <span class="letter b">B</span>
        </div>
        <div className="menu">
        <ul>
            <li>Home</li>
            <li>About</li>
            <li>Skills</li>
            <li>Blog</li>
        </ul>
      </div>
      </div>
      
    </div>
  );
};

export default Navbar;
