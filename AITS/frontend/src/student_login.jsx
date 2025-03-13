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
  useToast,
  FormHelperText, // Import FormHelperText
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const [studentRegNumber, setStudentRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // State for errors
  const navigate = useNavigate();
  const toast = useToast();

  const handleStudentLogin = () => {
    let formErrors = {};

    if (!studentRegNumber) {
      formErrors.studentRegNumber = "Student Registration Number is required";
    }
    if (!password) {
      formErrors.password = "Password is required";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Stop the login process if there are errors
    }

    setErrors({}); // Clear any previous errors

    fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentRegNumber,
        password,
      }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.message || 'Login failed');
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        localStorage.setItem('authToken', data.token);
        toast({
          title: 'Login successful.',
          description: "You've successfully logged in.",
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate("/student-dashboard");
      })
      .catch((error) => {
        console.error('Error:', error);
        toast({
          title: 'Login failed.',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleNav = () => {
    navigate("/register");
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
        <FormControl isInvalid={errors.studentRegNumber}>
          <FormLabel>StudentRegNumber</FormLabel>
          <Input
            onChange={(e) => setStudentRegNumber(e.target.value)}
            value={studentRegNumber}
            type="text"
          />
          {errors.studentRegNumber && (
            <FormHelperText color="red">{errors.studentRegNumber}</FormHelperText>
          )}
        </FormControl>
        <FormControl mt={4} isInvalid={errors.password}>
          <FormLabel>Password</FormLabel>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
          />
          {errors.password && (
            <FormHelperText color="red">{errors.password}</FormHelperText>
          )}
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