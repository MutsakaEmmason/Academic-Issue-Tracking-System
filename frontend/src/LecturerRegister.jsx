import React, { useState, useEffect } from "react"; // Added useEffect
import { useNavigate } from "react-router-dom";
import {
    Box, Button, FormControl, FormLabel, Input,
    VStack, Text, Select, FormHelperText, useToast
} from "@chakra-ui/react";
import Footer from './components/Footer.jsx';
const BASE_URL = 'https://aits-i31l.onrender.com';


const collegeDepartments = {
    // ... (your existing collegeDepartments object)
    CAES: [
        "Agricultural Production (AP)",
        "Agribusiness and Natural Resource Economics (Ag & NRE)",
        "Extension & Innovations (EI)",
        "Forestry, Bio-Diversity and Tourism (F, B &T)",
        "Environmental Management (EM)",
        "Geography, Geo Informatics and Climatic Sciences (GGCS)",
        "Agricultural & Bio systems Engineering (ABE)",
        "Food Technology and Human Nutrition (FT&HN)",
    ],
    CoBAMS: [
        "Economic Theory and Analysis",
        "Policy and Development Economics",
        "Marketing & Management",
        "Accounting and Finance",
        "Planning and Applied Statistics",
        "Population Studies",
        "Statistics and Actuarial Science",
    ],
    CoCIS: [
        "Computer Science",
        "Information Technology",
        "Information Systems",
        "Networks",
        "Library and Information Sciences",
        "Records and Archives Management",
    ],
    CEES: [
        "Social Sciences & Arts Education",
        "Science, Technology & Vocational Education",
        "Foundations & Curriculum Studies",
        "Adult & Community Education",
        "Institute of Open Distance and eLearning",
        "Higher Education Studies and Development",
    ],
    CEDAT: [
        "Civil and Environmental Engineering",
        "Electrical and Computer Engineering",
        "Mechanical Engineering",
        "Architecture and Physical Planning",
        "Construction Economics and Management",
        "Geomatics and Land Management",
        "Fine Art",
        "Visual Communication Design and Multi-media",
        "Industrial Art and Applied Design",
    ],
    CHS: [
        "Internal Medicine",
        "Surgery",
        "Obstetrics & Gynaecology",
        "Psychiatry",
        "Family Medicine",
        "Anaesthesia",
        "Ear Nose Throat",
        "Ophthalmology",
        "Orthopaedics",
        "Radiology & Radio Therapy",
        "Paediatrics & Child Health",
        "Health Policy & Management",
        "Epidemic & Biostatistics",
        "Community Health & Behavioral Sciences",
        "Disease Control & Environmental Health",
        "Human Anatomy",
        "Biochemistry",
        "Microbiology",
        "Pathology",
        "Physiology",
        "Pharmacology & Therapeutics",
        "Medical Illustration",
        "Pharmacy",
        "Dentistry",
        "Nursing",
        "Allied Health Sciences",
    ],
    CHUSS: [
        "Philosophy",
        "Development Studies",
        "Religion and Peace Studies",
        "Performing Arts & Film",
        "History, Archaeology & Organizational Studies",
        "Women and Gender Studies",
        "Literature",
        "Linguistics, English Language Studies & Communication Skills",
        "European and Oriental Languages",
        "African Languages",
        "Journalism and Communication",
        "Mental Health and Community Psychology",
        "Educational, Organizational and Social Psychology",
        "Sociology & Anthropology",
        "Social Work and Social Administration",
        "Political Science and Public Administration",
    ],
    CoNAS: [
        "Physics",
        "Chemistry",
        "Geology and Petroleum Studies",
        "Mathematics",
        "Plant Sciences, Microbiology and Biotechnology",
        "Biochemistry and Sports Science",
        "Zoology, Entomology and Fisheries Sciences",
    ],
    CoVAB: [
        "Bio-security, Biotechnical and Laboratory Sciences",
        "Veterinary and Animal Resources",
    ],
    Law: [
        "Law and Jurisprudence",
        "Public Law",
        "Commercial Law",
        "Environmental Law",
        "Human Rights and Peace Centre",
    ],
};


