import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/navbar.css";
import { LuSun, LuMoon } from "react-icons/lu";
import { Fonts } from "../utils/fonts";


function Navbar() {
  const { toggleTheme, dark } = useContext(ThemeContext);

    const navItems = [
        { name: "Home", link: "/" },
        { name: "About", link: "/about" },
        { name: "Projects", link: "/projects" },
        { name: "Skills", link: "/skills" },
        { name: "Contact", link: "/contact" }
    ];

  return (
    <nav className="floating-navbar" style={{ fontFamily: Fonts.DMSerif }}  >
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.link}
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          {item.name}
        </NavLink>
      ))}

      <button className="theme-toggle" onClick={toggleTheme}>
        {dark ? <LuMoon style={{margin: 0}}/> : <LuSun style={{margin: 0}} />}
      </button>
    </nav>
  );
}

export default Navbar;
