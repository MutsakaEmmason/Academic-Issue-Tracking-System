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
import AboutUs from '../components/AboutUs';
const BASE_URL = 'https://academic-issue-tracking-system-gbch.onrender.com';

const StudentDashboard = ({ studentData, loading }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredIssues, setFilteredIssues] = useState([]);
    const toast = useToast();

    useEffect(() => {
        if (studentData?.issues) {
            setFilteredIssues(studentData.issues);
        }
    }, [studentData]);

    const handleSearch = async () => {
        setLoading(true);
       try {
            // --- FIX HERE: Use 'access_token' consistently ---
            const token = localStorage.getItem('access_token');
            const userRole = localStorage.getItem('user_role'); // Also get the role

            // --- IMPORTANT: Validate token and role before making the API call ---
            if (!token || userRole !== 'student') {
                toast({ title: 'Session expired or unauthorized. Please log in again.', status: 'error', duration: 5000, isClosable: true });
                handleLogout(); // Use the passed handleLogout to clear storage and redirect
                return; // Stop execution
            }

            const response = await fetch(`${BASE_URL}/api/issues/?category=${searchTerm}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setFilteredIssues(data);
            } else {
                // --- Handle specific authentication errors during search ---
                if (response.status === 401 || response.status === 403) {
                    toast({ title: 'Session expired or unauthorized. Please log in again.', status: 'error', duration: 5000, isClosable: true });
                    handleLogout(); // Force logout on auth errors
                } else {
                    toast({ title: 'Search failed.', description: `Status: ${response.status} ${response.statusText}`, status: 'error', duration: 5000, isClosable: true });
                }
            }
        } catch (error) {
            toast({ title: 'An error occurred during search.', description: error.message, status: 'error', duration: 5000, isClosable: true });
        } finally {
            // If you had a local `isSearching` state, you'd set it to false here.
            // Since `loading` is a prop, we don't set it here unless DashboardContainer manages it.
            // For now, removing `setLoading(false)` here, assuming `loading` is for initial data.
        }
    };
    const handleViewDetails = (issueId) => {
        navigate(`/issue/${issueId}`);
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" height="100vh" bg="gray.50">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (!studentData) {
        return <p>No student data available.</p>;
    }

    return (
        <Flex direction="column" minHeight="100vh" bg="gray.50">
            {/* HEADER */}
            <Flex
                p={4}
                bg="green.600"
                color="white"
                justify="space-between"
                align="center"
                width="100%"
                position="fixed"
                top="0"
                zIndex="100"
                shadow="md"
            >
                <Box>
                    <h1 style={{ fontSize: '2.2em', fontWeight: 'bold' }}>Student Dashboard</h1>
                </Box>
                <Flex align="center" gap={3}>
                    <Box fontWeight="medium">Welcome, {studentData.fullName}</Box>
                    <Button
                        onClick={() =>
                            navigate('/issue-submission', { state: { studentName: studentData.fullName } })
                        }
                        colorScheme="whiteAlpha"
                        variant="outline"
                    >
                        Submit Issue
                    </Button>
                    <Button onClick={() => navigate('/about')} colorScheme="whiteAlpha" variant="outline">
                        About Us
                    </Button>
                    <Button onClick={handleLogout} colorScheme="red" variant="solid">
                        Logout
                    </Button>
                </Flex>
            </Flex>

            {/* SEARCH BAR */}
            <Flex mt={24} justify="center" px={4}>
                <Box
                    width="100%"
                    maxWidth="1000px"
                    bg="white"
                    p={6}
                    rounded="xl"
                    shadow="md"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    <FormControl>
                        <FormLabel fontWeight="bold" fontSize="md">Search by Category</FormLabel>
                        <Flex alignItems="center" gap={3}>
                            <Input
                                type="text"
                                placeholder="Enter issue category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                borderColor="green.400"
                                focusBorderColor="green.600"
                            />
                            <Button onClick={handleSearch} colorScheme="green" isLoading={loading}>
                                Search
                            </Button>
                        </Flex>
                    </FormControl>
                </Box>
            </Flex>

            {/* TABLE */}
            <Box px={4} py={6} width="100%" flexGrow={1} display="flex" justifyContent="center">
                <Box width="100%" maxWidth="1000px" bg="white" p={6} rounded="xl" shadow="md" overflowX="auto">
                    {filteredIssues.length > 0 ? (
                        <Table variant="striped" colorScheme="green" size="sm">
                            <Thead bg="green.100">
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
                                    <Tr
                                        key={issue.id}
                                        _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                                        transition="0.2s"
                                    >
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
                                            <Button size="xs" colorScheme="blue" onClick={() => handleViewDetails(issue.id)}>
                                                View
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    ) : (
                        <Box textAlign="center" py={4} color="gray.600">
                            No issue submitted. Please submit an issue.
                        </Box>
                    )}
                </Box>
            </Box>

            <Footer userRole="student" />
        </Flex>
    );
};

export default StudentDashboard;
