import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, FormLabel, Input, VStack, Text } from "@chakra-ui/react";

const LecturerLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://127.0.0.1:8000/api/token/verify/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then(res => res.json())
                .then(data => {
                    if (data.valid) {
                        navigate("/lecturer-dashboard");
                    } else {
                        localStorage.removeItem("token");
                    }
                })
                .catch((err) => {
                    console.error("Token verification error:", err);
                    localStorage.removeItem("token");
                });
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/lecturer/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Server error" }));
                setError(errorData.error || errorData.message || "Login failed");
                return;
            }

            const data = await response.json();
            const token = data.access || data.token;  // Adjust to your actual token field in response
            if (token) {
                localStorage.setItem("token", token);
                navigate("/lecturer-dashboard");
            } else {
                setError("Invalid token response from server.");
            }
        } catch (err) {
            setError("Network error, please try again.");
            console.error("Login request failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxW="md" mx="auto" p={6} borderRadius="md" boxShadow="md" bg="white">
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
                                placeholder="Enter your email"
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

                        <Button colorScheme="red" type="submit" width="full" mt={4} isLoading={loading}>
                            Login
                        </Button>
                    </VStack>
                </form>

                <Text textAlign="center">
                    Don't have an account?{" "}
                    <Button
                        variant="link"
                        color="purple.500"
                        onClick={() => navigate("/lecturer-register")}
                    >
                        Register here
                    </Button>
                </Text>
            </VStack>
        </Box>
    );
};

export default LecturerLogin;
