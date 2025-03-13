import React from "react";
import { useNavigate } from "react-router-dom";
import {
  VStack,
  Button,
  Heading,
  Text,
  Box,
  Flex,
  Image,
} from "@chakra-ui/react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="100vh"
      bgGradient="linear(to-br, #1A1A2E, #16213E)"
      color="white"
      p={8}
    >
      {/* Logo or Banner */}
      <Image
        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" // Replace with your logo
        boxSize="80px"
        mb={4}
        alt="AITS Logo"
      />

      {/* Header Section */}
      <VStack spacing={3} mb={6} textAlign="center">
        <Heading size="2xl" fontWeight="bold">
          Academic Issue Tracking System
        </Heading>
        <Text fontSize="lg" opacity={0.8}>
          Streamlining academic issue resolution efficiently
        </Text>
      </VStack>

      {/* Glassmorphism Login Box */}
      <Box
        bg="rgba(255, 255, 255, 0.1)"
        p={8}
        rounded="lg"
        shadow="xl"
        width="350px"
        backdropFilter="blur(10px)"
        border="1px solid rgba(255, 255, 255, 0.2)"
        textAlign="center"
      >
        <VStack spacing={4}>
          <Button
            colorScheme="blue"
            size="lg"
            width="full"
            onClick={() => navigate("/student/login")}
            _hover={{ bg: "blue.400", transform: "scale(1.05)" }}
          >
            Student Login
          </Button>
          <Button
            colorScheme="green"
            size="lg"
            width="full"
            onClick={() => navigate("/lecturer/login")}
            _hover={{ bg: "green.400", transform: "scale(1.05)" }}
          >
            Lecturer Login
          </Button>
          <Button
            colorScheme="orange"
            size="lg"
            width="full"
            onClick={() => navigate("/admin/login")}
            _hover={{ bg: "orange.400", transform: "scale(1.05)" }}
          >
            Admin Login
          </Button>
          <Button
            colorScheme="red"
            size="lg"
            width="full"
            onClick={() => navigate("/registrar-login")}
            _hover={{ bg: "red.400", transform: "scale(1.05)" }}
          >
            Registrar Login
          </Button>
        </VStack>
      </Box>

      {/* Footer Text */}
      <Text fontSize="sm" opacity={0.7} mt={6}>
        © 2025 AITS. All Rights Reserved.
      </Text>
    </Flex>
  );
};

export default HomePage;
