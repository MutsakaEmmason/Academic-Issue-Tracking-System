import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Heading, Text, List, ListItem, VStack, Textarea, Button, Select } from "@chakra-ui/react";

const LecturerDashboard = () => {
    const location = useLocation();
    // Extract the first name from the username
    const fullName = location.state?.username || "Lecturer"; // Default fallback
    const firstName = fullName.split(" ")[0]; // Split by space and take the first part

    const [issues, setIssues] = useState([
        { id: 1, title: "Issue 1", status: "Pending", comments: [] },
        { id: 2, title: "Issue 2", status: "In Progress", comments: [] },
        { id: 3, title: "Issue 3", status: "Resolved", comments: [] },
    ]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [newComment, setNewComment] = useState("");

    const handleStatusChange = (issueId, newStatus) => {
        setIssues(issues.map(issue => issue.id === issueId ? { ...issue, status: newStatus } : issue));
    };

    const handleAddComment = (issueId) => {
        setIssues(issues.map(issue => issue.id === issueId ? { ...issue, comments: [...issue.comments, newComment] } : issue));
        setNewComment("");
    };

    return (
        <Box p={5} maxW="800px" mx="auto">
            <VStack spacing={4} align="start">
                {/* Purple-Greenish Heading */}
                <Heading as="h2" size="xl" color="purple.600">
                    Hi, {firstName}!
                </Heading>
                <Text fontSize="lg" color="green.600">
                    Welcome to your Lecturer Dashboard.
                </Text>

                {/* Courses Section */}
                <Box mt={6} w="100%">
                    <Heading as="h3" size="lg" mb={4} color="purple.600">
                        Your Courses
                    </Heading>
                    <List spacing={3}>
                        <ListItem p={3} bg="purple.50" borderRadius="md" boxShadow="sm">
                            Course 1: Introduction to Programming
                        </ListItem>
                        <ListItem p={3} bg="purple.50" borderRadius="md" boxShadow="sm">
                            Course 2: Data Structures
                        </ListItem>
                        <ListItem p={3} bg="purple.50" borderRadius="md" boxShadow="sm">
                            Course 3: Algorithms
                        </ListItem>
                    </List>
                </Box>

                {/* Notifications Section */}
                <Box mt={6} w="100%">
                    <Heading as="h3" size="lg" mb={4} color="purple.600">
                        Notifications
                    </Heading>
                    <List spacing={3}>
                        <ListItem p={3} bg="green.50" borderRadius="md" boxShadow="sm">
                            Notification 1: Meeting with the department head at 3 PM.
                        </ListItem>
                        <ListItem p={3} bg="green.50" borderRadius="md" boxShadow="sm">
                            Notification 2: Submit grades for Course 1 by Friday.
                        </ListItem>
                        <ListItem p={3} bg="green.50" borderRadius="md" boxShadow="sm">
                            Notification 3: New assignment submissions for Course 2.
                        </ListItem>
                    </List>
                </Box>

                {/* Assigned Issues Section */}
                <Box mt={6} w="100%">
                    <Heading as="h3" size="lg" mb={4} color="purple.600">
                        Assigned Issues
                    </Heading>
                    <List spacing={3}>
                        {issues.map(issue => (
                            <ListItem key={issue.id} p={3} bg="purple.50" borderRadius="md" boxShadow="sm">
                                <Text fontWeight="bold" color="purple.800">{issue.title}</Text>
                                <Text color="green.800">Status: {issue.status}</Text>
                                <Select
                                    mt={2}
                                    onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                                    value={issue.status}
                                    bg="white"
                                    borderColor="purple.300"
                                    _hover={{ borderColor: "purple.500" }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                </Select>
                                <Textarea
                                    mt={2}
                                    placeholder="Add a comment"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    bg="white"
                                    borderColor="purple.300"
                                    _hover={{ borderColor: "purple.500" }}
                                />
                                <Button
                                    mt={2}
                                    onClick={() => handleAddComment(issue.id)}
                                    bg="purple.500"
                                    color="white"
                                    _hover={{ bg: "purple.600" }}
                                >
                                    Add Comment
                                </Button>
                                <List mt={2} spacing={1}>
                                    {issue.comments.map((comment, index) => (
                                        <ListItem key={index} p={2} bg="green.50" borderRadius="md">
                                            {comment}
                                        </ListItem>
                                    ))}
                                </List>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </VStack>
        </Box>
    );
};

export default LecturerDashboard;