import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, FormControl, FormLabel, Input, VStack, Text,
  useToast, Flex, Container, Stack, HStack, InputGroup, InputLeftElement,
  Icon, Divider, Heading, Select, FormErrorMessage
} from "@chakra-ui/react";
import {
  FiUser, FiUserPlus, FiMail, FiLock, FiBookOpen, FiArrowLeft, FiCheckCircle
} from "react-icons/fi";
import Footer from './components/Footer.jsx';

const BASE_URL = 'https://aits-i31l.onrender.com';

const RegistrarSignup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    college: "",
  });
  const [csrfToken, setCsrfToken] = useState('');
  const [error, setError] = useState(null);
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const lightGreenBg = "green.50";
  const accentColor = "green.600";
  const secondaryTextColor = "gray.600";
  const bgColor = "white";
  const borderColor = "gray.200";
  const buttonBgColor = "green.400";
  const buttonHoverColor = "green.500";

  useEffect(() => {
    setIsPasswordMismatch(
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    );
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/csrf-token/`, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error("Failed to fetch CSRF token");
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (err) {
        toast({
          title: 'CSRF Error',
          description: 'Could not load CSRF token. Try refreshing the page.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchCsrfToken();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const {
      email, password, confirmPassword, first_name, last_name, college
    } = formData;

    if (!email || !password || !confirmPassword || !first_name || !last_name || !college) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isPasswordMismatch) {
      setError("Passwords do not match.");
      return;
    }

    const payload = {
      email,
      username: formData.username || email.split('@')[0],
      password,
      first_name,
      last_name,
      staffId: email,
      role: "registrar",
      college
    };

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/registrar/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Registration successful!",
          description: "You can now log in.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/academic-registrar");
      } else {
        setError(data.error || data.detail || "Registration failed.");
      }
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={lightGreenBg} p={4}>
      <Container maxW="lg" py={12} px={{ base: 5, md: 8 }}>
        <Stack spacing={8}>
          <VStack spacing={2} align="center">
            <Box p={2} bg="green.100" borderRadius="full" boxShadow="md" mb={2}>
              <Icon as={FiUserPlus} w={10} h={10} color="green.600" />
            </Box>
            <Heading fontSize="2xl" fontWeight="bold" color={accentColor} textAlign="center">
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
            <Box position="absolute" top={0} left={0} right={0} height="8px" bg="green.400" borderTopLeftRadius="xl" borderTopRightRadius="xl" />

            <Stack spacing={6} mt={2}>
              <HStack spacing={4}>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none"><Icon as={FiUser} color="green.400" /></InputLeftElement>
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
                  <FormLabel>Last Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none"><Icon as={FiUser} color="green.400" /></InputLeftElement>
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
                <FormLabel>Email Address</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none"><Icon as={FiMail} color="green.400" /></InputLeftElement>
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
                <FormLabel>Username (Optional)</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none"><Icon as={FiUserPlus} color="green.400" /></InputLeftElement>
                  <Input
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    focusBorderColor="green.400"
                  />
                </InputGroup>
              </FormControl>

              <FormControl id="password" isRequired isInvalid={isPasswordMismatch}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none"><Icon as={FiLock} color="green.400" /></InputLeftElement>
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
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none"><Icon as={FiLock} color="green.400" /></InputLeftElement>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    focusBorderColor="green.400"
                  />
                </InputGroup>
                {isPasswordMismatch && <FormErrorMessage>Passwords do not match.</FormErrorMessage>}
              </FormControl>

              <FormControl id="college" isRequired>
                <FormLabel>College</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none"><Icon as={FiBookOpen} color="green.400" /></InputLeftElement>
                  <Select
                    placeholder="Select your college"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    focusBorderColor="green.400"
                  >
                    <option value="CAES">CAES</option>
                    <option value="CoBAMS">CoBAMS</option>
                    <option value="CoCIS">CoCIS</option>
                    <option value="CEES">CEES</option>
                    <option value="CEDAT">CEDAT</option>
                    <option value="CHS">CHS</option>
                    <option value="CHUSS">CHUSS</option>
                    <option value="CCoNAS">CoNAS</option>
                    <option value="CoVAB">CoVAB</option>
                    <option value="Law">Law</option>
                  </Select>
                </InputGroup>
              </FormControl>

              {error && (
                <Box p={3} bg="red.50" borderRadius="md">
                  <Text color="red.500" fontSize="sm" textAlign="center">{error}</Text>
                </Box>
              )}

              <Stack spacing={4} pt={2}>
                <Button
                  isLoading={loading}
                  loadingText="Submitting"
                  size="lg"
                  bg={buttonBgColor}
                  color="white"
                  _hover={{ bg: buttonHoverColor }}
                  onClick={handleSubmit}
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
                  _hover={{ bg: "green.50" }}
                >
                  Back to Login
                </Button>
              </Stack>

              <Text align="center" fontSize="sm" color={secondaryTextColor} mt={2}>
                By signing up, you agree to our{" "}
                <Text as="span" fontWeight="semibold" color={accentColor}>Terms of Service</Text> and{" "}
                <Text as="span" fontWeight="semibold" color={accentColor}>Privacy Policy</Text>
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Flex>
  );
};

export default RegistrarSignup;
