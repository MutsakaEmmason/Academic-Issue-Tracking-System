import React, { useState } from "react";
import { FaBars, FaHome, FaTasks, FaChartBar, FaUserCog } from "react-icons/fa";
import "./index.css";

const Sidebar = ({ onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <ul>
        <li onClick={() => onMenuClick("dashboard")}>
          <FaHome /> {isOpen && <span>Registrar</span>}
        </li>
        <li onClick={() => onMenuClick("issues")}>
          <FaTasks /> {isOpen && <span>Manage Issues</span>}
        </li>
        <li onClick={() => onMenuClick("reports")}>
          <FaChartBar /> {isOpen && <span>Reports</span>}
        </li>
        <li onClick={() => onMenuClick("settings")}>
          <FaUserCog /> {isOpen && <span>Settings</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
