import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, useToast } from "@chakra-ui/react";
import Footer from './components/Footer.jsx';

const BASE_URL = 'https://aits-i31l.onrender.com';

const StudentLogin = ({ setAccessToken, setUserRole }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const [studentNumber, setStudentNumber] = useState("");
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!csrfToken) {
            setError("CSRF token not available. Please refresh the page.");
            setLoading(false);
            toast({
                title: 'Error.',
                description: "CSRF token not available. Please refresh the page.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify({ username: studentNumber, password }),
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
            console.log('StudentLogin: Backend response:', data);

            // Store in localStorage
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('user_role', data.role);
            if (data.user_id !== undefined) localStorage.setItem('user_id', data.user_id ?? '');
            if (data.username !== undefined) localStorage.setItem('username', data.username ?? '');

            // Update parent state
            setAccessToken(data.access);
            setUserRole(data.role);

            // Show success toast
            toast({
                title: 'Login successful.',
                description: "You've successfully logged in. Redirecting...",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Navigate to dashboard
            console.log('Navigating to /student-dashboard');
            navigate('/student-dashboard', { replace: true });

        } catch (err) {
            setError("Network error, please try again.");
            console.error("Student login request failed:", err);
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
                                <FormLabel>Student Number</FormLabel>
                                <Input
                                    type="text"
                                    value={studentNumber}
                                    onChange={(e) => setStudentNumber(e.target.value)}
                                    placeholder="Enter your student number here"
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
                            onClick={() => navigate("/register")}
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
