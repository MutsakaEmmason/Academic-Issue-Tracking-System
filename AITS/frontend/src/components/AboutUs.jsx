import React from "react";
import { Box, Heading, Text, VStack, Divider } from "@chakra-ui/react";

const AboutUs = () => {
    return (
        <Box p={8} maxW="800px" mx="auto">
            <Heading as="h1" size="xl" textAlign="center" mb={4} color="green">
                About Academic Issue Tracking System (AITS)
            </Heading>
            <Divider mb={4} />
            <VStack spacing={4} align="start">
                <Text fontSize="lg">
                    The Academic Issue Tracking System (AITS) is a platform designed to streamline the process of reporting and resolving academic-related issues for students. 
                    Whether it is missing marks, appeals, or corrections, AITS ensures that students can easily log their concerns and track the resolution progress.
                </Text>
                <Heading as="h2" size="md"color='blue'>Our Mission</Heading>
                <Text>
                    Our mission is to provide a seamless and transparent way for students to report academic issues and for administrators to manage and resolve them efficiently. 
                    We aim to bridge the communication gap between students and faculty members.
                </Text>
                <Heading as="h2" size="md" color='blue'>Key Features</Heading>
                <Text>
                    Issue Submission: Students can submit various academic issues, including missing marks, course registration problems, and grade appeals.
                    Tracking System: A real-time dashboard allows students to track the status of their reported issues.
                    Secure & Efficient:Ensuring data security and a streamlined resolution process through an organized workflow.
                </Text>
                <Heading as="h2" size="md"color='blue'>Why Choose AITS?</Heading>
                <Text>
                    AITS is built with student needs in mind, providing a user-friendly interface and efficient resolution tracking. 
                    By using modern technology such as React for the frontend and Django for the backend, we ensure a responsive and reliable system.
                </Text>
                <Heading as="h2" size="md"color='blue'>Contact Us</Heading>
                <Text>
                    If you have any questions or need assistance, feel free to reach out to our support team at **support@aits.edu**.
                </Text>
            </VStack>
        </Box>
    );
};

export default AboutUs;
