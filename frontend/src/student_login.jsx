import { useState, useEffect } from "react";
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
    FormHelperText,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Footer from './components/Footer';
const BASE_URL = 'https://academic-issue-tracking-system-ba1p.onrender.com'; 

const StudentLogin = () => {
    const [studentRegNumber, setStudentRegNumber] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [csrfToken, setCsrfToken] = useState(''); // EMPHASIZE: Add state for CSRF token

    const navigate = useNavigate();
    const toast = useToast();

    // MISSING: Add this useEffect hook
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
                console.log("CSRF Token fetched for Login:", data.csrfToken);
            } catch (error) {
                console.error("Error fetching CSRF token for Login:", error);
                toast({
                    title: 'Error.',
                    description: "Failed to load security token for login. Please refresh the page.",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchCsrfToken();
    }, []); // Empty dependency array means it runs once on mount


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
            return;
        }

        setErrors({});

        // Updated login URL to match the backend URL for obtaining JWT tokens
        fetch('/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: studentRegNumber,
                password,
            }),
        })
            .then(response => {
                console.log('Response:', response);
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.detail || 'Login failed');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                localStorage.setItem('token', data.access); // Store the JWT token
                toast({
                    title: 'Login successful.',
                    description: "You've successfully logged in.",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                // After successful login, fetch user profile (optional)
                fetchUserProfile(data.access);
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

    const fetchUserProfile = (token) => {
        // Fetch user profile using the token
        fetch('/api/student-profile/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include JWT token in header
            },
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.detail || 'Failed to fetch user profile');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('User profile data:', data);


                // EMPHASIZE: Store user's role, ID, and username from profile
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('userId', data.id); // Assuming 'id' is present
                localStorage.setItem('username', data.username); // Assuming 'username' is present
               
                // Redirect or handle profile data if needed
               
                navigate("/student-dashboard");
            })
            .catch((error) => {
                console.error('Error:', error);
                toast({
                    title: 'Profile fetch failed.',
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
        <Box
            minHeight="100vh"
            bg="green.500"
            display="flex"
            flexDirection="column"
            alignItems="stretch"
        >
            <Box flex="1" display="flex" justifyContent="center" alignItems="center">
                <VStack
                    spacing={6}
                    p={8}
                    align="center"
                    bg="rgba(255, 255, 255, 0.8)"
                    borderRadius="lg"
                    boxShadow="lg"
                    maxWidth="400px"
                >
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
                            <FormLabel>Student Number</FormLabel>
                            <Input
                                onChange={(e) => setStudentRegNumber(e.target.value)}
                                value={studentRegNumber}
                                type="text"
                                bg="white" // Added white background
                                border="1px solid #ccc" // Added border
                                color="black" // Added text color
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
                                bg="white" // Added white background
                                border="1px solid #ccc" // Added border
                                color="black" // Added text color
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
            </Box>
            <Box width="100%">
                <Footer userRole="student" />
            </Box>
        </Box>
    );
};

export default StudentLogin;
