import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Flex,
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useToast,
    Spinner,
} from '@chakra-ui/react';
import Footer from '../components/Footer';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://127.0.0.1:8000/api/student-profile/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setStudentData(data);
                    setFilteredIssues(data.issues);
                } else {
                    toast({ title: 'Failed to fetch profile.', status: 'error', duration: 5000, isClosable: true });
                    navigate('/student/login');
                }
            } catch (error) {
                toast({ title: 'An error occurred.', description: error.message, status: 'error', duration: 5000, isClosable: true });
                navigate('/student/login');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate, toast]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/student/login');
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/api/issues/?category=${searchTerm}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setFilteredIssues(data);
            } else {
                toast({ title: 'Search failed.', status: 'error', duration: 5000, isClosable: true });
            }
        } catch (error) {
            toast({ title: 'An error occurred during search.', description: error.message, status: 'error', duration: 5000, isClosable: true });
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (issueId) => {
        navigate(`/issue/${issueId}`);
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" height="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (!studentData) {
        return <p>No student data available.</p>;
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Flex  p={4}
                bg="green.500"
                color="white"
                justify="space-between"
                align="center"
                width="100%"
                position="fixed" // Make header fixed
                top="0" // Stick to the top
                zIndex="100" // Ensure it's above other content
            >
           
            
            
            
                <Box>
                    <h1 style={{ fontSize: '2.5em' }}>STUDENT DASHBOARD</h1>
                </Box>
                <Flex align="center">
                    <p style={{ marginRight: '20px' }}>WELCOME, {studentData.fullName}</p>
                    <Button onClick={() => navigate('/issue-submission', { state: { studentName: studentData.fullName } })} colorScheme="green" mr={2}>Submit Issue</Button>
                    <Button
                    onClick={() => navigate('/about')} // Navigate on click
                    colorScheme="green"
                    mr={2}
                    >
                    About Us
                    </Button>
                    <Button onClick={handleLogout} colorScheme="red">Logout</Button>
                </Flex>
            </Flex>
            <hr style={{ width: '80%' }} />
            <FormControl mt={4} width="80%">
                <FormLabel>Search by Category</FormLabel>
                <Flex alignItems="center" gap={2}>
                    <Input type="text" placeholder="Enter issue category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} border="1px solid green" width="100%" />
                    <Button onClick={handleSearch} colorScheme="green" isLoading={loading}>Search</Button>
                </Flex>
            </FormControl>
            <Box width="100%" overflowX="auto" mt={4}>
                <Table variant="simple" size="sm">
                    <Thead>
                        <Tr>
                            <Th minWidth="150px">Title</Th>
                            <Th minWidth="150px">Student Name</Th>
                            <Th minWidth="100px">Student ID</Th>
                            <Th minWidth="100px">Status</Th>
                            <Th minWidth="150px">Category</Th>
                            <Th minWidth="120px">Course Code</Th>
                            <Th minWidth="100px">Priority</Th>
                            <Th minWidth="150px">Lecturer</Th>
                            <Th minWidth="150px">Department</Th>
                            <Th minWidth="100px">Semester</Th>
                            <Th minWidth="150px">Academic Year</Th>
                            <Th minWidth="150px">Issue Date</Th>
                            <Th minWidth="100px">Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredIssues.map((issue) => (
                            <Tr key={issue.id}>
                                <Td whiteSpace="nowrap" fontSize="sm" p={1}>{issue.title}</Td>
                                <Td whiteSpace="nowrap" fontSize="sm" p={1}>{issue.studentName}</Td>
                                <Td whiteSpace="nowrap" fontSize="sm" p={1}>{issue.studentId}</Td>
                                <Td whiteSpace="nowrap" fontSize="sm" p={1}>{issue.status}</Td>
                                <Td whiteSpace="nowrap" fontSize="sm" p={1}>{issue.category}</Td>
                                <Td whiteSpace="nowrap" fontSize="sm" p={1}>{issue.courseCode}</Td>
                                <Td whiteSpace="nowrap" fontSize="sm" p={1}>{issue.priority}</Td>
                                <Td whiteSpace="nowrap" fontSize="sm" p={1}>{issue.lecturer}</Td>
                                <Td whiteSpace="nowrap" fontSize="sm" p={1}>{issue.department}</Td>
                                <Td whiteSpace="nowrap" fontSize="sm" p={1}>{issue.semester}</Td>
                                <Td whiteSpace="nowrap" fontSize="sm" p={1}>{issue.academicYear}</Td>
                                <Td whiteSpace="nowrap" fontSize="sm" p={1}>{issue.issueDate}</Td>
                                <Td>
                                    <Button size="sm" onClick={() => handleViewDetails(issue.id)}>View</Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
            <Footer userRole="student" />
        </Box>
    );
};

export default StudentDashboard;
