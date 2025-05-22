import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from 'react';
import { fetchCSRFToken } from './utils/csrf';
 


import LecturerRegister from "./LecturerRegister"; // Import the missing component
import StudentLogin from "./student_login";

import AboutUs from './components/AboutUs';
import Home from "./home";
import Register from "./routes/register"
import LecturerLogin from "./Login";


import IssueSubmissionForm from './components/IssueSubmissionForm';
import DashboardContainer from './components/DashboardContainer';
import IssueData from './routes/IssueData';
import LecturerDashboard from "./LecturerDashboard";
import AcademicRegistrar from './AcademicRegistrar';
import RegistrarLogin from './RegistrarLogin';
import RegistrarSignup from './RegistrarSignup';  // New signup component

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/student/login" replace />;
    }
    return children;
};

const App = () => {
  useEffect(() => {
    fetchCSRFToken();
  }, []);
    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/student-dashboard" element={
                        <ProtectedRoute>
                            <DashboardContainer />
                        </ProtectedRoute>
                    } />
                    <Route path="/issue-submission" element={<IssueSubmissionForm />} />
                    <Route path="/student/login" element={<StudentLogin />} />

                    <Route path="/login" element={<Navigate to="/student/login" replace />} />
                    
                    {/* Lecturer Routes */}


                    <Route path="/lecturer/login" element={<LecturerLogin />} />
                    <Route path="/lecturer-register" element={<LecturerRegister />} /> {/* Added this line */}
                    <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />

                    {/* Other Routes */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/academic-registrar" element={<AcademicRegistrar />} />

                   

                    
                    {/* Registrar Routes */}
                    <Route path="/registrar-login" element={<RegistrarLogin />} />
                    <Route path="/registrar-signup" element={<RegistrarSignup />} />  
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/issue/:issueId" element={
                        <ProtectedRoute>
                            <IssueData />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </ChakraProvider>
    );
};

export default App;
