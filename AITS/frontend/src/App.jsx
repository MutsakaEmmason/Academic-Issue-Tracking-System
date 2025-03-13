// src/App.jsx
import React from "react";
import LecturerLogin from "./Login";
import StudentLogin from "./student_login";
import Home from "./home";
import IssueSubmissionForm from './components/IssueSubmissionForm'; // Import IssueSubmissionForm

import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";
import Register from "./routes/register";
import LecturerDashboard from "./LecturerDashboard"
import StudentDashboard from './routes/StudentDashboard';
import AcademicRegistrar from './AcademicRegistrar';
import RegistrarLogin from './RegistrarLogin'


const App = () => {
    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/student-dashboard" element={<StudentDashboard studentName="John Doe" isAuthenticated={true} />} /> 
                    <Route path="/issue-submission" element={<IssueSubmissionForm />} /> // Ensure this route is present
                    <Route path="/student/login" element={<StudentLogin />} />
                    <Route path="/lecturer/login" element={<LecturerLogin />} />
                    <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/academic-registrar" element={<AcademicRegistrar />} />
                    <Route path="/registrar-login" element={<RegistrarLogin />} />
                    
                </Routes>
            </Router>
        </ChakraProvider>
    );
};



export default App;
