import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistrarSignup = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        college: "",
        department: "",
        studentRegNumber: "",
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
        const requiredFields = ['first_name', 'last_name', 'email', 'password', 'college', 'department'];
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
                    
                    {/* Username Field (Optional) */}
                    <FormControl>
                        <FormLabel>Username (Optional)</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter username or leave blank to use email"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                        <Text fontSize="xs" color="gray.500">
                            If left blank, username will be generated from your email
                        </Text>
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
                            <option value="College of Engineering">College of Engineering</option>
                            <option value="College of Medicine">College of Medicine</option>
                            <option value="College of Business">College of Business</option>

                            <option value="School of Law">College of Business</option>

                            <option value="College of Business">College of Computing and information Technology</option>

                        </Select>
                    </FormControl>
                    
                    {/* Department Field */}
                    <FormControl isRequired>
                        <FormLabel>Department</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter your department"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        />
                    </FormControl>
                    
                    {/* Student Registration Number */}
                    <FormControl isRequired>
                        <FormLabel>Student Registration Number</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter your registration number"
                            value={formData.studentRegNumber}
                            onChange={(e) => setFormData({ ...formData, studentRegNumber: e.target.value })}
                        />
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