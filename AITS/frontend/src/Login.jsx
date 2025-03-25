import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, FormLabel, Input, VStack, Text } from "@chakra-ui/react";

const LecturerLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/lecturer-dashboard"); // If logged in, directly go to the dashboard
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Replace with actual login logic
    const response = await fetch("/api/lecturer/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      navigate("/lecturer-dashboard");
    } else {
      alert("Login failed");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/lecturer-register"); // Redirect to registration page
  };

  return (
    <Box maxW="md" mx="auto" p={4} borderRadius="md" boxShadow="md" bg="white">
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Lecturer Login
        </Text>
        <form onSubmit={handleLogin}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </FormControl>
            <Button colorScheme="blue" type="submit" width="full" mt={4}>
              Login
            </Button>
          </VStack>
        </form>
        <Text textAlign="center">
          Don't have an account?{" "}
          <Button variant="link" color="blue.500" onClick={handleRegisterRedirect}>
            Register here
          </Button>
        </Text>
      </VStack>
    </Box>
  );
};

export default LecturerLogin;
