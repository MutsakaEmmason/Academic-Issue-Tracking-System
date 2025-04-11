import React, { useState, useEffect } from "react";
import {
    Box,
    Text,
    Button,
    Select,
    Flex,
    useToast,
    Spinner,
    Heading,
    Divider,
    Badge
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

    // Function to get status badge color
    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return 'yellow';
            case 'assigned': return 'blue';
            case 'in_progress': return 'purple';
            case 'resolved': return 'green';
            default: return 'gray';
        }
    };

    return (
        <Flex direction="column" minHeight="100vh" bg="gray.100">
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
                boxShadow="0 2px 10px rgba(0,0,0,0.1)"
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
                <Box 
                    className={`sidebar ${isOpen ? "open" : ""}`}
                    bg="gray.800"
                    color="white"
                    boxShadow="2px 0 10px rgba(0,0,0,0.1)"
                >
                    <button className="toggle-btn" onClick={toggleSidebar}><FaBars /></button>
                    <Box className="assignment-section" p={4}>
                        <Heading as="h3" size="md" mb={4} color="white">Assign Issue</Heading>
                        <Divider mb={4} borderColor="gray.600" />
                        
                        <Box mb={4}>
                            {issues.length > 0 ? (
                                <Text fontSize="sm" color="gray.300">
                                    Showing {issues.length} pending issues
                                </Text>
                            ) : (
                                <Text fontSize="sm" color="green.300">
                                    No pending issues available
                                </Text>
                            )}
                        </Box>
                        
                        <Select 
                            placeholder="Select Issue" 
                            onChange={(e) => handleIssueSelect(e.target.value)}
                            value={selectedIssue ? selectedIssue.id : ""}
                            mb={4}
                            bg="gray.700"
                            color="white"
                            borderColor="gray.600"
                            _hover={{ borderColor: "gray.500" }}
                            _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px #48BB78" }}
                        >
                            {issues.map((issue) => (
                                <option key={issue.id} value={issue.id} style={{backgroundColor: "#2D3748", color: "white"}}>
                                    {issue.title || "Untitled Issue"}
                                </option>
                            ))}
                        </Select>
                        
                        <Box mb={4}>
                            {lecturers.length > 0 ? (
                                <Text fontSize="sm" color="gray.300">
                                    {lecturers.length} lecturers from {registrarCollege} college
                                </Text>
                            ) : (
                                <Text fontSize="sm" color="orange.300">
                                    No lecturers available in {registrarCollege} college
                                </Text>
                            )}
                        </Box>
                        
                        <Select 
                            placeholder="Select Lecturer" 
                            onChange={(e) => setSelectedLecturer(e.target.value)}
                            value={selectedLecturer}
                            mb={4}
                            bg="gray.700"
                            color="white"
                            borderColor="gray.600"
                            _hover={{ borderColor: "gray.500" }}
                            _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px #48BB78" }}
                        >
                            {lecturers.map((lecturer) => (
                                <option key={lecturer.id} value={lecturer.id} style={{backgroundColor: "#2D3748", color: "white"}}>
                                    {lecturer.first_name} {lecturer.last_name} ({lecturer.department || "No department"})
                                </option>
                            ))}
                        </Select>
                        
                        <Flex direction="column" gap={3}>
                            <Button 
                                colorScheme="green" 
                                onClick={assignIssue}
                                isDisabled={!selectedIssue || !selectedLecturer}
                                _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
                            >
                                Assign
                            </Button>
                            <Button 
                                colorScheme="blue" 
                                onClick={resolveIssue}
                                isDisabled={!selectedIssue}
                                _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
                            >
                                Resolve
                            </Button>
                        </Flex>
                    </Box>
                </Box>

                {/* Dynamic Content */}
                <Box
                    p={6}
                    flex="1"
                    ml={isOpen ? "250px" : "80px"}
                    background="gray.100"
                    minHeight="calc(100vh - 80px)"
                    transition="margin-left 0.3s"
                >
                    {isLoading && (
                        <Flex justify="center" align="center" minH="200px">
                            <Spinner size="xl" color="green.500" thickness="4px" />
                        </Flex>
                    )}
                    
                    {!isLoading && (
                        issueDetails ? (
                            <Box
                                bg="white"
                                p={6}
                                borderRadius="md"
                                boxShadow="md"
                                maxWidth="800px"
                                mx="auto"
                                border="1px solid"
                                borderColor="gray.200"
                            >
                                <Heading as="h2" size="lg" mb={4} color="green.600">Issue Details</Heading>
                                <Divider mb={4} />
                                
                                <Flex direction="column" gap={3}>
                                    <Flex>
                                        <Text fontWeight="bold" width="150px" color="gray.700">Student Name:</Text>
                                        <Text color="gray.800">{issueDetails.studentName || "N/A"}</Text>
                                    </Flex>
                                    
                                    <Flex>
                                        <Text fontWeight="bold" width="150px" color="gray.700">Title:</Text>
                                        <Text color="gray.800">{issueDetails.title || "Untitled Issue"}</Text>
                                    </Flex>
                                    
                                    <Flex alignItems="flex-start">
                                    <Text fontWeight="bold" width="150px" color="gray.700">Description:</Text>
                                        <Text color="gray.800">{issueDetails.description || "No description provided."}</Text>
                                    </Flex>
                                    
                                    <Flex>
                                        <Text fontWeight="bold" width="150px" color="gray.700">Status:</Text>
                                        <Badge colorScheme={getStatusColor(issueDetails.status)}>
                                            {issueDetails.status ? issueDetails.status.replace('_', ' ').toUpperCase() : "UNKNOWN"}
                                        </Badge>
                                    </Flex>
                                    
                                    <Flex>
                                        <Text fontWeight="bold" width="150px" color="gray.700">Course Code:</Text>
                                        <Text color="gray.800">{issueDetails.courseCode || "N/A"}</Text>
                                    </Flex>
                                    
                                    <Flex>
                                        <Text fontWeight="bold" width="150px" color="gray.700">Student ID:</Text>
                                        <Text color="gray.800">{issueDetails.studentId || "N/A"}</Text>
                                    </Flex>
                                    
                                    <Flex>
                                        <Text fontWeight="bold" width="150px" color="gray.700">Lecturer:</Text>
                                        <Text color="gray.800">{issueDetails.lecturer || "Not assigned"}</Text>
                                    </Flex>
                                    
                                    <Flex>
                                        <Text fontWeight="bold" width="150px" color="gray.700">Department:</Text>
                                        <Text color="gray.800">{issueDetails.department || "N/A"}</Text>
                                    </Flex>
                                    
                                    <Flex>
                                        <Text fontWeight="bold" width="150px" color="gray.700">Semester:</Text>
                                        <Text color="gray.800">{issueDetails.semester || "N/A"}</Text>
                                    </Flex>
                                    
                                    <Flex>
                                        <Text fontWeight="bold" width="150px" color="gray.700">Academic Year:</Text>
                                        <Text color="gray.800">{issueDetails.academicYear || "N/A"}</Text>
                                    </Flex>
                                </Flex>
                            </Box>
                        ) : (
                            <Flex 
                                justify="center" 
                                align="center" 
                                minH="200px" 
                                bg="white" 
                                borderRadius="md" 
                                boxShadow="sm"
                                p={6}
                                maxWidth="800px"
                                mx="auto"
                                border="1px dashed"
                                borderColor="gray.300"
                            >
                                <Text fontSize="lg" color="gray.600">
                                    {issues.length > 0 
                                        ? "Select an issue to view its details" 
                                        : "No pending issues available"}
                                </Text>
                            </Flex>
                        )
                    )}
                </Box>
            </Flex>
        </Flex>
    );
};

export default AcademicRegistrarDashboard;