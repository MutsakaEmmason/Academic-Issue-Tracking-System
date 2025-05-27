import React, { useEffect, useState } from "react"; // Import useState
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { fetchCSRFToken } from './utils/csrf';

// Import your components
import LecturerRegister from "./LecturerRegister";
import StudentLogin from "./student_login";
import AboutUs from './components/AboutUs';
import Home from "./home";
import Register from "./routes/register"; // Make sure this path is correct based on your file structure
import LecturerLogin from "./Login";
import IssueSubmissionForm from './components/IssueSubmissionForm';
import DashboardContainer from './components/DashboardContainer';
import IssueData from './routes/IssueData';
import LecturerDashboard from "./LecturerDashboard";
import AcademicRegistrar from './AcademicRegistrar';
import RegistrarLogin from './RegistrarLogin';
import RegistrarSignup from './RegistrarSignup';

// Enhanced ProtectedRoute with role-based access
// This component will now receive the accessToken and userRole as props
const ProtectedRoute = ({ children, allowedRoles = [], accessToken, userRole }) => {
    console.log('ProtectedRoute - Token (from props):', accessToken);
    console.log('ProtectedRoute - Role (from props):', userRole);
    console.log('ProtectedRoute - Allowed Roles:', allowedRoles);

    // Check if user is authenticated
    if (!accessToken) {
        console.log('No access token found in state, redirecting to home');
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
// These will pass the authentication state down to the generic ProtectedRoute
const StudentProtectedRoute = ({ children, accessToken, userRole }) => (
    <ProtectedRoute accessToken={accessToken} userRole={userRole} allowedRoles={['student']}>
        {children}
    </ProtectedRoute>
);

const LecturerProtectedRoute = ({ children, accessToken, userRole }) => (
    <ProtectedRoute accessToken={accessToken} userRole={userRole} allowedRoles={['lecturer']}>
        {children}
    </ProtectedRoute>
);

const RegistrarProtectedRoute = ({ children, accessToken, userRole }) => (
    <ProtectedRoute accessToken={accessToken} userRole={userRole} allowedRoles={['registrar']}>
        {children}
    </ProtectedRoute>
);


const App = () => {
    // State to hold authentication info, initialized from localStorage
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('user_role'));

    // Function to update auth state (and localStorage)
    const handleLoginSuccess = (access, refresh, role, userId, username) => {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user_role', role);
        localStorage.setItem('user_id', userId); // Ensure you store this in Register as well
        localStorage.setItem('username', username); // Ensure you store this in Register as well

        setAccessToken(access);
        setUserRole(role);
        // No need to set userId or username in state here if not used for routing logic in App
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');

        setAccessToken(null);
        setUserRole(null);
    };


    useEffect(() => {
        // Initial fetch for CSRF token
        fetchCSRFToken();

        // Optional: Add an event listener for localStorage changes
        // This is useful if auth state can be changed from other tabs/windows
        const handleStorageChange = () => {
            setAccessToken(localStorage.getItem('access_token'));
            setUserRole(localStorage.getItem('user_role'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* Student Routes */}
                    {/* Pass the handleLoginSuccess function to StudentLogin and Register */}
                    <Route path="/student/login" element={<StudentLogin onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/register" element={<Register onRegisterSuccess={handleLoginSuccess} />} /> {/* Use onRegisterSuccess here */}

                    <Route path="/student-dashboard/*" element={
                        <StudentProtectedRoute accessToken={accessToken} userRole={userRole}>
                            <DashboardContainer />
                        </StudentProtectedRoute>
                    } />
                    <Route path="/issue-submission" element={
                        <StudentProtectedRoute accessToken={accessToken} userRole={userRole}>
                            <IssueSubmissionForm />
                        </StudentProtectedRoute>
                    } />

                    {/* Lecturer Routes */}
                    <Route path="/lecturer/login" element={<LecturerLogin onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/lecturer-register" element={<LecturerRegister onRegisterSuccess={handleLoginSuccess} />} />
                    <Route path="/lecturer-dashboard" element={
                        <LecturerProtectedRoute accessToken={accessToken} userRole={userRole}>
                            <LecturerDashboard />
                        </LecturerProtectedRoute>
                    } />

                    {/* Registrar Routes */}
                    <Route path="/registrar-login" element={<RegistrarLogin onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/registrar-signup" element={<RegistrarSignup onRegisterSuccess={handleLoginSuccess} />} />
                    <Route path="/academic-registrar" element={
                        <RegistrarProtectedRoute accessToken={accessToken} userRole={userRole}>
                            <AcademicRegistrar />
                        </RegistrarProtectedRoute>
                    } />

                    {/* Generic Routes */}
                    <Route path="/login" element={<Navigate to="/student/login" replace />} />
                    <Route path="/about" element={<AboutUs />} />

                    {/* Issue Details - Protected for all authenticated users */}
                    <Route path="/issue/:issueId" element={
                        <ProtectedRoute accessToken={accessToken} userRole={userRole} allowedRoles={['student', 'lecturer', 'registrar']}>
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