const LecturerRegister = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [coursesTaught, setCoursesTaught] = useState([]);
    const [college, setCollege] = useState("");
    const [department, setDepartment] = useState("");
    const [message, setMessage] = useState("");
    const [csrfToken, setCsrfToken] = useState(''); // Add state for CSRF token
    const navigate = useNavigate();
    const toast = useToast(); // Initialize useToast

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
                console.log("CSRF Token fetched for Lecturer Register:", data.csrfToken);
            } catch (error) {
                console.error("Error fetching CSRF token for Lecturer Register:", error);
                toast({
                    title: 'Error.',
                    description: "Failed to load security token for registration. Please refresh the page.",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchCsrfToken();
    }, [toast]); // Depend on toast

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages

        if (!email || !password || !fullName || !coursesTaught.length || !college || !department) {
            setMessage("Please fill in all fields.");
            toast({
                title: 'Validation Error.',
                description: "Please fill in all required fields.",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!csrfToken) {
            setMessage("CSRF token not available. Please refresh the page.");
            toast({
                title: 'Error.',
                description: "CSRF token not available. Please refresh the page.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        const username = email;

        const payload = {
            email,
            username,
            password,
            fullName,
            courses_taught: coursesTaught,
            college,
            department,
            role: "lecturer"
        };

        console.log("Sending registration data:", JSON.stringify(payload));

        try {
            const response = await fetch(`${BASE_URL}/api/lecturer/register/`, { // Use BASE_URL
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken, // Include CSRF token
                },
                body: JSON.stringify(payload),
                credentials: 'include', // Important for sending cookies (CSRF token)
            });

            console.log("Response status:", response.status);

            if (response.ok) {
                // No need to store token here, just indicate success and redirect to login
                // const data = await response.json(); // If you need to read response data after successful registration
                // REMOVE: localStorage.setItem("token", data.access);
                // REMOVE: console.log("Stored token:", localStorage.getItem('token'));

                toast({
                    title: "Registration successful!",
                    description: "You can now log in with your credentials.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setMessage("Registration successful! Please log in.");
                navigate("/lecturer-login"); // Redirect to lecturer login page
            } else {
                const errorData = await response.json();
                console.error("Registration error:", errorData);
                setMessage(errorData.error || errorData.detail || "Registration failed, please try again.");
                toast({
                    title: 'Registration Failed.',
                    description: errorData.error || errorData.detail || "Please try again.",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            setMessage("Error connecting to the server.");
            console.error("Fetch error:", error);
            toast({
                title: 'Network Error.',
                description: "Failed to connect to the server. Please check your internet connection.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box minH="100vh" bg="green.500" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Box flex="1" maxW="md" mx="auto" p={6} borderRadius="md" boxShadow="md" bg="white" my={10}>
                <VStack spacing={4} align="stretch">
                    <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                        Lecturer Registration
                    </Text>
                    {message && <Text color={message.includes("successful") ? "green.500" : "red.500"} textAlign="center">{message}</Text>}
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4} align="stretch">
                            <FormControl isRequired>
                                <FormLabel>Full Name</FormLabel>
                                <Input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name"
                                />
                            </FormControl>

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

                            <FormControl isRequired>
                                <FormLabel>Courses Taught (comma-separated)</FormLabel>
                                <Input
                                    type="text"
                                    value={coursesTaught.join(", ")}
                                    onChange={(e) => setCoursesTaught(e.target.value.split(",").map(course => course.trim()))}
                                    placeholder="Enter courses, separated by commas"
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>College</FormLabel>
                                <Select
                                    onChange={(e) => {
                                        setCollege(e.target.value);
                                        setDepartment("");
                                    }}
                                    value={college}
                                >
                                    <option value="">Select College</option>
                                    {Object.keys(collegeDepartments).map((key) => (
                                        <option key={key} value={key}>{key}</option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Department</FormLabel>
                                <Select
                                    onChange={(e) => setDepartment(e.target.value)}
                                    value={department}
                                    disabled={!college}
                                >
                                    <option value="">Select Department</option>
                                    {college && collegeDepartments[college]?.map((dept) => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </Select>
                            </FormControl>

                            <Button colorScheme="blue" type="submit" width="full" mt={4}>
                                Register
                            </Button>
                        </VStack>
                    </form>
                    <Text textAlign="center">
                        Already have an account?{" "}
                        <Button
                            variant="link"
                            color="blue.500"
                            onClick={() => navigate("/lecturer-login")}
                        >
                            Log in here
                        </Button>
                    </Text>
                </VStack>
            </Box>
            <Footer userRole="lecturer" />
        </Box>
    );
};

export default LecturerRegister;
