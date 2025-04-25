import React, { useState, useEffect } from "react";
import { FaBars, FaHome, FaTasks, FaChartBar, FaUserCog } from "react-icons/fa";
import { Select, Button, useToast, Box, Text } from "@chakra-ui/react";
import "./index.css";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AcademicRegistrarDashboard = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [lecturers, setLecturers] = useState([]);
    const [issues, setIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [selectedLecturer, setSelectedLecturer] = useState("");
    const [issueDetails, setIssueDetails] = useState(null);
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const toast = useToast();
    const navigate = useNavigate(); // Initialize useNavigate

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
                const token = localStorage.getItem("accessToken"); // Use accessToken
                console.log("Token retrieved from localStorage:", token); // Debug log

                if (!token) {
                    console.error("Token not found. Please log in.");
                    toast({
                        title: "Please log in to access issues.",
                        status: "error",
                        duration: 5000,
                        isClosable: true
                    });
                    navigate('/registrar-login'); // Redirect to login if no token
                    return;
                }

                // Step 1: Get registrar profile to determine college
                const profileResponse = await fetch("http://127.0.0.1:8000/api/registrar-profile/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (profileResponse.status === 401 || profileResponse.status === 403) {
                    console.error("Unauthorized. Please log in again.");
                    toast({
                        title: "Unauthorized. Please log in again.",
                        status: "error",
                        duration: 5000,
                        isClosable: true
                    });
                    navigate('/registrar-login'); // Redirect on unauthorized
                    return;
                }

                if (!profileResponse.ok) {
                    console.error("Failed to fetch registrar profile");
                    toast({
                        title: "Failed to fetch profile.",
                        status: "error",
                        duration: 5000,
                        isClosable: true
                    });
                    return;
                }

                const registrarData = await profileResponse.json();
                const college = registrarData.college;

                // Step 2: Fetch issues filtered by registrar's college
                const response = await fetch(`http://127.0.0.1:8000/api/issues/?college=${college}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401 || response.status === 403) {
                    console.error("Unauthorized to fetch issues.");
                    toast({
                        title: "Unauthorized to fetch issues.",
                        status: "error",
                        duration: 5000,
                        isClosable: true
                    });
                    navigate('/registrar-login'); // Redirect on unauthorized
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched filtered issues for college:", college, data);
                    setIssues(data);
                } else {
                    console.error("Error fetching issues:", response.statusText);
                    toast({
                        title: "Error fetching issues.",
                        status: "error",
                        duration: 5000,
                        isClosable: true
                    });
                }
            } catch (error) {
                console.error("Error fetching issues:", error);
                toast({
                    title: "Error fetching issues.",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            }
        };

        fetchLecturers();
        fetchIssues();
    }, [navigate, toast]); // Add navigate and toast to dependency array

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const assignIssue = async () => {
        if (!selectedIssue || !selectedLecturer) {
            toast({ title: "Please select an issue and a lecturer.", status: "warning", duration: 5000, isClosable: true });
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`http://127.0.0.1:8000/api/issues/${selectedIssue.id}/assign/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ assigned_to: selectedLecturer }),
            });

            if (response.ok) {
                toast({ title: "Issue assigned successfully!", status: "success", duration: 5000, isClosable: true });
                const updatedIssue = await response.json();
                setIssueDetails(updatedIssue);
            } else if (response.status === 401 || response.status === 403) {
                toast({ title: "Unauthorized.", status: "error", duration: 5000, isClosable: true });
                navigate('/registrar-login');
            } else {
                toast({ title: "Failed to assign issue.", status: "error", duration: 5000, isClosable: true });
            }
        } catch (error) {
            toast({ title: "Error assigning issue.", status: "error", duration: 5000, isClosable: true });
        }
    };

    const handleIssueSelect = (issueId) => {
        const selected = issues.find((issue) => issue.id === parseInt(issueId));
        setSelectedIssue(selected);
        setIssueDetails(selected);
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

                    <Box mb={2}>
                        {issues.length > 0 ? (
                            <Text fontSize="sm" color="gray.600">
                                Showing {issues.length} issues
                            </Text>
                        ) : (
                            <Text fontSize="sm" color="red.500">
                                No issues available
                            </Text>
                        )}
                    </Box>

                    <Select placeholder="Select Issue" onChange={(e) => handleIssueSelect(e.target.value)}>
                        {issues.map((issue) => (
                            <option key={issue.id} value={issue.id}>
                                {issue.title || "Untitled Issue"}
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
                    <Box mt={4} p={4} borderWidth="1px" borderRadius="lg">
                        <h3>Issue Details</h3>
                        <Text><strong>Student Name:</strong> {issueDetails.studentName}</Text>
                        <Text><strong>Title:</strong> {issueDetails.title}</Text>
                        <Text><strong>Description:</strong> {issueDetails.description}</Text>
                        <Text><strong>Status:</strong> {issueDetails.status}</Text>
                        <Text><strong>Course Code:</strong> {issueDetails.courseCode}</Text>
                        <Text><strong>Student ID:</strong> {issueDetails.studentId}</Text>
                        <Text><strong>Lecturer:</strong> {issueDetails.lecturer}</Text>
                        <Text><strong>Department:</strong> {issueDetails.department}</Text>
                        <Text><strong>Semester:</strong> {issueDetails.semester}</Text>
                        <Text><strong>Academic Year:</strong> {issueDetails.academicYear}</Text>
                        <Text><strong>Issue Date:</strong> {issueDetails.issueDate}</Text>
                        <Text>
                            <strong>Assigned To:</strong> {issueDetails.assigned_to ? issueDetails.assigned_to.fullName || issueDetails.assigned_to : "Not Assigned"}
                        </Text>
                        <Text><strong>Created At:</strong> {issueDetails.created_at}</Text>
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default AcademicRegistrarDashboard;