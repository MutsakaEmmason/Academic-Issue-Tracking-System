import React from "react";
import LecturerLogin from "./Login";
import StudentLogin from "./student_login";
import Home from "./home";
import IssueSubmissionForm from './components/IssueSubmissionForm';
import DashboardContainer from './components/DashboardContainer';
import IssueData from './routes/IssueData';  
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Register from "./routes/register";
import LecturerDashboard from "./LecturerDashboard";
import AcademicRegistrar from './AcademicRegistrar';
import RegistrarLogin from './RegistrarLogin';
import AboutUs from "./components/AboutUs";

import LecturerRegister from './LecturerRegister'; // Import LecturerRegister component




// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/student/login\" replace />;
    }
    return children;
};

const App = () => {
    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/student/login" element={<StudentLogin />} />
                    <Route path="/login" element={<Navigate to="/student/login" replace />} />
                    <Route path="/registrar-login" element={<RegistrarLogin />} />

                    {/* Protected Routes */}
                    <Route path="/student-dashboard" element={
                        <ProtectedRoute>
                            <DashboardContainer />
                        </ProtectedRoute>
                    } />
                    <Route path="/issue-submission" element={<IssueSubmissionForm />} />
                    <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />

                    {/* Lecturer Register Route */}
                    <Route path="/lecturer-register" element={<LecturerRegister />} /> {/* Add the route for Lecturer Register */}

                    {/* Other Routes */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/academic-registrar" element={<AcademicRegistrar />} />


                    <Route path="/registrar-login" element={<RegistrarLogin />} />


                    <Route path="/registrar-login" element={<RegistrarLogin />} />
                    <Route path="/about" element={<AboutUs />} />
                    
                    <Route path="/issue/:issueId" element={
                        <ProtectedRoute>
                            <IssueData />
                        </ProtectedRoute>
                    } />

                    <Route path="/lecturer/login" element={<LecturerLogin />} />

                </Routes>
            </Router>
        </ChakraProvider>
    );
};

export default App;
