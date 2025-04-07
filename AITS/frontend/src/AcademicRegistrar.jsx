import React, { useState, useEffect } from "react";
import { FaBars, FaHome, FaTasks, FaChartBar, FaUserCog } from "react-icons/fa";
import { Select, Button, useToast, Box, Text } from "@chakra-ui/react";
import "./index.css";

const AcademicRegistrarDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [lecturers, setLecturers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [issueDetails, setIssueDetails] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const toast = useToast();

  useEffect(() => {
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

    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found. Please log in.");
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/api/issues/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIssues(data);
        } else {
          console.error("Error fetching issues:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchLecturers();
    fetchIssues();
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
        fetchIssues();
      } else {
        toast({ title: "Failed to assign issue.", status: "error", duration: 5000, isClosable: true });
      }
    } catch (error) {
      toast({ title: "Error assigning issue.", status: "error", duration: 5000, isClosable: true });
    }
  };

  const handleIssueSelect = (issueId) => {
    const selectedIssue = issues.find((issue) => issue.id === parseInt(issueId));
    setSelectedIssue(selectedIssue);
    setIssueDetails(selectedIssue);
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <div style={{ display: "flex" }}>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <ul>
          <li onClick={() => handleMenuClick("dashboard")}>
            <FaHome /> {isOpen && <span>Registrar</span>}
          </li>
          <li onClick={() => handleMenuClick("issues")}>
            <FaTasks /> {isOpen && <span>Manage Issues</span>}
          </li>
          <li onClick={() => handleMenuClick("reports")}>
            <FaChartBar /> {isOpen && <span>Reports</span>}
          </li>
          <li onClick={() => handleMenuClick("settings")}>
            <FaUserCog /> {isOpen && <span>Settings</span>}
          </li>
        </ul>

        <div className="assignment-section">
          <h3>Assign Issue</h3>
          <Select placeholder="Select Issue" onChange={(e) => handleIssueSelect(e.target.value)}>
            {issues.map((issue) => (
              <option key={issue.id} value={issue.id}>
                {issue.title}
              </option>
            ))}
          </Select>

          <Select placeholder="Select Lecturer" onChange={(e) => setSelectedLecturer(e.target.value)}>
            {lecturers.map((lecturer) => (
              <option key={lecturer.id} value={lecturer.id}>
                {lecturer.fullName}
              </option>
            ))}
          </Select>

          <Button colorScheme="green" onClick={assignIssue} mt={2}>
            Assign
          </Button>
        </div>
      </div>

      <Box p={4} flex="1" ml={isOpen ? "250px" : "80px"}>
        {activeMenu === "dashboard" && <div>Dashboard Content</div>}
        {activeMenu === "issues" && <div>Manage Issues Content</div>}
        {activeMenu === "reports" && <div>Reports Content</div>}
        {activeMenu === "settings" && <div>Settings Content</div>}

        {issueDetails && (
          <Box mt={4} p={4} borderWidth="1px" borderRadius="lg"> {/* Wrapped issue details in a Box */}
            <h3>Issue Details</h3>
            <Text><strong>Title:</strong> {issueDetails.title}</Text>
            <Text><strong>Description:</strong> {issueDetails.description}</Text>
            <Text><strong>Status:</strong> {issueDetails.status}</Text>
            <Text><strong>Assigned To:</strong> {issueDetails.assigned_to ? issueDetails.assigned_to.fullName : "Not Assigned"}</Text>
            <Text><strong>Created At:</strong> {issueDetails.created_at}</Text>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default AcademicRegistrarDashboard;