import React, { useState } from "react";
import {
    VStack, Input, Button, FormControl, FormLabel, FormErrorMessage,
    Text, Box, Select, useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const RegistrarSignup = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        college: "",
        role: "registrar",
        // Add username field to match backend requirements
        username: ""
    });
    
    const [error, setError] = useState("");
    const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async () => {
        // Reset error state
        setError("");
        
        // Check if password and confirm password match
        if (formData.password !== formData.confirmPassword) {
            setIsPasswordMismatch(true);
            return;
        }
        setIsPasswordMismatch(false);
        
        // Validate required fields
        const requiredFields = ['first_name', 'last_name', 'email', 'password', 'college'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                setError(`Please fill in the ${field.replace('_', ' ')}`);
                return;
            }
        }
        
        // Generate username from email if not provided
        const dataToSend = { ...formData };
        if (!dataToSend.username) {
            dataToSend.username = dataToSend.email.split('@')[0];
        }
        
        // Remove confirmPassword as it's not needed by the backend
        delete dataToSend.confirmPassword;
        
        setLoading(true);
        try {
            // Send POST request to the backend
            const response = await fetch("http://127.0.0.1:8000/api/registrar/signup/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });
            
            // Parse the response
            const data = await response.json();
            
            if (!response.ok) {
                // Handle specific error messages from the backend
                if (data.username) {
                    throw new Error(`Username error: ${data.username}`);
                } else if (data.email) {
                    throw new Error(`Email error: ${data.email}`);
                } else if (data.password) {
                    throw new Error(`Password error: ${data.password}`);
                } else if (data.error) {
                    throw new Error(data.error);
                } else {
                    throw new Error("Failed to sign up. Please try again.");
                }
            }
            
            // Handle successful signup
            toast({
                title: "Signup Successful!",
                description: "You can now log in with your credentials.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            
            // Redirect to login page
            navigate("/academic-registrar");
        } catch (error) {
            setError(error.message);
            toast({
                title: "Signup Failed",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack spacing={6} p={8} align="center" justify="center" height="100vh">
            <Box bg="white" p={6} rounded="lg" shadow="xl" width={{ base: "100%", sm: "400px" }}>
                <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
                    Registrar Signup
                </Text>
                
                <VStack spacing={4} align="stretch">
                    {/* First Name Field */}
                    <FormControl isRequired>
                        <FormLabel>First Name</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter your first name"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        />
                    </FormControl>
                    
                    {/* Last Name Field */}
                    <FormControl isRequired>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter your last name"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        />
                    </FormControl>
                    
                    {/* Email Field */}
                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </FormControl>

                    
                    {/* Password Field */}
                    <FormControl isRequired isInvalid={isPasswordMismatch}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </FormControl>
                    
                    {/* Confirm Password Field */}
                    <FormControl isRequired isInvalid={isPasswordMismatch}>
                        <FormLabel>Confirm Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                        {isPasswordMismatch && <FormErrorMessage>Passwords do not match.</FormErrorMessage>}
                    </FormControl>
                    
                   
                    {/* College Field */}
<FormControl isRequired>
    <FormLabel>College</FormLabel>
    <Select
        placeholder="Select your college"
        value={formData.college}
        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
    >
        <option value="College of Agricultural and Environmental Sciences">College of Agricultural and Environmental Sciences (CAES)</option>
        <option value="College of Business and Management Sciences">College of Business and Management Sciences (CoBAMS)</option>
        <option value="College of Computing and Information Sciences">College of Computing and Information Sciences (CoCIS)</option>
        <option value="College of Education and External Studies">College of Education and External Studies (CEES)</option>
        <option value="College of Engineering, Design, Art and Technology">College of Engineering, Design, Art and Technology (CEDAT)</option>
        <option value="College of Health Sciences">College of Health Sciences (CHS)</option>
        <option value="College of Humanities and Social Sciences">College of Humanities and Social Sciences (CHUSS)</option>
        <option value="College of Natural Sciences">College of Natural Sciences (CoNAS)</option>
        <option value="College of Veterinary Medicine, Animal Resource and Bio-Security">College of Veterinary Medicine, Animal Resource and Bio-Security (CoVAB)</option>
        <option value="School of Law">School of Law</option>
    </Select>
</FormControl>
 
                    
                    {/* Submit Button */}
                    <Button
                        colorScheme="green"
                        width="full"
                        onClick={handleSubmit}
                        isLoading={loading}
                        mt={4}
                    >
                        Sign Up
                    </Button>
                    
                    {/* Error Message */}
                    {error && <Text color="red.500" textAlign="center">{error}</Text>}
                    
                    {/* Link to Login Page */}
                    <Text textAlign="center" mt={2}>
                        Already have an account?{" "}
                        <Button variant="link" colorScheme="blue" onClick={() => navigate("/registrar-login")}>
                            Login
                        </Button>
                    </Text>
                </VStack>
            </Box>
        </VStack>
    );
};

export default RegistrarSignup;