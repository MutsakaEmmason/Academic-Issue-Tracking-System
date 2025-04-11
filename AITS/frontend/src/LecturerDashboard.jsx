import React, { useEffect, useState } from 'react';
import { 
  Box, Button, Text, VStack, HStack, Heading, 
  Table, Thead, Tbody, Tr, Th, Td, Spinner, 
  Flex, useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Footer from './components/Footer.jsx';

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
            navigate('/lecturer/login');
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
                    localStorage.removeItem('token');
                    navigate('/lecturer/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setLecturer(data);
                fetchAssignedIssues(data.id);
            } catch (error) {
                setError('Failed to load lecturer details.');
                console.error('Error:', error);
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
                }
            } catch (error) {
                console.error('Error fetching issues:', error);
            }
        };

        fetchLecturerDetails();
    }, [navigate]);

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
                setIssues(issues.map(issue => 
                    issue.id === issueId ? { ...issue, status: 'Resolved' } : issue
                ));
                toast({
                    title: 'Issue resolved',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error resolving issue:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/lecturer/login');
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
                <Text color="red.500">{error}</Text>
            </Box>
        );
    }

    return (
        <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
            {/* Header with green background */}
            <Box bg="green.500" boxShadow="sm" p={4} position="sticky" top="0" zIndex="sticky">
                <Flex justify="space-between" align="center" maxW="6xl" mx="auto">
                    <Heading size="lg" color="white">Lecturer Dashboard</Heading>
                    <HStack spacing={4}>
                        <Button 
                            colorScheme="whiteAlpha"
                            variant="outline"
                            onClick={() => navigate('/about')}
                        >
                            About Us
                        </Button>
                        <Button 
                            colorScheme="whiteAlpha"
                            variant="outline"
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
                                <strong>Courses:</strong> {lecturer?.courses_taught?.join(', ') || 'None assigned'}
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
                                                <Td>{issue.type}</Td>
                                                <Td>{issue.description}</Td>
                                                <Td>{issue.status}</Td>
                                                <Td>
                                                    {issue.status !== 'Resolved' && (
                                                        <Button
                                                            size="sm"
                                                            colorScheme="green"
                                                            onClick={() => markIssueResolved(issue.id)}
                                                        >
                                                            Resolve
                                                        </Button>
                                                    )}
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        ) : (
                            <Text>No issues assigned </Text>
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