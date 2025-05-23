import { useState } from "react";
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

    const navigate = useNavigate();
    const toast = useToast();

    const handleStudentRegistration = () => {
        let formErrors = {};

        if (!fullName) formErrors.fullName = "Full Name is required";
        if (!email) formErrors.email = "Email is required";
        if (!studentRegNumber) formErrors.studentRegNumber = "Registration Number is required";
        if (!yearOfStudy) formErrors.yearOfStudy = "Year of Study is required";
        if (!password) formErrors.password = "Password is required";
        if (!confirmPassword) formErrors.confirmPassword = "Confirm Password is required";
        if (!college) formErrors.college = "College is required";
        if (!department) formErrors.department = "Department is required";

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

        // Get CSRF token  EMMASON2025
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    
    const csrftoken = getCookie('csrftoken');

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

        console.log("Sending registration data:", JSON.stringify(registrationData)); // Log data before fetch

         // Use absolute URL for deployed environment
       const apiUrl = process.env.NODE_ENV === 'production' 
         ? 'https://academic-issue-tracking-system-1-8cyq.onrender.com/api/register/'
         : '/api/register/';

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            credentials: 'include', // Important for cookies
            body: JSON.stringify(registrationData),
        })
            .then(response => {
                console.log("Response status:", response.status); // Log response status

                if (!response.ok) {
                    return response.json().then(data => {
                        console.error("Backend error:", data); // Log backend error response
                        throw new Error(data.detail || 'Registration failed');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Registration successful:", data); // Log successful response
                localStorage.setItem('token', data.access);
                toast({
                    title: 'Registration successful.',
                    description: "You've successfully registered.",
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
