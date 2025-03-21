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
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setStudentData(data);
                    setFilteredIssues(data.issues);
                } else {
                    toast({
                        title: 'Failed to fetch profile.',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    navigate('/student/login'); // Corrected path
                }
            } catch (error) {
                toast({
                    title: 'An error occurred.',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/student/login'); // Corrected path
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate, toast]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/student/login'); // Corrected path
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/api/issues/?search=${searchTerm}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFilteredIssues(data);
            } else {
                toast({
                    title: 'Search failed.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'An error occurred during search.',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Flex p={4} bg="green" color="white" justify="space-between" align="center" width="100%">
                <Box>
                    <h1 style={{ fontSize: '2.5em' }}>STUDENT DASHBOARD</h1>
                </Box>
                <Flex align="center">
                    <p style={{ marginRight: '20px' }}>WELCOME, {studentData.fullName}</p>
                    <Button onClick={() => navigate('/issue-submission')} colorScheme="green" mr={2}>
                        Submit an Issue
                    </Button>
                    <Button onClick={() => navigate('/about')} colorScheme="green" mr={2}>
                        About Us
                    </Button>
                    <Button onClick={handleLogout} colorScheme="red">
                        Logout
                    </Button>
                </Flex>
            </Flex>
            <hr style={{ width: '80%' }} />
            <FormControl mt={4} style={{ width: '80%' }}>
                <FormLabel>Search by Issue Title</FormLabel>
                <Flex alignItems="center" gap={2}>
                    <Input
                        type="text"
                        placeholder="Enter issue title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: '1px solid green', width: '100%' }}
                    />
                    <Button onClick={handleSearch} colorScheme="green" isLoading={loading}>Search</Button>
                </Flex>
            </FormControl>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {filteredIssues.length === 0 && <p>No issues logged. Please submit an issue.</p>}
            </div>
            {filteredIssues.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', width: '80%' }}>
                    <Table variant="simple" mt={4} width="100%">
                        <Thead>
                            <Tr>
                                <Th>Title</Th>
                                <Th>Student Name</Th>
                                <Th>Student ID</Th>
                                <Th>Status</Th>
                                <Th>Category</Th>
                                <Th>Course Code</Th>
                                <Th>Priority</Th>
                                <Th>Lecturer</Th>
                                <Th>Department</Th>
                                <Th>Semester</Th>
                                <Th>Academic Year</Th>
                                <Th>Issue Date</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredIssues.map((issue) => (
                                <Tr key={issue.id}>
                                    <Td>{issue.title}</Td>
                                    <Td>{issue.studentName}</Td>
                                    <Td>{issue.studentId}</Td>
                                    <Td>{issue.status}</Td>
                                    <Td>{issue.category}</Td>
                                    <Td>{issue.courseCode}</Td>
                                    <Td>{issue.priority}</Td>
                                    <Td>{issue.lecturer}</Td>
                                    <Td>{issue.department}</Td>
                                    <Td>{issue.semester}</Td>
                                    <Td>{issue.academicYear}</Td>
                                    <Td>{issue.issueDate}</Td>
                                    <Td>
                                        <Button size="sm" onClick={() => handleViewDetails(issue.id)}>
                                            View Details
                                        </Button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;