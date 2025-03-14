import React, { useState } from "react";
import {
  VStack,
  Input,
  Button,
  Heading,
  Text,
  Box,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Select,
  FormErrorMessage,
  useBreakpointValue,
} from "@chakra-ui/react";

const RegistrarAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
  });
  const [error, setError] = useState("");
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);

  // Dummy data for login simulation
  const existingUsers = [
    { email: "admin@example.com", password: "admin123" }, // Example user
  ];

  const handleSubmit = () => {
    if (isLogin) {
      // Login logic: check if user exists
      const user = existingUsers.find(
        (user) => user.email === formData.email && user.password === formData.password
      );
      if (!user) {
        setError("No account found with this email and password.");
      } else {
        setError(""); // Clear error on successful login
        console.log("Logging in:", formData);
      }
    } else {
      // Signup logic: check if passwords match
      if (formData.password !== formData.confirmPassword) {
        setIsPasswordMismatch(true);
      } else {
        setIsPasswordMismatch(false);
        console.log("Signing up:", formData);
      }
    }
  };

  return (
    <VStack
      spacing={6}
      p={8}
      align="center"
      justify="center"
      height="100vh"
      bgGradient="linear(to-br, #2c3e50, #34495e)"
      color="white"
    >
      <Heading size="lg">{isLogin ? "Registrar Login" : "Registrar Signup"}</Heading>
      <Box
        bg="rgba(255, 255, 255, 0.1)"
        p={6}
        rounded="lg"
        shadow="xl"
        width={{ base: "100%", sm: "400px" }} // Responsively control width
        backdropFilter="blur(10px)"
        border="1px solid rgba(255, 255, 255, 0.2)"
      >
        <VStack spacing={4} align="stretch">
          {!isLogin && (
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your name"
                bg="white"
                color="black"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormControl>
          )}

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              bg="white"
              color="black"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </FormControl>

          <FormControl isInvalid={isPasswordMismatch}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                bg="white"
                color="black"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            {isPasswordMismatch && (
              <FormErrorMessage>Passwords do not match.</FormErrorMessage>
            )}
          </FormControl>

          {!isLogin && (
            <>
              <FormControl isInvalid={isPasswordMismatch}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  bg="white"
                  color="black"
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>College</FormLabel>
                <Select
                  placeholder="Select College"
                  bg="white"
                  color="black"
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                >
                  <option value="College of Engineering">College of Engineering</option>
                  <option value="College of Medicine">College of Medicine</option>
                  <option value="College of Business">College of Business</option>
                  <option value="College of Humanities">College of Humanities</option>
                </Select>
              </FormControl>
            </>
          )}

          <Button
            colorScheme={isLogin ? "blue" : "green"}
            width="full"
            onClick={handleSubmit}
            _hover={{ transform: "scale(1.05)" }}
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>

          {error && (
            <Text color="red.400" fontSize="sm" textAlign="center">
              {error}
            </Text>
          )}

          <Text fontSize="sm" textAlign="center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Button variant="link" colorScheme="blue" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Login"}
            </Button>
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default RegistrarAuth;
