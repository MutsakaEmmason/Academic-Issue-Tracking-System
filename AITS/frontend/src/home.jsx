// src/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { VStack, Button, Heading, Text, Box } from "@chakra-ui/react";

const HomePage = () => {
  const navigate = useNavigate();

  const handleStudentLogin = () => {
    navigate("/student/login");
  };

  const handleLecturerLogin = () => {
    navigate("/lecturer/login");
  };

  const handleAdminLogin = () => {
    navigate("/admin/login");
  };

  const handleRegistrarLogin = () => {
    navigate("/registrar/login");
  };

  return (
    <VStack spacing={8} p={8} align="center" justify="center" height="100vh">
      <Heading size="2xl">Welcome to AITS</Heading>
      <Text fontSize="lg" textAlign="center">
        Please select your role to proceed.
      </Text>
      <VStack spacing={4}> {/* Changed Box to VStack for vertical arrangement */}
        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleStudentLogin}
          width="200px"
        >
          Student Login
        </Button>
        <Button
          colorScheme="green"
          size="lg"
          onClick={handleLecturerLogin}
          width="200px"
        >
          Lecturer Login
        </Button>
        <Button
          colorScheme="orange"
          size="lg"
          onClick={handleAdminLogin}
          width="200px"
        >
           Registrar Login
        </Button>
        <Button
          colorScheme="red"
          size="lg"
          onClick={handleRegistrarLogin}
          width="200px"
        >
          Admin Login
        </Button>
      </VStack>
    </VStack>
  );
};

export default HomePage;