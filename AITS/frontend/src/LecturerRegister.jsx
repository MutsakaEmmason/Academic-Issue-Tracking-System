import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Button, FormControl, FormLabel, Input, 
  VStack, Text, Select, FormHelperText 
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
  const [courses_taught, setCoursesTaught] = useState([]);

  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !fullName || !courses_taught || !college || !department) {
      setMessage("Please fill in all fields");
      return;
    }

    // Set username to be the same as email
    const username = email;

    console.log("Sending registration data:", { email, username, password, fullName, courses_taught, college, department });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/lecturer/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          username, 
          password, 
          fullName, 
          courses_taught: Array.isArray(courses_taught) ? courses_taught : [courses_taught], // Ensure it's an array
          college, 
          department,
           role: "lecturer"

        }),
        
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        setMessage("Registration successful! Redirecting to dashboard...");
        navigate("/lecturer-dashboard");
      } else {
        const data = await response.json();
        setMessage(data.error || "Registration failed, please try again.");
        console.error("Registration error:", data);
      }
    } catch (error) {
      setMessage("Error connecting to the server");
      console.error("Fetch error:", error);
    }
  };

  return (
    <Box maxW="md" mx="auto" p={4} borderRadius="md" boxShadow="md" bg="white">
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Lecturer Register
        </Text>
        {message && <Text color="red.500" textAlign="center">{message}</Text>}
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
                  value={courses_taught.join(", ")} // Convert array to string for display
                  onChange={(e) => setCoursesTaught(e.target.value.split(",").map(course => course.trim()))} // Convert input to an array
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
      </VStack>
    </Box>
  );
};

export default LecturerRegister;
