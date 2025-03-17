import React from "react";
import LecturerLogin from "./Login";
import StudentLogin from "./student_login";
import Home from "./home";
import IssueSubmissionForm from './components/IssueSubmissionForm';
import DashboardContainer from './components/DashboardContainer';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Register from "./routes/register";
import LecturerDashboard from "./LecturerDashboard"
import AcademicRegistrar from './AcademicRegistrar';
import RegistrarLogin from './RegistrarLogin'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/student/login" replace />;
    }
    return children;
};

const App = () => {
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