import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { fetchCSRFToken } from './utils/csrf';

// Import your components
import LecturerRegister from "./LecturerRegister";
import StudentLogin from "./student_login";
import AboutUs from './components/AboutUs';
import Home from "./home";
import Register from "./routes/register";
import LecturerLogin from "./Login";
import IssueSubmissionForm from './components/IssueSubmissionForm';
import DashboardContainer from './containers/DashboardContainer'; // Fix: Correct import path
import IssueData from './routes/IssueData';
import LecturerDashboard from "./LecturerDashboard";
import AcademicRegistrar from './AcademicRegistrar';
import RegistrarLogin from './RegistrarLogin';
import RegistrarSignup from './RegistrarSignup';

// Enhanced ProtectedRoute with role-based access
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const accessToken = localStorage.getItem('access_token'); // Fix: Use correct key
    const userRole = localStorage.getItem('user_role');
    
    console.log('ProtectedRoute - Token:', accessToken);
    console.log('ProtectedRoute - Role:', userRole);
    console.log('ProtectedRoute - Allowed Roles:', allowedRoles);
    
    // Check if user is authenticated
    if (!accessToken) {
        console.log('No access token found, redirecting to home');
        return <Navigate to="/" replace />;
    }
    
    // Check if user role is allowed (if roles are specified)
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        console.log(`Role ${userRole} not allowed, redirecting to home`);
        return <Navigate to="/" replace />;
    }
    
    return children;
};

// Role-specific protected routes
const StudentProtectedRoute = ({ children }) => (
    <ProtectedRoute allowedRoles={['student']}>
        {children}
    </ProtectedRoute>
);

const LecturerProtectedRoute = ({ children }) => (
    <ProtectedRoute allowedRoles={['lecturer']}>
        {children}
    </ProtectedRoute>
);

const RegistrarProtectedRoute = ({ children }) => (
    <ProtectedRoute allowedRoles={['registrar']}>
        {children}
    </ProtectedRoute>
);

const App = () => {
    useEffect(() => {
        fetchCSRFToken();
    }, []);

    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    
                    {/* Student Routes */}
                    <Route path="/student/login" element={<StudentLogin />} />
                    <Route path="/student-dashboard/*" element={
                        <StudentProtectedRoute>
                            <DashboardContainer />
                        </StudentProtectedRoute>
                    } />
                    <Route path="/issue-submission" element={
                        <StudentProtectedRoute>
                            <IssueSubmissionForm />
                        </StudentProtectedRoute>
                    } />
                    
                    {/* Lecturer Routes */}
                    <Route path="/lecturer/login" element={<LecturerLogin />} />
                    <Route path="/lecturer-register" element={<LecturerRegister />} />
                    <Route path="/lecturer-dashboard" element={
                        <LecturerProtectedRoute>
                            <LecturerDashboard />
                        </LecturerProtectedRoute>
                    } />
                    
                    {/* Registrar Routes */}
                    <Route path="/registrar-login" element={<RegistrarLogin />} />
                    <Route path="/registrar-signup" element={<RegistrarSignup />} />
                    <Route path="/academic-registrar" element={
                        <RegistrarProtectedRoute>
                            <AcademicRegistrar />
                        </RegistrarProtectedRoute>
                    } />
                    
                    {/* Generic Routes */}
                    <Route path="/login" element={<Navigate to="/student/login" replace />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/about" element={<AboutUs />} />
                    
                    {/* Issue Details - Protected for all authenticated users */}
                    <Route path="/issue/:issueId" element={
                        <ProtectedRoute allowedRoles={['student', 'lecturer', 'registrar']}>
                            <IssueData />
                        </ProtectedRoute>
                    } />
                    
                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ChakraProvider>
    );
};

export default App;
