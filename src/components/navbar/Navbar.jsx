import React, { useState } from "react";
import "./navbar.scss";
import { CiSearch } from "react-icons/ci";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";


const themes = [
  "light",
  "dark",
  "ocean",
  "sunset",
];

const Navbar = () => {
  const [theme, setTheme] = useState("default");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for toggling the menu

  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar">
      <div className="content">
        <div className="left-navigator">
          <div className="logo">
            <span className="letter r">R</span>
            <span className="letter b">B</span>
          </div>
          <div className={`menu ${isMenuOpen ? "active" : ""}`}>
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
            <button className="btn-search">
              <CiSearch />
            </button>
            <input type="text" placeholder="Search..." className="input-search" />
          </div>
          <div className="theme-selector">
            <select value={theme} onChange={handleThemeChange}>
              {themes.map((themeOption) => (
                <option key={themeOption} value={themeOption}>
                  {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button className="hamburger" onClick={toggleMenu}>
          {isMenuOpen ? <RxCross1 /> : <HiOutlineMenuAlt4 />
          }
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
