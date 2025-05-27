import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Button, FormControl, FormLabel, Input,
    VStack, Text, useToast // Added useToast
} from "@chakra-ui/react";
import Footer from './components/Footer.jsx';
const BASE_URL = 'https://aits-i31l.onrender.com'; // Ensure BASE_URL is defined

const RegistrarSignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [staffId, setStaffId] = useState(""); // Assuming staff ID for registrar
    const [message, setMessage] = useState("");
    const [csrfToken, setCsrfToken] = useState(''); // Add state for CSRF token
    const navigate = useNavigate();
    const toast = useToast();

    // Fetch CSRF Token
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/csrf-token/`, { credentials: 'include' });
                if (!response.ok) {
                    console.error("Failed to fetch CSRF token response:", response);
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || `Failed to fetch CSRF token: ${response.statusText}`);
                }
                const data = await response.json();
                setCsrfToken(data.csrfToken);
                console.log("CSRF Token fetched for Registrar SignUp:", data.csrfToken);
            } catch (error) {
                console.error("Error fetching CSRF token for Registrar SignUp:", error);
                toast({
                    title: 'Error.',
                    description: "Failed to load security token for registration. Please refresh the page.",
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
        setMessage(""); // Clear previous messages

        if (!email || !password || !fullName || !staffId) {
            setMessage("Please fill in all fields.");
            toast({
                title: 'Validation Error.',
                description: "Please fill in all required fields.",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!csrfToken) {
            setMessage("CSRF token not available. Please refresh the page.");
            toast({
                title: 'Error.',
                description: "CSRF token not available. Please refresh the page.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        const username = email;

        const payload = {
            email,
            username,
            password,
            fullName,
            staffId, // Assuming this field name
            role: "registrar"
        };

        console.log("Sending registration data:", JSON.stringify(payload));

        try {
            const response = await fetch(`${BASE_URL}/api/registrar/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify(payload),
                credentials: 'include',
            });

            console.log("Response status:", response.status);

            if (response.ok) {
                // No token storage here. Just confirm success and redirect to login.
                toast({
                    title: "Registration successful!",
                    description: "You can now log in with your credentials.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setMessage("Registration successful! Please log in.");
                navigate("/registrar-login"); // Redirect to registrar login page
            } else {
                const errorData = await response.json();
                console.error("Registration error:", errorData);
                setMessage(errorData.error || errorData.detail || "Registration failed, please try again.");
                toast({
                    title: 'Registration Failed.',
                    description: errorData.error || errorData.detail || "Please try again.",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            setMessage("Error connecting to the server.");
            console.error("Fetch error:", error);
            toast({
                title: 'Network Error.',
                description: "Failed to connect to the server. Please check your internet connection.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
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
                By signing up, you agree to our{" "}
                <Text as="span" fontWeight="semibold" color={accentColor}>
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text as="span" fontWeight="semibold" color={accentColor}>
                  Privacy Policy
                </Text>
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Flex>
  );
};

export default RegistrarSignup;
