import React from "react";
import "./navbar.scss";
import { CiSearch } from "react-icons/ci";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="content">
        <div className="left-navigator">
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
        <div className="right-navigator">
          <div className="searchbar">
            <label htmlFor="search"><CiSearch /></label>
            <input type="text" placeholder="Search..." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
