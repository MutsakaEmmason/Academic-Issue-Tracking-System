import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Heading,
    Text,
    Switch,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/";

const LecturerLogin = () => {
    const [username, setUsername] = useState(""); // Changed from email to username
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}token/`, {
                username, // Django expects "username"
                password
            });

            // Store JWT token
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;

            toast({
                title: "Login Successful",
                description: "You have successfully logged in.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            navigate("/lecturer-dashboard"); // Redirect to the lecturer dashboard

        } catch (error) {
            setError("Invalid credentials");
            toast({
                title: "Error",
                description: "Invalid username or password.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box maxW="md" mx="auto" mt={10} p={5} borderWidth="1px" borderRadius="lg">
            <Heading as="h2" size="lg" textAlign="center" mb={4}>
                Lecturer Login
            </Heading>

            {error && (
                <Text color="red.500" textAlign="center" mb={4}>
                    {error}
                </Text>
            )}

            <form onSubmit={handleLogin}>
                <FormControl id="username" mb={4}>
                    <FormLabel>Username</FormLabel>
                    <Input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </FormControl>

                <FormControl id="password" mb={4}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </FormControl>

                <Button type="submit" colorScheme="teal" width="full" mb={4}>
                    Login
                </Button>
            </form>
        </Box>
    );
};

export default LecturerLogin;
