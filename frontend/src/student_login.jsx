import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, useToast } from "@chakra-ui/react";
import Footer from './components/Footer.jsx';
const BASE_URL = 'https://aits-i31l.onrender.com';

const StudentLogin = ({ onLoginSuccess, currentAccessToken, currentUserRole }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const [studentNumber, setStudentNumber] = useState(""); // Changed from email to studentNumber
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [csrfToken, setCsrfToken] = useState('');

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
                console.log("CSRF Token fetched for Student Login:", data.csrfToken);
            } catch (error) {
                console.error("Error fetching CSRF token for Student Login:", error);
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
    }, [toast]);

    // Navigate if authentication state is already set and correct
    useEffect(() => {
        if (currentAccessToken && currentUserRole === 'student' && window.location.pathname !== '/student-dashboard') {
            console.log("StudentLogin: Navigating to student dashboard because state is set correctly.");
            navigate("/student-dashboard");
        }
    }, [currentAccessToken, currentUserRole, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!csrfToken) {
            setError("CSRF token not available. Please refresh the page.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                // IMPORTANT: Changed 'username' to 'studentNumber' (or whatever your backend expects)
                // If your Django backend's token endpoint still expects 'username', you need to map studentNumber to username here.
                // Assuming your backend expects 'username' and student number is the username for students.
                body: JSON.stringify({ username: studentNumber, password }), // Use studentNumber here
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Server error" }));
                setError(errorData.detail || errorData.message || "Login failed");
                toast({
                    title: 'Login Failed.',
                    description: errorData.detail || errorData.message || "Please check your credentials.",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            const data = await response.json();
            console.log('Login successful data:', data);

            // Call the onLoginSuccess prop
            if (onLoginSuccess) {
                // Assuming data contains access, refresh, role, user_id, username (which would be studentNumber)
                onLoginSuccess(data.access, data.refresh, data.role, data.user_id, data.username);
            }

            toast({
                title: 'Login successful.',
                description: "You've successfully logged in. Redirecting...",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

        } catch (err) {
            setError("Network error, please try again.");
            console.error("Login request failed:", err);
            toast({
                title: 'Login Failed.',
                description: err.message || "Network error, please try again.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box minH="100vh" bg="green.500" p={0} m={0} overflow="auto" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Box maxW="md" mx="auto" p={6} borderRadius="md" boxShadow="md" bg="white" my={10}>
                <VStack spacing={4} align="stretch">
                    <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                        Student Login
                    </Text>

                    {error && <Text color="red.500" textAlign="center">{error}</Text>}

                    <form onSubmit={handleLogin}>
                        <VStack spacing={4} align="stretch">
                            <FormControl isRequired>
                                <FormLabel>Student Number</FormLabel> {/* Changed label */}
                                <Input
                                    type="text" // Changed type to text as student numbers can be alphanumeric
                                    value={studentNumber}
                                    onChange={(e) => setStudentNumber(e.target.value)}
                                    placeholder="Enter your student number here" // Changed placeholder
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                />
                            </FormControl>

                            <Button colorScheme="blue" type="submit" width="full" mt={4} isLoading={loading}>
                                Login
                            </Button>
                        </VStack>
                    </form>

                    <Text textAlign="center">
                        Don't have an account?{" "}
                        <Button
                            variant="link"
                            color="red.500"
                            onClick={() => navigate("/register")} {/* Assuming /register is student registration */}
                        >
                            Register here
                        </Button>
                    </Text>
                </VStack>
            </Box>
            <Footer userRole="student" />
        </Box>
    );
};

export default StudentLogin;
