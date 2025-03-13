import React, { useState } from "react";
import { FaBars, FaHome, FaUser, FaCog } from "react-icons/fa";
import "./index.css"; // Import CSS for styling

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
      <div className="sidebar">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <ul className="menu">
          <li>
            <FaHome />
            {isOpen && <span>Home</span>}
          </li>
          <li>
            <FaUser />
            {isOpen && <span>Profile</span>}
          </li>
          <li>
            <FaCog />
            {isOpen && <span>Settings</span>}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
