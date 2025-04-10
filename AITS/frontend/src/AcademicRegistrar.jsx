import React, { useState, useEffect } from "react";
import {
    Box,
    Text,
    Button,
    Select,
    Flex,
    useToast,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

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
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    toast({ title: "Please log in.", status: "error", duration: 5000, isClosable: true });
                    navigate('/login');
                    return;
                }

                const profileResponse = await fetch("http://127.0.0.1:8000/api/registrar-profile/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!profileResponse.ok) {
                    toast({ title: "Failed to fetch profile.", status: "error", duration: 5000, isClosable: true });
                    navigate('/login');
                    return;
                }

                const registrarData = await profileResponse.json();
                const college = registrarData.college;

                const issuesResponse = await fetch(`http://127.0.0.1:8000/api/issues/?college=${college}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (issuesResponse.ok) {
                    const data = await issuesResponse.json();
                    setIssues(data);
                } else {
                    toast({ title: "Error fetching issues.", status: "error", duration: 5000, isClosable: true });
                }
            } catch (error) {
                console.error("Error fetching issues:", error);
                toast({ title: "Error fetching issues.", status: "error", duration: 5000, isClosable: true });
            }
        };

        fetchLecturers();
        fetchIssues();
    }, [navigate, toast]);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const handleMenuClick = (menu) => setActiveMenu(menu);

    const assignIssue = async () => {
        if (!selectedIssue || !selectedLecturer) {
            toast({ title: "Please select both issue and lecturer.", status: "warning", duration: 5000, isClosable: true });
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
                const updatedIssue = await response.json();
                setIssueDetails(updatedIssue);
                toast({ title: "Issue assigned successfully!", status: "success", duration: 5000, isClosable: true });
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

    return (
        <Flex direction="column" minHeight="100vh">
            {/* Header */}
            <Flex
                p={4}
                bg="green.600"
                color="white"
                justify="space-between"
                align="center"
                position="fixed"
                width="100%"
                top="0"
                zIndex="1000"
            >
                <Text fontSize="2xl" fontWeight="bold">ACADEMIC REGISTRAR DASHBOARD</Text>
                <Flex gap={3}>
                    <Button onClick={() => navigate('/about')} colorScheme="green" mr={2}>About Us</Button>
                    <Button colorScheme="red" onClick={() => {
                        localStorage.removeItem('accessToken');
                        navigate('/');
                    }}>
                        Logout
                    </Button>
                </Flex>
            </Flex>

            {/* Main Content Area */}
            <Flex mt="80px" flex="1">
                {/* Sidebar */}
                <Box className={`sidebar ${isOpen ? "open" : ""}`}>
                    <button className="toggle-btn" onClick={toggleSidebar}><FaBars /></button>

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
                                <option key={issue.id} value={issue.id}>{issue.title || "Untitled Issue"}</option>
                            ))}
                        </Select>

                        <Select placeholder="Select Lecturer" onChange={(e) => setSelectedLecturer(e.target.value)}>
                            {lecturers.map((lecturer) => (
                                <option key={lecturer.id} value={lecturer.id}>{lecturer.fullName}</option>
                            ))}
                        </Select>

                        <Button colorScheme="green" onClick={assignIssue} mt={2}>Assign</Button>
                    </div>
                </Box>

                {/* Dynamic Content */}
                <Box p={4} flex="1" ml={isOpen ? "250px" : "80px"}>
                    {activeMenu === "dashboard" && <div>Dashboard Content</div>}
                    {activeMenu === "issues" && <div>Manage Issues Content</div>}
                    {activeMenu === "reports" && <div>Reports Content</div>}
                    {activeMenu === "settings" && <div>Settings Content</div>}

                    {issueDetails && (
                        <Box mt={4} p={4} borderWidth="1px" borderRadius="lg">
                            <Text fontSize="xl" mb={2}>Issue Details</Text>
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
                            <Text><strong>Assigned To:</strong> {issueDetails.assigned_to?.fullName || "Not Assigned"}</Text>
                            <Text><strong>Created At:</strong> {issueDetails.created_at}</Text>
                        </Box>
                    )}
                </Box>
            </Flex>

        </Flex>
    );
};

export default AcademicRegistrarDashboard;
