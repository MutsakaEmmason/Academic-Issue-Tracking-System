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

const LecturerLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [course, setCourse] = useState("");
    const [department, setDepartment] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const toast = useToast();

    const isLecturerSignedUp = () => {
        const lecturer = localStorage.getItem("lecturer");
        return lecturer ? true : false;
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const lecturer = JSON.parse(localStorage.getItem("lecturer"));
        if (lecturer && lecturer.email === email && lecturer.password === password) {
            navigate("/lecturer-dashboard", { state: { username: lecturer.email } });
            setError("");
        } else {
            setError("Invalid email or password.");
            toast({
                title: "Error",
                description: "Invalid email or password.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleSignup = (e) => {
        e.preventDefault();
        if (email && password && course && department) {
            const lecturer = { email, password, course, department };
            localStorage.setItem("lecturer", JSON.stringify(lecturer));
            toast({
                title: "Success",
                description: "Signup successful! Please log in.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setIsLogin(true);
            setError("");
        } else {
            setError("Please fill in all fields.");
            toast({
                title: "Error",
                description: "Please fill in all fields.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box maxW="md" mx="auto" mt={10} p={5} borderWidth="1px" borderRadius="lg">
            <Heading as="h2" size="lg" textAlign="center" mb={4}>
                {isLogin ? "Lecturer Login" : "Lecturer Sign Up"}
            </Heading>

            {error && (
                <Text color="red.500" textAlign="center" mb={4}>
                    {error}
                </Text>
            )}

            <form onSubmit={isLogin ? handleLogin : handleSignup}>
                <FormControl id="email" mb={4}>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

                <FormControl display="flex" alignItems="center" mb={4}>
                    <FormLabel htmlFor="login-signup-switch" mb="0">
                        {isLogin ? "Switch to Sign Up" : "Switch to Login"}
                    </FormLabel>
                    <Switch
                        id="login-signup-switch"
                        isChecked={!isLogin}
                        onChange={() => setIsLogin(!isLogin)}
                    />
                </FormControl>

                {!isLogin && (
                    <>
                        <FormControl id="course" mb={4}>
                            <FormLabel>Course Taught</FormLabel>
                            <Input
                                type="text"
                                placeholder="Enter the course you teach"
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                required
                            />
                        </FormControl>

                        <FormControl id="department" mb={4}>
                            <FormLabel>Department</FormLabel>
                            <Input
                                type="text"
                                placeholder="Enter your department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                            />
                        </FormControl>
                    </>
                )}

                <Button type="submit" colorScheme="teal" width="full" mb={4}>
                    {isLogin ? "Login" : "Sign Up"}
                </Button>
            </form>

            <Text textAlign="center">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Button
                    variant="link"
                    colorScheme="teal"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? "Sign Up" : "Login"}
                </Button>
            </Text>
        </Box>
    );
};

export default LecturerLogin;