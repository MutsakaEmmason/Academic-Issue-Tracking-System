import React, { useState, useEffect } from "react";
import {
    Box,
    Text,
    Button,
    Select,
    Flex,
    useToast,
    Spinner
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
    const [isLoading, setIsLoading] = useState(false);
    const [registrarCollege, setRegistrarCollege] = useState("");
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        // First fetch the registrar profile to get the college
        const fetchRegistrarProfile = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    toast({ title: "Please log in.", status: "error", duration: 5000, isClosable: true });
                    navigate('/login');
                    return null;
                }

                const profileResponse = await fetch("http://127.0.0.1:8000/api/registrar-profile/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!profileResponse.ok) {
                    toast({ title: "Failed to fetch profile.", status: "error", duration: 5000, isClosable: true });
                    navigate('/login');
                    return null;
                }

                const registrarData = await profileResponse.json();
                setRegistrarCollege(registrarData.college);
                return registrarData.college;
            } catch (error) {
                console.error("Error fetching registrar profile:", error);
                toast({ title: "Error fetching profile.", status: "error", duration: 5000, isClosable: true });
                return null;
            }
        };

        // Then fetch lecturers and issues based on the college
        const fetchData = async () => {
            setIsLoading(true);
            const college = await fetchRegistrarProfile();
            
            if (college) {
                // Fetch lecturers from the same college
                try {
                    const token = localStorage.getItem("accessToken");
                    const lecturersResponse = await fetch(`http://127.0.0.1:8000/api/users/?role=lecturer&college=${college}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (lecturersResponse.ok) {
                        const data = await lecturersResponse.json();
                        setLecturers(data);
                    } else {
                        toast({ title: "Error fetching lecturers.", status: "error", duration: 5000, isClosable: true });
                    }
                } catch (error) {
                    console.error("Error fetching lecturers:", error);
                    toast({ title: "Error fetching lecturers.", status: "error", duration: 5000, isClosable: true });
                }

                // Fetch issues from the same college
                try {
                    const token = localStorage.getItem("accessToken");
                    const issuesResponse = await fetch(`http://127.0.0.1:8000/api/issues/?college=${college}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (issuesResponse.ok) {
                        const data = await issuesResponse.json();
                        // Only show unresolved issues
                        const unresolvedIssues = data.filter(issue => issue.status !== 'resolved');
                        setIssues(unresolvedIssues);
                    } else {
                        toast({ title: "Error fetching issues.", status: "error", duration: 5000, isClosable: true });
                    }
                } catch (error) {
                    console.error("Error fetching issues:", error);
                    toast({ title: "Error fetching issues.", status: "error", duration: 5000, isClosable: true });
                }
            }
            
            setIsLoading(false);
        };

        fetchData();
    }, [navigate, toast]);

    const toggleSidebar = () => setIsOpen(!isOpen);

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
                const errorData = await response.json();
                toast({ 
                    title: "Failed to assign issue.", 
                    description: errorData.error || "Unknown error occurred",
                    status: "error", 
                    duration: 5000, 
                    isClosable: true 
                });
            }
        } catch (error) {
            console.error("Error assigning issue:", error);
            toast({ title: "Error assigning issue.", status: "error", duration: 5000, isClosable: true });
        }
    };

    const resolveIssue = async () => {
        if (!selectedIssue) {
            toast({ title: "Please select an issue to resolve.", status: "warning", duration: 5000, isClosable: true });
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`http://127.0.0.1:8000/api/resolve-issue/${selectedIssue.id}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    resolution_note: "Issue resolved by registrar" 
                }),
            });
            
            if (response.ok) {
                // Remove the resolved issue from the issues list
                setIssues(issues.filter(issue => issue.id !== selectedIssue.id));
                
                // Clear the selected issue and issue details if the resolved issue was selected
                setSelectedIssue(null);
                setIssueDetails(null);
                
                toast({ 
                    title: "Issue resolved successfully!", 
                    status: "success", 
                    duration: 5000, 
                    isClosable: true 
                });
            } else {
                const errorData = await response.json();
                toast({ 
                    title: "Failed to resolve issue.", 
                    description: errorData.error || "Unknown error occurred",
                    status: "error", 
                    duration: 5000, 
                    isClosable: true 
                });
            }
        } catch (error) {
            console.error("Error resolving issue:", error);
            toast({ title: "Error resolving issue.", status: "error", duration: 5000, isClosable: true });
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

            {/* Main Content */}
            <Flex mt="80px" flex="1">
                {/* Sidebar */}
                <Box className={`sidebar ${isOpen ? "open" : ""}`}>
                    <button className="toggle-btn" onClick={toggleSidebar}><FaBars /></button>
                    <div className="assignment-section">
                        <h3>Assign Issue</h3>
                        <Box mb={2}>
                            {issues.length > 0 ? (
                                <Text fontSize="sm" color="gray.600">
                                    Showing {issues.length} pending issues
                                </Text>
                            ) : (
                                <Text fontSize="sm" color="green.500">
                                    No pending issues available
                                </Text>
                            )}
                        </Box>
                        <Select 
                            placeholder="Select Issue" 
                            onChange={(e) => handleIssueSelect(e.target.value)}
                            value={selectedIssue ? selectedIssue.id : ""}
                        >
                            {issues.map((issue) => (
                                <option key={issue.id} value={issue.id}>{issue.title || "Untitled Issue"}</option>
                            ))}
                        </Select>
                        
                        <Box mt={2} mb={2}>
                            {lecturers.length > 0 ? (
                                <Text fontSize="sm" color="gray.600">
                                    {lecturers.length} lecturers from {registrarCollege} college
                                </Text>
                            ) : (
                                <Text fontSize="sm" color="orange.500">
                                    No lecturers available in {registrarCollege} college
                                </Text>
                            )}
                        </Box>
                        
                        <Select 
                            placeholder="Select Lecturer" 
                            onChange={(e) => setSelectedLecturer(e.target.value)}
                            value={selectedLecturer}
                        >
                            {lecturers.map((lecturer) => (
                                <option key={lecturer.id} value={lecturer.id}>
                                    {lecturer.first_name} {lecturer.last_name} ({lecturer.department || "No department"})
                                </option>
                            ))}
                        </Select>
                        <Button 
                            colorScheme="green" 
                            onClick={assignIssue} 
                            mt={2}
                            isDisabled={!selectedIssue || !selectedLecturer}
                        >
                            Assign
                        </Button>
                        <Button 
                            colorScheme="blue" 
                            onClick={resolveIssue} 
                            mt={2}
                            isDisabled={!selectedIssue}
                        >
                            Resolve
                        </Button>
                    </div>
                </Box>

                {/* Dynamic Content */}
                <Box
                    p={6}
                    flex="1"
                    ml={isOpen ? "250px" : "80px"}
                    background="gray.50"
                    minHeight="calc(100vh - 80px)"
                >
                    {isLoading && (
                        <Flex justify="center" align="center" minH="200px">
                            <Spinner size="xl" />
                        </Flex>
                    )}
                    {issueDetails ? (
                        <Box
                            bg="white"
                            p={6}
                            borderRadius="md"
                            boxShadow="md"
                            maxWidth="800px"
                            mx="auto"
                        >
                            <Text fontSize="2xl" fontWeight="bold" mb={4}>Issue Details</Text>
                            <Text mb={2}><strong>Student Name:</strong> {issueDetails.studentName || "N/A"}</Text>
                            <Text mb={2}><strong>Title:</strong> {issueDetails.title || "Untitled Issue"}</Text>
                            <Text mb={2}><strong>Description:</strong> {issueDetails.description || "No description provided."}</Text>
                            <Text mb={2}><strong>Status:</strong> {issueDetails.status}</Text>
                            <Text mb={2}><strong>Course Code:</strong> {issueDetails.courseCode}</Text>
                            <Text mb={2}><strong>Student ID:</strong> {issueDetails.studentId}</Text>
                            <Text mb={2}><strong>Lecturer:</strong> {issueDetails.lecturer}</Text>
                            <Text mb={2}><strong>Department:</strong> {issueDetails.department}</Text>
                            <Text mb={2}><strong>Semester:</strong> {issueDetails.semester}</Text>
                            <Text mb={2}><strong>Academic Year:</strong> {issueDetails.academicYear}</Text>
                        </Box>
                    ) : (
                        <Flex justify="center" align="center" minH="200px">
                            <Text fontSize="lg" color="gray.600">
                                {issues.length > 0 
                                    ? "Select an issue to view its details" 
                                    : "No pending issues available"}
                            </Text>
                        </Flex>
                    )}
                </Box>
            </Flex>
        </Flex>
    );
};

export default AcademicRegistrarDashboard;