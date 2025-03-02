import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Heading, Text, List, ListItem, VStack } from "@chakra-ui/react";

const LecturerDashboard = () => {
    const location = useLocation();
    const { username } = location.state || { username: "Lecturer" }; // Default fallback

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
            </VStack>
        </Box>
    );
};

export default LecturerDashboard;