import { useState } from "react";
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
} from "@chakra-ui/react";

const Register = () => {
  const [studentRegNumber, setStudentRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState(""); // Corrected variable name
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");

  const handleStudentRegistration = () => {
    // Implement your registration logic here
    console.log({
      studentRegNumber,
      password,
      fullName,
      email,
      college, // Corrected variable name
      department,
      yearOfStudy,
    });
    // You would typically send this data to your backend API
  };

  return (
    <VStack spacing={6} p={8} align="center">
      <Image
        src="https://i.pinimg.com/736x/7f/30/aa/7f30aaf443ebbf9059c21d6c7f745433.jpg"
        alt="Makerere University Logo"
        boxSize="100px"
      />

      <Heading size="lg">Student Registration</Heading>

      <Text textAlign="center" color="gray.600">
        Register to access the Academic Issue Tracking System.
      </Text>

      <Text textAlign="center" color="blue.500">
        <a href="https://reactjs.org/link/switch-to-createroot" target="_blank" rel="noopener noreferrer">
          Learn about switching to createRoot
        </a>
      </Text>

      <Box w="100%" maxW="400px">
        <FormControl>
          <FormLabel>Full Name</FormLabel>
          <Input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
          />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Student Reg Number</FormLabel>
          <Input
            onChange={(e) => setStudentRegNumber(e.target.value)}
            value={studentRegNumber}
            type="text"
          />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Email</FormLabel>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
          />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Password</FormLabel>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
          />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>College</FormLabel>
          <Select
            onChange={(e) => setCollege(e.target.value)} // Corrected setter
            value={college} // Corrected value.
          >
            <option value="">Select College</option>
            <option value="CAES">
              College of Agricultural and Environmental Sciences (CAES)
            </option>
            <option value="CoBAMS">
              College of Business and Management Sciences (CoBAMS)
            </option>
            <option value="CoCIS">
              College of Computing and Information Sciences (CoCIS)
            </option>
            <option value="CEES">
              College of Education and External Studies (CEES)
            </option>
            <option value="CEDAT">
              College of Engineering, Design, Art and Technology (CEDAT)
            </option>
            <option value="CHS">College of Health Sciences (CHS)</option>
            <option value="CHUSS">
              College of Humanities and Social Sciences (CHUSS)
            </option>
            <option value="CoNAS">College of Natural Sciences (CoNAS)</option>
            <option value="COVAB">
              College of Veterinary Medicine, Animal Resources and Bio-security
              (COVAB)
            </option>
            <option value="Law">School of Law</option>
          </Select>
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Department</FormLabel>
          <Select
            onChange={(e) => setDepartment(e.target.value)}
            value={department}
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Literature">Literature</option>
            {/* Add more departments as needed */}
          </Select>
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Year of Study</FormLabel>
          <Select
            onChange={(e) => setYearOfStudy(e.target.value)}
            value={yearOfStudy}
          >
            <option value="">Select Year</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </Select>
        </FormControl>

        <Button
          onClick={handleStudentRegistration}
          colorScheme="blue"
          mt={6}
          w="100%"
        >
          Register
        </Button>
      </Box>
    </VStack>
  );
};

export default Register;