import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const RegistrarLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register
  const toast = useToast();
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // Dummy login validation (replace with actual API authentication)
      if (email === "registrar@example.com" && password === "password") {
        toast({
          title: "Logged in successfully!",
          description: "Redirecting to Academic Registrar Dashboard...",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setTimeout(() => {
          navigate("/academic-registrar"); // Redirect to AcademicRegistrar page
        }, 2000); // Delay for better user experience
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      // Registration logic (replace with API call)
      toast({
        title: "Registered successfully!",
        description: "You have successfully registered as a Registrar.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt="100px"
      p="6"
      borderWidth="1px"
      borderRadius="md"
      boxShadow="lg"
    >
      <Stack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          {isLogin ? "Registrar Login" : "Registrar Register"}
        </Text>
        <form onSubmit={handleSubmit}>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl id="password" isRequired mt="4">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Button
            mt="4"
            colorScheme="teal"
            width="full"
            type="submit"
          >
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>

        <Stack direction="row" spacing={2} justify="center" mt="4">
          <Text>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Text>
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Login"}
          </Button>
        </Stack>

        <Stack direction="row" spacing={2} justify="center" mt="2">
          <Text>Or</Text>
          <Button variant="link" as={Link} to="/forgot-password">
            Forgot Password?
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default RegistrarLogin;
