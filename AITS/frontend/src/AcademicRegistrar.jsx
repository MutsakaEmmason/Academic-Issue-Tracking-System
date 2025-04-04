import React, { useState, useEffect } from "react";
import { FaBars, FaHome, FaTasks, FaChartBar, FaUserCog } from "react-icons/fa";
import { Select, Button, useToast } from "@chakra-ui/react";
import "./index.css";

const Sidebar = ({ onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [lecturers, setLecturers] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const toast = useToast();

  useEffect(() => {
    // Fetch list of lecturers from API
    const fetchLecturers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/lecturers/");
        if (response.ok) {
          const data = await response.json();
          setLecturers(data);
        }
      } catch (error) {
        console.error("Error fetching lecturers:", error);
      }
    };

    fetchLecturers();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const assignIssue = async () => {
    if (!selectedIssue || !selectedLecturer) {
      toast({ title: "Please select an issue and a lecturer.", status: "warning", duration: 5000, isClosable: true });
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/issues/${selectedIssue}/assign/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ assigned_to: selectedLecturer }),
      });

      if (response.ok) {
        toast({ title: "Issue assigned successfully!", status: "success", duration: 5000, isClosable: true });
      } else {
        toast({ title: "Failed to assign issue.", status: "error", duration: 5000, isClosable: true });
      }
    } catch (error) {
      toast({ title: "Error assigning issue.", status: "error", duration: 5000, isClosable: true });
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <ul>
        <li onClick={() => onMenuClick("dashboard")}> <FaHome /> {isOpen && <span>Registrar</span>} </li>
        <li onClick={() => onMenuClick("issues")}> <FaTasks /> {isOpen && <span>Manage Issues</span>} </li>
        <li onClick={() => onMenuClick("reports")}> <FaChartBar /> {isOpen && <span>Reports</span>} </li>
        <li onClick={() => onMenuClick("settings")}> <FaUserCog /> {isOpen && <span>Settings</span>} </li>
      </ul>

      {/* Issue Assignment Section */}
      <div className="assignment-section">
        <h3>Assign Issue</h3>
        <Select placeholder="Select Issue" onChange={(e) => setSelectedIssue(e.target.value)}>
          {/* Example Issues, ideally fetch dynamically */}
          <option value="1">Issue 1</option>
          <option value="2">Issue 2</option>
        </Select>

        <Select placeholder="Select Lecturer" onChange={(e) => setSelectedLecturer(e.target.value)}>
          {lecturers.map((lecturer) => (
            <option key={lecturer.id} value={lecturer.id}>{lecturer.fullName}</option>
          ))}
        </Select>

        <Button colorScheme="green" onClick={assignIssue} mt={2}>Assign</Button>
      </div>
    </div>
  );
};

export default Sidebar;
