import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, useToast } from "@chakra-ui/react";
import Footer from './components/Footer.jsx';
const BASE_URL = 'https://aits-i31l.onrender.com';

// Add props: onLoginSuccess, currentAccessToken, currentUserRole
const LecturerLogin = ({ onLoginSuccess, currentAccessToken, currentUserRole }) => {
    const navigate = useNavigate();
    const toast = useToast(); // Initialize useToast
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [csrfToken, setCsrfToken] = useState(''); // Add state for CSRF token

    // 1. Fetch CSRF Token on component mount
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
                console.log("CSRF Token fetched for Lecturer Login:", data.csrfToken);
            } catch (error) {
                console.error("Error fetching CSRF token for Lecturer Login:", error);
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
    }, [toast]); // Depend on toast to avoid lint warning, but effectively runs once

    // 2. Add useEffect for navigation, dependent on App.jsx's state
    useEffect(() => {
        // Only navigate if an access token and the CORRECT role are available
        // AND if the current path is NOT already the dashboard (to prevent infinite loops)
        if (currentAccessToken && currentUserRole === 'lecturer' && window.location.pathname !== '/lecturer-dashboard') {
            console.log("LecturerLogin: Navigating to lecturer dashboard because state is set correctly.");
            navigate("/lecturer-dashboard");
        }
    }, [currentAccessToken, currentUserRole, navigate]);

    // REMOVE THE OLD useEffect THAT VERIFIES TOKEN AND NAVIGATES DIRECTLY.
    // That logic should primarily live in App.jsx or ProtectedRoute.

    // Inside LecturerLogin.jsx, in the handleLogin function:

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
            body: JSON.stringify({ username: email, password }), // Assuming 'email' is the username for lecturers
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
        console.log('LecturerLogin: Backend response data (full):', data); // THIS IS CRUCIAL
        console.log('LecturerLogin: Role from backend response:', data.role); // Verify 'data.role' exists and is correct

        // Call the onLoginSuccess prop with the extracted data
       if (onLoginSuccess) {
            onLoginSuccess(data.access, data.refresh, data.role); // Only pass these three
            console.log('LecturerLogin: onLoginSuccess called with:', {
                access: data.access ? 'exists' : 'null',
                refresh: data.refresh ? 'exists' : 'null',
                role: data.role,
                // Removed id and name from this log because they are not being passed
            });
        } else {
            console.warn('LecturerLogin: onLoginSuccess prop is undefined. Cannot update App state.');
        }
        toast({
            title: 'Login successful.',
            description: "You've successfully logged in. Redirecting...",
            status: 'success',
            duration: 3000,
            isClosable: true,
        });

        // The useEffect in LecturerLogin should handle navigation if currentAccessToken/currentUserRole update correctly
        // No direct navigate() call here, rely on App.jsx state propagation

    } catch (err) {
        setError("Network error, please try again.");
        console.error("Lecturer Login request failed:", err);
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
                        Lecturer Login
                    </Text>

                    {error && <Text color="red.500" textAlign="center">{error}</Text>}

                    <form onSubmit={handleLogin}>
                        <VStack spacing={4} align="stretch">
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email here"
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
                            onClick={() => navigate("/lecturer-register")}
                        >
                            Register here
                        </Button>
                    </Text>
                </VStack>
            </Box>
            <Footer userRole="lecturer" />
        </Box>
    );
};

export default LecturerLogin;
