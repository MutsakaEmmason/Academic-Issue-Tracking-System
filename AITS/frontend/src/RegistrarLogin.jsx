import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Heading, Stack, useToast, VStack } from "@chakra-ui/react";

const RegistrarLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toast = useToast();

    const handleLogin = () => {
        if (email === "" || password === "") {
            toast({
                title: "Error",
                description: "Please fill in all fields.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            // Proceed with the login logic
            // You can call your API or use authentication logic here
            toast({
                title: "Login Successful",
                description: "Welcome back, Registrar!",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <VStack minHeight="100vh" justify="center" spacing={4}>
            <Box
                p={8}
                maxWidth="400px"
                borderWidth={1}
                borderRadius="md"
                boxShadow="lg"
                bg="white"
                w="full"
            >
                <Heading mb={4} textAlign="center">Registrar Login</Heading>
                <Stack spacing={4}>
                    <FormControl id="email" isRequired>
                        <FormLabel>Email Address</FormLabel>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>

                    <FormControl id="password" isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>

                    <Button colorScheme="teal" onClick={handleLogin} width="full">
                        Login
                    </Button>
                </Stack>
            </Box>
        </VStack>
    );
};

export default RegistrarLogin;
