import React, { useEffect, useState } from 'react';
import { Box, Button, Text, VStack, HStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const LecturerDashboard = () => {
    const [lecturer, setLecturer] = useState(null);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("No token found. Redirecting to login.");
            window.location.href = '/login';
            return;
        }

        const fetchLecturerDetails = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/lecturer/details/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 401 || response.status === 403) {
                    console.error("Unauthorized access. Redirecting to login.");
                    localStorage.removeItem('token');
                    window.location.href = '/home';
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setLecturer(data);
                fetchAssignedIssues(data.id);
            } catch (error) {
                console.error('Error fetching lecturer details:', error);
                setError('Failed to load lecturer details.');
            } finally {
                setLoading(false);
            }
        };

        const fetchAssignedIssues = async (lecturerId) => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/issues?assigned_to=${lecturerId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setIssues(data);
                } else {
                    console.error('Failed to fetch assigned issues', response.statusText);
                    setError('Failed to load assigned issues.');
                }
            } catch (error) {
                console.error('Error fetching assigned issues:', error);
            }
        };

        fetchLecturerDetails();
    }, []);

    const markIssueResolved = async (issueId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/issues/${issueId}/resolve`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setIssues(issues.map(issue => issue.id === issueId ? { ...issue, status: 'Resolved' } : issue));
                alert('Issue marked as resolved');
            } else {
                console.error('Failed to resolve issue', response.statusText);
            }
        } catch (error) {
            console.error('Error resolving issue:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleAboutUs = () => {
        navigate('/about');
    };

    if (loading) {
        return (
            <Box p={4} textAlign="center">
                <Spinner size="xl" />
                <Text>Loading lecturer details...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={4} textAlign="center">
                <Text color="red.500">{error}</Text>
            </Box>
        );
    }

    return (
        <Box minHeight="100vh" bg="gray.100" display="flex" flexDirection="column">
            {/* Header */}
            <Flex p={4} bg="green.500" color="white" justify="space-between" align="center" position="fixed" top="0" width="100%" zIndex="100">
                <Box>
                    <Heading size="lg">Lecturer Dashboard</Heading>
                </Box>
                <HStack spacing={4}>
                    <Button onClick={() => navigate('/about')} colorScheme="green" mr={2}>About Us</Button>
                    <Button onClick={handleLogout} colorScheme="red">Logout</Button>
                </HStack>
            </Flex>

            {/* Content */}
            <Box p={6} mt={20} borderRadius="md" boxShadow="lg" bg="white" width="100%" flex="1">
                <VStack spacing={6} align="stretch">
                    <Heading size="md" textAlign="center">Lecturer Details</Heading>
                    <Box width="100%">
                        <Text fontSize="xl"><strong>Full Name:</strong> {lecturer.fullName}</Text>
                        <Text fontSize="xl"><strong>Email:</strong> {lecturer.email}</Text>
                        <Text fontSize="xl">
                            <strong>Courses Taught:</strong>
                            {Array.isArray(lecturer.courses_taught)
                                ? lecturer.courses_taught.join(', ')
                                : (lecturer.courses_taught ? lecturer.courses_taught.split(', ').join(', ') : 'No courses assigned')
                            }
                        </Text>
                    </Box>

                    <Heading size="md">Assigned Issues</Heading>
                    {issues.length === 0 ? (
                        <Text>No assigned issues</Text>
                    ) : (
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Issue ID</Th>
                                    <Th>Type</Th>
                                    <Th>Status</Th>
                                    <Th>Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {issues.map(issue => (
                                    <Tr key={issue.id}>
                                        <Td>{issue.id}</Td>
                                        <Td>{issue.type}</Td>
                                        <Td>{issue.status}</Td>
                                        <Td>
                                            {issue.status !== 'Resolved' && (
                                                <Button colorScheme="green" size="sm" onClick={() => markIssueResolved(issue.id)}>
                                                    Mark Resolved
                                                </Button>
                                            )}
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    )}
                </VStack>
            </Box>
        </Box>
    );
};

export default LecturerDashboard;
