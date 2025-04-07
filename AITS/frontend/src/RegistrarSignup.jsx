import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Text,
  useToast,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiBriefcase, 
  FiBookOpen,
  FiUserPlus,
  FiArrowLeft
} from 'react-icons/fi';

const RegistrarSignup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    department: "",
    role: "registrar",
    username: ""
  });
  
  const [error, setError] = useState("");
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

  const handleSubmit = async () => {
    // Reset error state
    setError("");
    
    // Check if password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      setIsPasswordMismatch(true);
      return;
    }
    setIsPasswordMismatch(false);
    
    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'email', 'password', 'college', 'department'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in the ${field.replace('_', ' ')}`);
        return;
      }
    }
    
    // Generate username from email if not provided
    const dataToSend = { ...formData };
    if (!dataToSend.username) {
      dataToSend.username = dataToSend.email.split('@')[0];
    }
    
    // Remove confirmPassword as it's not needed by the backend
    delete dataToSend.confirmPassword;
    
    setLoading(true);
    try {
      // Send POST request to the backend
      const response = await fetch("http://127.0.0.1:8000/api/registrar/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      
      // Parse the response
      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific error messages from the backend
        if (data.username) {
          throw new Error(`Username error: ${data.username}`);
        } else if (data.email) {
          throw new Error(`Email error: ${data.email}`);
        } else if (data.password) {
          throw new Error(`Password error: ${data.password}`);
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error("Failed to sign up. Please try again.");
        }
      }
      
      // Handle successful signup
      toast({
        title: "Signup Successful!",
        description: "You can now log in with your credentials.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Redirect to login page
      navigate("/academic-registrar");
    } catch (error) {
      setError(error.message);
      toast({
        title: "Signup Failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue("gray.50", "gray.800")}
      p={4}
    >
      <Container maxW="lg" py={12} px={{ base: 5, md: 8 }}>
        <Stack spacing={8}>
          <Stack align="center">
            <Heading 
              fontSize="2xl" 
              fontWeight="bold" 
              color={textColor}
              textAlign="center"
            >
              Academic Registrar Registration
            </Heading>
            <Text fontSize="md" color={secondaryTextColor} textAlign="center">
              Create your account to access the registrar portal
            </Text>
          </Stack>
          
          <Box
            rounded="lg"
            bg={bgColor}
            boxShadow="lg"
            p={8}
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Stack spacing={6}>
              <HStack spacing={4}>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiUser} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      placeholder="First name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  </InputGroup>
                </FormControl>
                
                <FormControl id="lastName" isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiUser} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      placeholder="Last name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  </InputGroup>
                </FormControl>
              </HStack>
              
              <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiMail} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </InputGroup>
              </FormControl>
              
              <FormControl id="username">
                <FormLabel>Username (Optional)</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiUserPlus} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </InputGroup>
                <Text fontSize="xs" color={secondaryTextColor} mt={1}>
                  If left blank, username will be generated from your email
                </Text>
              </FormControl>
              
              <FormControl id="password" isRequired isInvalid={isPasswordMismatch}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiLock} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </InputGroup>
              </FormControl>
              
              <FormControl id="confirmPassword" isRequired isInvalid={isPasswordMismatch}>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiLock} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </InputGroup>
                {isPasswordMismatch && (
                  <FormErrorMessage>Passwords do not match.</FormErrorMessage>
                )}
              </FormControl>
              
              <Divider />
              
              <FormControl id="college" isRequired>
                <FormLabel>College</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiBookOpen} color="gray.400" />
                  </InputLeftElement>
                  <Select
                    placeholder="Select your college"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  >
                    <option value="College of Engineering">COSIS</option>
                    <option value="College of Medicine">College of Medicine</option>
                    <option value="College of Business">College of Business</option>
                    <option value="School of Law">School of Law</option>
                    <option value="College of Arts and Sciences">College of Arts and Sciences</option>
                    <option value="College of Education">College of Education</option>
                  </Select>
                </InputGroup>
              </FormControl>
              
              <FormControl id="department" isRequired>
                <FormLabel>Department</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiBriefcase} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="Your department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </InputGroup>
              </FormControl>
              
              {error && (
                <Text color="red.500" fontSize="sm" textAlign="center">
                  {error}
                </Text>
              )}
              
              <Stack spacing={4} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg="blue.500"
                  color="white"
                  _hover={{
                    bg: 'blue.600',
                  }}
                  onClick={handleSubmit}
                  isLoading={loading}
                  leftIcon={<FiUserPlus />}
                >
                  Create Account
                </Button>
                
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<FiArrowLeft />}
                  onClick={() => navigate("/registrar-login")}
                >
                  Back to Login
                </Button>
              </Stack>
              
              <Text align="center" fontSize="sm" color={secondaryTextColor}>
                By signing up, you agree to our Terms of Service and Privacy Policy
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Flex>
  );
};

export default RegistrarSignup;

