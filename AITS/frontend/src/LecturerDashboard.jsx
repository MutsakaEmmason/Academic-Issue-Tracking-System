import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Heading, Text, List, ListItem, VStack, Textarea, Button, Select, Spinner, useToast } from "@chakra-ui/react";

const LecturerDashboard = () => {
    const location = useLocation();
    const fullName = location.state?.username || "Lecturer";
    const firstName = fullName.split(" ")[0];
    const toast = useToast(); // For notifications

    const [issues, setIssues] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [auditTrail, setAuditTrail] = useState([]); // Audit trail for issue actions
    const [notifications, setNotifications] = useState([]); // Dynamic notifications

    const courses = [
        "Introduction to Computer Science",
        "Programming in C",
        "Data Structures and Algorithms",
        "Database Systems",
        "Artificial Intelligence",
        "Web Programming and Technologies",
        "Cybersecurity",
        "Cloud Computing",
    ];

    // Simulate fetching issues and notifications from an API
    useEffect(() => {
        setTimeout(() => {
            setIssues([
                { id: 1, title: "Issue 1", status: "Pending", comments: [], course: "Introduction to Computer Science" },
                { id: 2, title: "Issue 2", status: "In Progress", comments: [], course: "Programming in C" },
                { id: 3, title: "Issue 3", status: "Resolved", comments: [], course: "Data Structures and Algorithms" },
            ]);
            setNotifications([
                "Meeting with the department head at 3 PM.",
                "Submit grades for Course 1 by Friday.",
                "New assignment submissions for Course 2.",
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    // Update issue status and log the action in the audit trail
    const handleStatusChange = (issueId, newStatus) => {
        const updatedIssues = issues.map(issue =>
            issue.id === issueId ? { ...issue, status: newStatus } : issue
        );
        setIssues(updatedIssues);

        // Log the status change in the audit trail
        const issue = issues.find(issue => issue.id === issueId);
        setAuditTrail([
            ...auditTrail,
            {
                action: `Status changed to ${newStatus}`,
                issue: issue.title,
                timestamp: new Date().toLocaleString(),
            },
        ]);

        // Send a notification
        toast({
            title: "Status Updated",
            description: `Issue "${issue.title}" status changed to ${newStatus}.`,
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    // Add a comment to an issue and log the action in the audit trail
    const handleAddComment = (issueId) => {
        if (!newComment.trim()) {
            toast({
                title: "Error",
                description: "Comment cannot be empty.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const updatedIssues = issues.map(issue =>
            issue.id === issueId ? { ...issue, comments: [...issue.comments, newComment] } : issue
        );
        setIssues(updatedIssues);
        setNewComment("");

        // Log the comment addition in the audit trail
        const issue = issues.find(issue => issue.id === issueId);
        setAuditTrail([
            ...auditTrail,
            {
                action: `Comment added: "${newComment}"`,
                issue: issue.title,
                timestamp: new Date().toLocaleString(),
            },
        ]);

        // Send a notification
        toast({
            title: "Comment Added",
            description: `A comment was added to issue "${issue.title}".`,
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };

    // Filter issues by selected course
    const filteredIssues = selectedCourse
        ? issues.filter(issue => issue.course === selectedCourse)
        : issues;

    return (
        <Box p={5} maxW="800px" mx="auto">
            <VStack spacing={4} align="start">
                <Heading as="h2" size="xl" color="purple.600">
                    Hi, {firstName}!
                </Heading>
                <Text fontSize="lg" color="green.600">
                    Welcome to your Lecturer Dashboard.
                </Text>

                {/* Courses Dropdown */}
                <Box mt={6} w="100%">
                    <Heading as="h3" size="lg" mb={4} color="purple.600">
                        Select a Course
                    </Heading>
                    <Select
                        placeholder="Select a course"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        bg="white"
                        borderColor="purple.300"
                        _hover={{ borderColor: "purple.500" }}
                        aria-label="Select a course"
                    >
                        {courses.map((course, index) => (
                            <option key={index} value={course}>
                                {course}
                            </option>
                        ))}
                    </Select>
                </Box>

                {/* Notifications Section */}
                <Box mt={6} w="100%">
                    <Heading as="h3" size="lg" mb={4} color="purple.600">
                        Notifications
                    </Heading>
                    <List spacing={3}>
                        {notifications.map((notification, index) => (
                            <ListItem key={index} p={3} bg="green.50" borderRadius="md" boxShadow="sm">
                                {notification}
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* Assigned Issues Section */}
                <Box mt={6} w="100%">
                    <Heading as="h3" size="lg" mb={4} color="purple.600">
                        Assigned Issues
                    </Heading>
                    {isLoading ? (
                        <Spinner size="lg" />
                    ) : (
                        <List spacing={3}>
                            {filteredIssues.map(issue => (
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
                                        aria-label="Update issue status"
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
                                        aria-label="Add a comment"
                                    />
                                    <Button
                                        mt={2}
                                        onClick={() => handleAddComment(issue.id)}
                                        bg="purple.500"
                                        color="white"
                                        _hover={{ bg: "purple.600" }}
                                        aria-label="Add comment"
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
                    )}
                </Box>

                {/* Audit Trail Section */}
                <Box mt={6} w="100%">
                    <Heading as="h3" size="lg" mb={4} color="purple.600">
                        Audit Trail
                    </Heading>
                    <List spacing={3}>
                        {auditTrail.map((action, index) => (
                            <ListItem key={index} p={3} bg="green.50" borderRadius="md" boxShadow="sm">
                                <Text fontWeight="bold">{action.issue}</Text>
                                <Text>{action.action}</Text>
                                <Text fontSize="sm" color="gray.600">{action.timestamp}</Text>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </VStack>
        </Box>
    );
};

export default LecturerDashboard;