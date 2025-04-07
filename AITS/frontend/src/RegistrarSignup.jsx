import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
    Select,
    FormHelperText,
    useToast,
} from "@chakra-ui/react";

const RegistrarSignup = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        college: "",
        department: "",
        studentRegNumber: "",
        role: "registrar",
        // Add username field to match backend requirements
        username: ""
    });
    
    const [error, setError] = useState("");
    const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

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
      bg={lightGreenBg}
      p={4}
    >
      <Container maxW="lg" py={12} px={{ base: 5, md: 8 }}>
        <Stack spacing={8}>
          <VStack spacing={2} align="center">
            <Box 
              p={2} 
              bg="green.100" 
              borderRadius="full" 
              boxShadow="md"
              mb={2}
            >
              <Icon as={FiUserPlus} w={10} h={10} color="green.600" />
            </Box>
            <Heading 
              fontSize="2xl"
              fontWeight="bold"
              color={accentColor}
              textAlign="center"
            >
              Academic Registrar Registration
            </Heading>
            <Text fontSize="md" color={secondaryTextColor} textAlign="center">
              Create your account to access the registrar portal
            </Text>
          </VStack>
          
          <Box
            rounded="xl"
            bg={bgColor}
            boxShadow="lg"
            p={8}
            borderWidth="1px"
            borderColor={borderColor}
            position="relative"
            overflow="hidden"
          >
            {/* Decorative green accent */}
            <Box 
              position="absolute" 
              top={0} 
              left={0} 
              right={0} 
              height="8px" 
              bg="green.400" 
              borderTopLeftRadius="xl" 
              borderTopRightRadius="xl" 
            />
            
            <Stack spacing={6} mt={2}>
              <HStack spacing={4}>
                <FormControl id="firstName" isRequired>
                  <FormLabel fontWeight="medium">First Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiUser} color="green.400" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      placeholder="First name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      focusBorderColor="green.400"
                    />
                  </InputGroup>
                </FormControl>
                
                <FormControl id="lastName" isRequired>
                  <FormLabel fontWeight="medium">Last Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiUser} color="green.400" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      placeholder="Last name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      focusBorderColor="green.400"
                    />
                  </InputGroup>
                </FormControl>
              </HStack>
              
              <FormControl id="email" isRequired>
                <FormLabel fontWeight="medium">Email Address</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiMail} color="green.400" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    focusBorderColor="green.400"
                  />
                </InputGroup>
              </FormControl>
              
              <FormControl id="username">
                <FormLabel fontWeight="medium">Username (Optional)</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiUserPlus} color="green.400" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    focusBorderColor="green.400"
                  />
                </InputGroup>
                <Text fontSize="xs" color={secondaryTextColor} mt={1}>
                  If left blank, username will be generated from your email
                </Text>
              </FormControl>
              
              <FormControl id="password" isRequired isInvalid={isPasswordMismatch}>
                <FormLabel fontWeight="medium">Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiLock} color="green.400" />
                  </InputLeftElement>
                  <Input
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    focusBorderColor="green.400"
                  />
                </InputGroup>
              </FormControl>
              
              <FormControl id="confirmPassword" isRequired isInvalid={isPasswordMismatch}>
                <FormLabel fontWeight="medium">Confirm Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiLock} color="green.400" />
                  </InputLeftElement>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    focusBorderColor="green.400"
                  />
                </InputGroup>
                {isPasswordMismatch && (
                  <FormErrorMessage>Passwords do not match.</FormErrorMessage>
                )}
              </FormControl>
              
              <Divider borderColor="green.100" />
              
              <Box p={3} bg="green.50" borderRadius="md" borderLeft="4px solid" borderLeftColor="green.400">
                <Text fontSize="sm" fontWeight="medium" color="green.700">
                  Institution Information
                </Text>
              </Box>
              
              <FormControl id="college" isRequired>
                <FormLabel fontWeight="medium">College</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiBookOpen} color="green.400" />
                  </InputLeftElement>
                  <Select
                    placeholder="Select your college"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    focusBorderColor="green.400"
                  >
                    <option value="College of Engineering">COSIS</option>
                    <option value="College of Medicine">CONAS</option>
                    <option value="College of Business">COBMAS</option>
                    <option value="School of Law">CHS</option>
                    <option value="School of Law">CEDAT</option>
                    <option value="School of Law">CAES</option>
                    <option value="School of Law">SCHOOL OF LAW</option>
                    <option value="School of Law">CEDAT</option>
                    <option value="College of Arts and Sciences">College of Arts and Sciences</option>
                    <option value="College of Education">College of Education</option>
                  </Select>
                </InputGroup>
              </FormControl>
              
              <FormControl id="department" isRequired>
                <FormLabel fontWeight="medium">Department</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiBriefcase} color="green.400" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="Your department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    focusBorderColor="green.400"
                  />
                </InputGroup>
              </FormControl>
              
              {error && (
                <Box p={3} bg="red.50" borderRadius="md">
                  <Text color="red.500" fontSize="sm" textAlign="center">
                    {error}
                  </Text>
                </Box>
              )}
              
              <Stack spacing={4} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={buttonBgColor}
                  color="white"
                  _hover={{
                    bg: buttonHoverColor,
                  }}
                  onClick={handleSubmit}
                  isLoading={loading}
                  leftIcon={<FiCheckCircle />}
                  boxShadow="md"
                  fontWeight="bold"
                >
                  Create Account
                </Button>
                
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<FiArrowLeft />}
                  onClick={() => navigate("/registrar-login")}
                  borderColor="green.200"
                  color="green.600"
                  _hover={{
                    bg: "green.50",
                  }}
                >
                  Back to Login
                </Button>
              </Stack>
              
              <Text align="center" fontSize="sm" color={secondaryTextColor} mt={2}>
                By signing up, you agree to our <Text as="span" color="green.500" fontWeight="medium">Terms of Service</Text> and <Text as="span" color="green.500" fontWeight="medium">Privacy Policy</Text>
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Flex>
  );
};

export default RegistrarSignup;