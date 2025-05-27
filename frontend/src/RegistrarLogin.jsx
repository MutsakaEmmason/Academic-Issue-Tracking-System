import React, { useState, useEffect } from "react";
// axios is imported but not used, you can remove it if you're using fetch
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box, // Use Box for div elements
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack, // Use VStack for vertical stacking of elements
    Text, // Use Text for h2, p, label, span elements
    useToast
} from "@chakra-ui/react";
import Footer from './components/Footer.jsx'; // Assuming this exists and works

const BASE_URL = 'https://aits-i31l.onrender.com';

const RegistrarLogin = ({ onLoginSuccess, currentAccessToken, currentUserRole }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [csrfToken, setCsrfToken] = useState('');

    // **Important: You're using 'credentials.username' and 'handleChange' in your JSX,
    // but your state is 'email' and 'password' and your function is 'setEmail'/'setPassword'.
    // We need to fix this mismatch as well.**

    // Let's assume you want to use the 'email' and 'password' state directly.
    // If you intend to use a 'credentials' object state, you'll need to define it and a 'handleChange' function.
    // For now, I'll adjust the JSX to use 'email' and 'password' states directly.

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
                console.log("CSRF Token fetched for Registrar Sign In:", data.csrfToken);
            } catch (error) {
                console.error("Error fetching CSRF token for Registrar Sign In:", error);
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
        if (currentAccessToken && currentUserRole === 'registrar' && window.location.pathname !== '/academic-registrar') {
            console.log("RegistrarSignIn: Navigating to registrar dashboard because state is set correctly.");
            navigate("/academic-registrar"); // Changed from /registrar-dashboard to /academic-registrar as per App.jsx
        }
    }, [currentAccessToken, currentUserRole, navigate]);


    const handleLogin = async (e) => { // Renamed from handleSubmit to handleLogin for consistency
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
                body: JSON.stringify({ username: email, password }), // Use 'email' state directly
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
            console.log('Registrar Login successful data:', data);

            if (onLoginSuccess) {
                onLoginSuccess(data.access, data.refresh, data.role); // <-- ONLY these three fields
                console.log('RegistrarLogin: onLoginSuccess called with:', {
                    access: data.access ? 'exists' : 'null',
                    refresh: data.refresh ? 'exists' : 'null',
                    role: data.role,
                });
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
        // Replaced <div> with Chakra's Box component and applied styles directly
        <Box
            minH="100vh"
            bg="green.500" // Example background color
            p={0}
            m={0}
            overflow="auto"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Box
                maxW="md"
                mx="auto"
                p={6}
                borderRadius="md"
                boxShadow="md"
                bg="white"
                my={10} // Margin top/bottom
            >
                <VStack spacing={4} align="stretch">
                    <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                        Registrar Login
                    </Text>

                    {error && <Text color="red.500" textAlign="center">{error}</Text>}

                    {/* Use handleLogin for form submission */}
                    <form onSubmit={handleLogin}>
                        <VStack spacing={4} align="stretch">
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email" // Use type="email" for email input
                                    value={email} // Use 'email' state
                                    onChange={(e) => setEmail(e.target.value)} // Update 'email' state
                                    placeholder="Enter your email"
                                />
                                <Text fontSize="sm" color="gray.500" mt={1}>
                                    This should be the email you created during registration
                                </Text>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    value={password} // Use 'password' state
                                    onChange={(e) => setPassword(e.target.value)} // Update 'password' state
                                    placeholder="Enter your password"
                                />
                            </FormControl>

                            <Button
                                colorScheme="blue"
                                type="submit"
                                width="full"
                                mt={4}
                                isLoading={loading}
                            >
                                {loading ? 'Logging in...' : 'Sign In'}
                            </Button>
                        </VStack>
                    </form>

                    <Text textAlign="center">
                        Don't have an account?{' '}
                        <Button
                            variant="link"
                            color="red.500"
                            onClick={() => navigate('/registrar-signup')}
                        >
                            Sign Up
                        </Button>
                    </Text>
                </VStack>
            </Box>
            {/* Assuming Footer component needs no styles prop or userRole. If it does, keep it. */}
            {/* <Footer userRole="registrar" /> */}
        </Box>
    );
};

export default RegistrarLogin;
