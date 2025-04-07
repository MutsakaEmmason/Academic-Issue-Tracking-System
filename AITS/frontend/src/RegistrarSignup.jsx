import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
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
  FiArrowLeft,
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
    username: "",
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
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setIsPasswordMismatch(true);
      return;
    }
    setIsPasswordMismatch(false);

    const requiredFields = ['first_name', 'last_name', 'email', 'password', 'college', 'department'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in the ${field.replace('_', ' ')}`);
        return;
      }
    }

    const dataToSend = { ...formData };
    if (!dataToSend.username) {
      dataToSend.username = dataToSend.email.split('@')[0];
    }

    delete dataToSend.confirmPassword;

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/registrar/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
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

      toast({
        title: "Signup Successful!",
        description: "You can now log in with your credentials.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

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
              </HStack>

              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Username (Optional)</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter username or leave blank to use email"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                  <Text fontSize="xs" color="gray.500">
                    If left blank, username will be generated from your email
                  </Text>
                </FormControl>

                <FormControl isRequired isInvalid={isPasswordMismatch}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired isInvalid={isPasswordMismatch}>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  {isPasswordMismatch && <FormErrorMessage>Passwords do not match.</FormErrorMessage>}
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>College</FormLabel>
                  <Select
                    placeholder="Select your college"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  >
                    <option value="CAES">CAES</option>
                    <option value="CoBAMS">CoBAMS</option>
                    <option value="CoCIS">CoCIS</option>
                    <option value="CEES">CEES</option>
                    <option value="CEDAT">CEDAT</option>
                    <option value="CHS">CHS</option>
                    <option value="CHUSS">CHUSS</option>
                    <option value="CoNAS">CoNAS</option>
                    <option value="CoVAB">CoVAB</option>
                    <option value="LAW">LAW</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Department</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter your department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </FormControl>

                <Button
                  colorScheme="green"
                  width="full"
                  onClick={handleSubmit}
                  isLoading={loading}
                  mt={4}
                >
                  Sign Up
                </Button>

                {error && <Text color="red.500" textAlign="center">{error}</Text>}

                <Text textAlign="center" mt={2}>
                  Already have an account?{" "}
                  <Button variant="link" colorScheme="blue" onClick={() => navigate("/registrar-login")}>
                    Login
                  </Button>
                </Text>
              </VStack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Flex>
  );
};

export default RegistrarSignup;