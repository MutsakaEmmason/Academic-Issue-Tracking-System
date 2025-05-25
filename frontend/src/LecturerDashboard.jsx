import React, { useEffect, useState } from 'react';
import {
  Box, Button, Text, VStack, HStack, Heading,
  Table, Thead, Tbody, Tr, Th, Td, Spinner,
  Flex, useToast, Alert, AlertIcon // Import Alert and AlertIcon for better error display
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Footer from './components/Footer.jsx';

const BASE_URL = 'https://academic-issue-tracking-system-ba1p.onrender.com';

const LecturerDashboard = () => {
    const [lecturer, setLecturer] = useState(null);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/lecturer-login');
            return;
        }

        const fetchLecturerDetails = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/lecturer/details/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/lecturer-login');
                    toast({
                        title: 'Session expired or unauthorized.',
                        description: 'Please log in again.',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setLecturer(data);
                // Call fetchAssignedIssues with the lecturer's ID and filter by status
                fetchAssignedIssues(data.id, 'assigned'); // Fetch only 'assigned' issues initially
            } catch (error) {
                setError('Failed to load lecturer details.');
                console.error('Error fetching lecturer details:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load lecturer details. Please try again.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        const fetchAssignedIssues = async (lecturerId, statusFilter = '') => {
            let url = `${BASE_URL}/api/issues/?assigned_to=${lecturerId}`;
            if (statusFilter) {
                url += `&status=${statusFilter}`; // Add status filter
            }

            try {
                const response = await fetch(url, {
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
                    const errorData = await response.json();
                    console.error('Error fetching issues:', errorData);
                    toast({
                        title: 'Error fetching issues',
                        description: errorData.detail || 'Failed to load assigned issues.',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                console.error('Network error fetching issues:', error);
                toast({
                    title: 'Network Error',
                    description: 'Could not connect to the server to fetch issues.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchLecturerDetails();
    }, [navigate, toast]); // Add toast to dependency array

    const markIssueResolved = async (issueId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast({
                title: 'Authentication Error',
                description: 'Please log in to resolve issues.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            navigate('/lecturer-login');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/resolve-issue/${issueId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                // Optionally send a resolution note if you want to capture it
                 body: JSON.stringify({ resolution_note: "Resolved by lecturer dashboard." }),
            });

            if (response.ok) {
                // Update the issue status to 'resolved' (lowercase 'r')
                setIssues(prevIssues =>
                    prevIssues.map(issue =>
                        issue.id === issueId ? { ...issue, status: 'resolved' } : issue
                    ).filter(issue => issue.status === 'assigned') // Optionally, filter out resolved issues immediately
                );
                toast({
                    title: 'Issue resolved',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                const errorData = await response.json();
                console.error('Error resolving issue:', errorData);
                toast({
                    title: 'Error resolving issue',
                    description: errorData.detail || 'Failed to resolve issue. Please check permissions.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                if (response.status === 403) {
                     // If 403, means not assigned or not lecturer. Could refresh data to be safe.
                     // Re-fetch assigned issues to ensure the list is accurate.
                     fetchAssignedIssues(lecturer?.id, 'assigned');
                }
            }
        } catch (error) {
            console.error('Network error resolving issue:', error);
            toast({
                title: 'Network Error',
                description: 'Could not connect to the server to resolve the issue.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/lecturer-login');
        toast({
            title: 'Logged out',
            description: 'You have been successfully logged out.',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
    };

    if (loading) {
        return (
            <Box minH="100vh" display="flex" justifyContent="center" alignItems="center">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box minH="100vh" display="flex" justifyContent="center" alignItems="center">
                <Alert status="error" width="fit-content">
                    <AlertIcon />
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
            {/* Header with green background */}
            <Box bg="green.500" boxShadow="sm" p={4} position="sticky" top="0" zIndex="sticky">
                <Flex justify="space-between" align="center" maxW="6xl" mx="auto">
                    <VStack align="start" spacing={0}>
                        <Heading size="lg" color="white">Lecturer Dashboard</Heading>
                        <Text color="white" fontSize="md">
                            Welcome, {lecturer?.fullName || 'Lecturer'}
                        </Text>
                    </VStack>
                    <HStack spacing={4}>
                        <Button
                            colorScheme="purple"
                            variant="solid"
                            onClick={() => navigate('/about')}
                        >
                            About Us
                        </Button>
                        <Button
                            colorScheme="purple"
                            variant="solid"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </HStack>
                </Flex>
            </Box>

            {/* Main Content */}
            <Box flex="1" p={6} maxW="6xl" mx="auto" width="100%">
                <VStack spacing={8} align="stretch">
                    {/* Lecturer Info Card */}
                    <Box bg="white" borderRadius="lg" boxShadow="md" p={6}>
                        <Heading size="md" mb={4} color="green.600">Your Profile</Heading>
                        <VStack spacing={4} align="stretch">
                            <Text><strong>Name:</strong> {lecturer?.fullName}</Text>
                            <Text><strong>Email:</strong> {lecturer?.email}</Text>
                            <Text>
                                <strong>courses_taught:</strong> {lecturer?.courses_taught?.join(', ') || 'None assigned'}
                            </Text>
                        </VStack>
                    </Box>

                    {/* Issues Section */}
                    <Box bg="white" borderRadius="lg" boxShadow="md" p={6}>
                        <Heading size="md" mb={4} color="green.600">Assigned Issues</Heading>
                        {issues.length > 0 ? (
                            <Box overflowX="auto">
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>ID</Th>
                                            <Th>Type</Th>
                                            <Th>Description</Th>
                                            <Th>Status</Th>
                                            <Th>Action</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {issues.map(issue => (
                                            <Tr key={issue.id}>
                                                <Td>{issue.id}</Td>
                                                <Td>{issue.issue_type || issue.type}</Td> {/* Use issue_type from serializer or type */}
                                                <Td>{issue.description}</Td>
                                                <Td>{issue.status}</Td>
                                                <Td>
                                                    {issue.status !== 'resolved' ? ( // Check for lowercase 'resolved'
                                                        <Button
                                                            size="sm"
                                                            colorScheme="green"
                                                            onClick={() => markIssueResolved(issue.id)}
                                                        >
                                                            Resolve
                                                        </Button>
                                                    ) : (
                                                        <Text color="gray.500">Resolved</Text> // Display "Resolved" if already resolved
                                                    )}
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        ) : (
                            <Text>No issues assigned</Text>
                        )}
                    </Box>
                </VStack>
            </Box>

            {/* Footer */}
            <Footer userRole="lecturer" />
        </Box>
    );
};

export default LecturerDashboard;
