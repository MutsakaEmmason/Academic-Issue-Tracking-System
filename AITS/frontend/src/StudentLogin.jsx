import { useState } from "react";
import {
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Image,
  Heading,
  Box,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const [studentRegNumber, setStudentRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Corrected: Call useNavigate as a function

  const handleStudentLogin = () => {
    // Implement your login logic here
  };

  const handleNav = () => {
    navigate("/register"); // Corrected: Use navigate instead of navigator
  };

  return (
    <VStack spacing={6} p={8} align="center">
      <Image
        src="https://i.pinimg.com/736x/7f/30/aa/7f30aaf443ebbf9059c21d6c7f745433.jpg"
        alt="Makerere University Logo"
        boxSize="100px"
      />

      <Heading size="lg">Academic Issue Tracking System (AITS)</Heading>

      <Text textAlign="center" color="gray.600">
        Welcome to the Makerere University Academic Issue Tracking System. Log in
        to report, track, and manage your academic issues efficiently.
      </Text>

      <Box w="100%" maxW="400px">
        <FormControl>
          <FormLabel>StudentRegNumber</FormLabel>
          <Input
            onChange={(e) => setStudentRegNumber(e.target.value)}
            value={studentRegNumber}
            type="text"
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Password</FormLabel>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
          />
        </FormControl>
        <Button
          onClick={handleStudentLogin}
          colorScheme="blue"
          mt={6}
          w="100%"
        >
          Login
        </Button>
        <Text onClick={handleNav} cursor="pointer" mt={2} color="blue.500">
          Don't have an account? Sign up
        </Text>
      </Box>
    </VStack>
  );
};

export default StudentLogin;