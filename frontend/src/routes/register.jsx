import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    VStack,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Image,
    Heading,
    Box,
    Select,
    FormHelperText,
    useToast,
} from "@chakra-ui/react";
import Footer from '../components/Footer';
const BASE_URL = 'https://academic-issue-tracking-system-gbch.onrender.com';

const collegeDepartments = {
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

const Register = () => {
    const [studentRegNumber, setStudentRegNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [college, setCollege] = useState("");
    const [department, setDepartment] = useState("");
    const [yearOfStudy, setYearOfStudy] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [errors, setErrors] = useState({});
    const [csrfToken, setCsrfToken] = useState('');

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/csrf-token/`, { credentials: 'include' });
                if (!response.ok) {
                    throw new Error(`Failed to fetch CSRF token: ${response.statusText}`);
                }
                const data = await response.json();
                setCsrfToken(data.csrfToken);
                console.log("CSRF Token fetched:", data.csrfToken);
            } catch (error) {
                console.error("Error fetching CSRF token:", error);
                toast({
                    title: 'Error.',
                    description: "Failed to load security token. Please refresh the page.",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };
        fetchCsrfToken();
    }, []);

    const handleStudentRegistration = () => {
        let formErrors = {};
        // ... (your existing validation logic)

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        if (password !== confirmPassword) {
            setPasswordsMatch(false);
            return;
        }

        setPasswordsMatch(true);
        setErrors({});

        if (!csrfToken) {
            toast({
                title: 'Error.',
                description: "Security token not available. Please try again or refresh.",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const registrationData = {
            username: studentRegNumber,
            password,
            fullName,
            email,
            college,
            department,
            studentRegNumber,
            yearOfStudy,
            role: "student",
        };

        console.log("Sending registration data:", JSON.stringify(registrationData));

        fetch(`${BASE_URL}/api/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(registrationData),
            credentials: 'include',
        })
        .then(response => {
            console.log("Response status:", response.status);
            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json().then(data => {
                        console.error("Backend error (JSON):", data);
                        throw new Error(data.detail || JSON.stringify(data) || 'Registration failed');
                    });
                } else {
                    return response.text().then(text => {
                        console.error("Backend error (Text/HTML):", text);
                        throw new Error(`Registration failed: ${response.status} - ${response.statusText}. Please check the server response for details. Raw: ${text.substring(0, 100)}...`);
                    });
                }
            }
            return response.json();
        })
        .then(data => {
            console.log("Registration successful:", data);

            // Call the prop function to update the parent's state
            if (onRegisterSuccess) {
                onRegisterSuccess(data.access, data.refresh, data.role, data.user_id, data.username);
            }

            toast({
                title: 'Registration successful.',
                description: "You have been registered and logged in.",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            navigate("/student-dashboard");
        })
        .catch(error => {
            console.error('Error:', error);
            toast({
                title: 'Registration failed.',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        });
    };

    return (
        <Box
            minHeight="100vh"
            bg="green.500"
            display="flex"
            flexDirection="column"
            alignItems="stretch"
        >
            <Box flex="1" display="flex" justifyContent="center" alignItems="center">
                <VStack
                    spacing={6}
                    p={8}
                    align="center"
                    bg="rgba(255, 255, 255, 0.8)"
                    borderRadius="lg"
                    boxShadow="lg"
                    maxWidth="400px"
                >
                    <Image
                        src="https://i.pinimg.com/736x/7f/30/aa/7f30aaf443ebbf9059c21d6c7f745433.jpg"
                        alt="Makerere University Logo"
                        boxSize="100px"
                    />
                    <Heading size="lg">Student Registration</Heading>
                    <Text textAlign="center" color="gray.600" fontWeight="extrabold">
                        Welcome to the Academic Issue Tracking System.
                    </Text>
                    <Box w="100%" maxW="400px">
                        {/* Full Name */}
                        <FormControl mt={4} isInvalid={errors.fullName}>
                            <FormLabel>Full Name</FormLabel>
                            <Input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter Full Name"
                                bg="white" // Added white background
                                border="1px solid #ccc" // Added border
                                color="black" // Added text color
                            />
                            {errors.fullName && <FormHelperText color="red">{errors.fullName}</FormHelperText>}
                        </FormControl>

                        {/* Email */}
                        <FormControl mt={4} isInvalid={errors.email}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Email (e.g., example@gmail.com)"
                                bg="white" // Added white background
                                border="1px solid #ccc" // Added border
                                color="black" // Added text color
                            />
                            {errors.email && <FormHelperText color="red">{errors.email}</FormHelperText>}
                        </FormControl>

                        {/* Registration Number */}
                        <FormControl mt={4} isInvalid={errors.studentRegNumber}>
                            <FormLabel>Student Number</FormLabel>
                            <Input
                                type="text"
                                value={studentRegNumber}
                                onChange={(e) => setStudentRegNumber(e.target.value)}
                                placeholder="Enter StudentNumber"
                                bg="white" // Added white background
                                border="1px solid #ccc" // Added border
                                color="black" // Added text color
                            />
                            {errors.studentRegNumber && <FormHelperText color="red">{errors.studentRegNumber}</FormHelperText>}
                        </FormControl>

                        {/* Year of Study */}
                        <FormControl mt={4} isInvalid={errors.yearOfStudy}>
                            <FormLabel>Year of Study</FormLabel>
                            <Select
                                value={yearOfStudy}
                                onChange={(e) => setYearOfStudy(e.target.value)}
                                placeholder="Select Year of Study"
                                bg="white" // Added white background
                                border="1px solid #ccc" // Added border
                                color="black" // Added text color
                            >
                                <option value="1">Year 1</option>
                                <option value="2">Year 2</option>
                                <option value="3">Year 3</option>
                                <option value="4">Year 4</option>
                                <option value="5">Year 5</option>
                                <option value="6">Year 6</option>
                            </Select>
                            {errors.yearOfStudy && <FormHelperText color="red">{errors.yearOfStudy}</FormHelperText>}
                        </FormControl>

                        {/* Password */}
                        <FormControl mt={4} isInvalid={errors.password}>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Password"
                                bg="white" // Added white background
                                border="1px solid #ccc" // Added border
                                color="black" // Added text color
                            />
                            {errors.password && <FormHelperText color="red">{errors.password}</FormHelperText>}
                        </FormControl>

                        {/* Confirm Password */}
                        <FormControl mt={4} isInvalid={errors.confirmPassword}>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                bg="white" // Added white background
                                border="1px solid #ccc" // Added border
                                color="black" // Added text color
                            />
                            {!passwordsMatch && <FormHelperText color="red">Passwords do not match</FormHelperText>}
                        </FormControl>

                        {/* College Selection */}
                        <FormControl mt={4} isInvalid={errors.college}>
                            <FormLabel>College</FormLabel>
                            <Select
                                onChange={(e) => {
                                    setCollege(e.target.value);
                                    setDepartment("");
                                }}
                                value={college}
                                bg="white" // Added white background
                                border="1px solid #ccc" // Added border
                                color="black" // Added text color
                            >
                                <option value="">Select College</option>
                                {Object.keys(collegeDepartments).map((key) => (
                                    <option key={key} value={key}>{key}</option>
                                ))}
                            </Select>
                            {errors.college && <FormHelperText color="red">{errors.college}</FormHelperText>}
                        </FormControl>

                        {/* Department Selection */}
                        <FormControl mt={4} isInvalid={errors.department}>
                            <FormLabel>Department</FormLabel>
                            <Select
                                onChange={(e) => setDepartment(e.target.value)}
                                value={department}
                                disabled={!college}
                                bg="white" // Added white background
                                border="1px solid #ccc" // Added border
                                color="black" // Added text color
                            >
                                <option value="">Select Department</option>
                                {college && collegeDepartments[college]?.map((dept) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </Select>
                            {errors.department && <FormHelperText color="red">{errors.department}</FormHelperText>}
                        </FormControl>

                        {/* Login Link */}
                        <Text mt={4}>
                            Already have an account? <Link to="/student/login" style={{ color: 'blue' }}>Login here</Link>
                        </Text>

                        {/* Submit Button */}
                        <Button colorScheme="blue" mt={4} onClick={handleStudentRegistration}>
                            Register
                        </Button>
                    </Box>
                </VStack>
            </Box>
            <Box width="100%">
                <Footer userRole="student" />
            </Box>
        </Box>
    );
};
    
  

export default Register;
