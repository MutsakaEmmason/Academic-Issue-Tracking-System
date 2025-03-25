import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, FormLabel, Input, VStack, Text } from "@chakra-ui/react";

const LecturerRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [courseTaught, setCourseTaught] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !courseTaught) {
      setMessage("Please fill in all fields");
      return;
    }

    // Simulate registration process (replace with actual API request)
    try {
      const response = await fetch("/api/lecturer/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, courseTaught }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Registration successful! Redirecting to login...");
        navigate("/lecturer-login"); // Redirect to login page after registration
      } else {
        const data = await response.json();
        setMessage(data.error || "Registration failed, please try again.");
      }
    } catch (error) {
      setMessage("Error connecting to the server");
    }
  };

  return (
    <Box maxW="md" mx="auto" p={4} borderRadius="md" boxShadow="md" bg="white">
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Lecturer Register
        </Text>
        {message && <Text color="red.500" textAlign="center">{message}</Text>}
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="courseTaught">Course Taught</FormLabel>
              <Input
                type="text"
                id="courseTaught"
                value={courseTaught}
                onChange={(e) => setCourseTaught(e.target.value)}
                placeholder="Enter the course you teach"
              />
            </FormControl>
            <Button colorScheme="blue" type="submit" width="full" mt={4}>
              Register
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default LecturerRegister;
