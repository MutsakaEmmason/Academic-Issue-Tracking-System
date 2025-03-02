import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Heading, Text, List, ListItem, VStack, Textarea, Button, Select } from "@chakra-ui/react";

const LecturerDashboard = () => {
    const location = useLocation();
    const { username } = location.state || { username: "Lecturer" }; // Default fallback
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
                <Heading as="h2" size="xl" color="teal.500">
                    Hi, {username}!
                </Heading>
                <Text fontSize="lg" color="gray.600">
                    Welcome to your Lecturer Dashboard.
                </Text>

                <Box mt={6} w="100%">
                    <Heading as="h3" size="lg" mb={4} color="teal.500">
                        Your Courses
                    </Heading>
                    <List spacing={3}>
                        <ListItem p={3} bg="gray.50" borderRadius="md" boxShadow="sm">
                            Course 1: Introduction to Programming
                        </ListItem>
                        <ListItem p={3} bg="gray.50" borderRadius="md" boxShadow="sm">
                            Course 2: Data Structures
                        </ListItem>
                        <ListItem p={3} bg="gray.50" borderRadius="md" boxShadow="sm">
                            Course 3: Algorithms
                        </ListItem>
                    </List>
                </Box>

                <Box mt={6} w="100%">
                    <Heading as="h3" size="lg" mb={4} color="teal.500">
                        Notifications
                    </Heading>
                    <List spacing={3}>
                        <ListItem p={3} bg="yellow.50" borderRadius="md" boxShadow="sm">
                            Notification 1: Meeting with the department head at 3 PM.
                        </ListItem>
                        <ListItem p={3} bg="yellow.50" borderRadius="md" boxShadow="sm">
                            Notification 2: Submit grades for Course 1 by Friday.
                        </ListItem>
                        <ListItem p={3} bg="yellow.50" borderRadius="md" boxShadow="sm">
                            Notification 3: New assignment submissions for Course 2.
                        </ListItem>
                    </List>
                </Box>

                <Box mt={6} w="100%">
                    <Heading as="h3" size="lg" mb={4} color="teal.500">
                        Assigned Issues
                    </Heading>
                    <List spacing={3}>
                        {issues.map(issue => (
                            <ListItem key={issue.id} p={3} bg="gray.50" borderRadius="md" boxShadow="sm">
                                <Text fontWeight="bold">{issue.title}</Text>
                                <Text>Status: {issue.status}</Text>
                                <Select mt={2} onChange={(e) => handleStatusChange(issue.id, e.target.value)} value={issue.status}>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                </Select>
                                <Textarea
                                    mt={2}
                                    placeholder="Add a comment"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <Button mt={2} onClick={() => handleAddComment(issue.id)}>Add Comment</Button>
                                <List mt={2} spacing={1}>
                                    {issue.comments.map((comment, index) => (
                                        <ListItem key={index} p={2} bg="gray.100" borderRadius="md">
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