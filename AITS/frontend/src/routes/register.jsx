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
    } from "@chakra-ui/react";
    
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
    
        const navigate = useNavigate();
    
        const handleStudentRegistration = () => {
            if (password !== confirmPassword) {
                setPasswordsMatch(false);
                return;
            }
    
            setPasswordsMatch(true);
            fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentRegNumber,
                    password,
                    fullName,
                    email,
                    college,
                    department,
                    yearOfStudy,
                }),
            })
            .then(response => response.json())
            .then(data => navigate("/StudentDashboard"))
            .catch(error => console.error('Error:', error));
        };
    
        return (
            <VStack spacing={6} p={8} align="center">
                <Image
                    src="https://i.pinimg.com/736x/7f/30/aa/7f30aaf443ebbf9059c21d6c7f745433.jpg"
                    alt="Makerere University Logo"
                    boxSize="100px"
                />
                <Heading size="lg">Student Registration</Heading>
                <Text textAlign="center" color="gray.600" fontWeight='extrabold'>
                    Welcome to the Academic Issue Tracking System.
                </Text>
            <Box w="100%" maxW="400px"> 


                    <FormControl mt={4}>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter Full Name"
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Student Registration Number</FormLabel>
                        <Input
                            type="text"
                            value={studentRegNumber}
                            onChange={(e) => setStudentRegNumber(e.target.value)}
                            placeholder="Enter Registration Number"
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Year of Study</FormLabel>
                        <Input
                            type="number"
                            value={yearOfStudy}
                            onChange={(e) => setYearOfStudy(e.target.value)}
                            placeholder="Enter Year of Study"
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Confirm Password</FormLabel>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                        />
                        {!passwordsMatch && <FormHelperText color="red">Passwords do not match</FormHelperText>}
                    </FormControl>
    
                    <FormControl mt={4}>
                        <FormLabel>College</FormLabel>
                        <Select onChange={(e) => { setCollege(e.target.value); setDepartment(""); }} value={college}>
                            <option value="">Select College</option>
                            {Object.keys(collegeDepartments).map((key) => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Department</FormLabel>
                        <Select onChange={(e) => setDepartment(e.target.value)} value={department} disabled={!college}>
                            <option value="">Select Department</option>
                            {college && collegeDepartments[college].map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </Select>
                    </FormControl>
                    <Text mt={4}>
                    Already have an account? <Link to="/student/login" style={{ color: 'blue' }}>Login here</Link>


                </Text>
                    <Button colorScheme="blue" mt={4} onClick={handleStudentRegistration}>
                        Register
                    </Button>
                </Box>
    
                
        </VStack> 


    ); 


    };
    
  

export default Register;
