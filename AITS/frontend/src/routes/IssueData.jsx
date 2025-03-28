import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Text, Button, Spinner, Heading, VStack, useToast, HStack } from '@chakra-ui/react';
import Footer from '../components/Footer';

const IssueData = () => {
    const { issueId } = useParams();
    const navigate = useNavigate();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchIssueDetails = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://127.0.0.1:8000/api/issues/${issueId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setIssue(data);
                } else {
                    toast({
                        title: 'Failed to fetch issue details.',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    navigate('/student-dashboard');
                }
            } catch (error) {
                toast({
                    title: 'An error occurred.',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/student-dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchIssueDetails();
    }, [issueId, navigate, toast]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (!issue) {
        return (
            <Box minHeight="100vh" bg="green.500" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Text textAlign="center" color="white">Issue not found.</Text>
                <Footer userRole="student" />
            </Box>
        );
    }

    return (
        <Box minHeight="100vh" bg="green.500" display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={4}>
            <Box 
                width="90%" 
                minWidth="800px"
                p={8} 
                borderWidth="1px" 
                borderRadius="lg" 
                shadow="md" 
                bg="rgba(255, 255, 255, 0.9)"
            >
                <Heading size="lg" mb={6} textAlign="center">{issue.title}</Heading>
                <VStack align="start" spacing={4}>
                    <Text><strong>Student Name:</strong> {issue.studentName}</Text>
                    <Text><strong>Student ID:</strong> {issue.studentId}</Text>
                    <Text><strong>Status:</strong> {issue.status}</Text>
                    <Text><strong>Category:</strong> {issue.category}</Text>
                    <Text><strong>Course Code:</strong> {issue.courseCode}</Text>
                    <Text><strong>Priority:</strong> {issue.priority}</Text>
                    <Text><strong>Lecturer:</strong> {issue.lecturer}</Text>
                    <Text><strong>Department:</strong> {issue.department}</Text>
                    <Text><strong>Semester:</strong> {issue.semester}</Text>
                    <Text><strong>Academic Year:</strong> {issue.academicYear}</Text>
                    <Text><strong>Issue Date:</strong> {issue.issueDate}</Text>
                    <Text><strong>Description:</strong> {issue.description}</Text>
                </VStack>

                {/* Buttons Container - Left Aligned */}
                <HStack mt={6} spacing={4}>
                    <Button colorScheme="green" onClick={() => navigate('/student-dashboard')}>
                        Back to Dashboard
                    </Button>
                    <Button colorScheme="blue" onClick={() => navigate('/issue-submission')}>
                        Submit Another Issue
                    </Button>
                </HStack>
            </Box>
            
            <Footer userRole="student" />
        </Box>
    );
};

export default IssueData;
