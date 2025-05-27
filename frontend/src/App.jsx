import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider, Box, Spinner, Text } from "@chakra-ui/react";

// Component Imports
import LecturerRegister from "./LecturerRegister";
import StudentLogin from "./student_login";
import AboutUs from './components/AboutUs';
import Home from "./home";
import Register from "./routes/register";
import LecturerLogin from "./Login";
import IssueSubmissionForm from './components/IssueSubmissionForm';
import DashboardContainer from './components/DashboardContainer';
import IssueData from './routes/IssueData';
import LecturerDashboard from "./LecturerDashboard";
import AcademicRegistrar from './AcademicRegistrar';
import RegistrarLogin from './RegistrarLogin';
import RegistrarSignup from './RegistrarSignup';

// Protected Routes
const ProtectedRoute = ({ children, allowedRoles = [], accessToken, userRole }) => {
    console.log('ProtectedRoute evaluating:', { accessToken, userRole, allowedRoles });
    if (!accessToken) {
        console.log('Redirecting to / due to missing accessToken');
        return <Navigate to="/" replace />;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        console.log(`Redirecting to / due to invalid role. Expected: ${allowedRoles}, Got: ${userRole}`);
        return <Navigate to="/" replace />;
    }
    return children;
};

const StudentProtectedRoute = (props) => (
    <ProtectedRoute {...props} allowedRoles={['student']} />
);
const LecturerProtectedRoute = (props) => (
    <ProtectedRoute {...props} allowedRoles={['lecturer']} />
);
const RegistrarProtectedRoute = (props) => (
    <ProtectedRoute {...props} allowedRoles={['registrar']} />
);

const App = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    useEffect(() => {
        const loadAuthState = () => {
            const storedAccessToken = localStorage.getItem('access_token');
            const storedUserRole = localStorage.getItem('user_role');
            console.log('loadAuthState:', { storedAccessToken, storedUserRole });

            if (storedAccessToken && storedUserRole) {
                setAccessToken(storedAccessToken);
                setUserRole(storedUserRole);
            }
            setIsLoadingAuth(false);
        };
        loadAuthState();
    }, []);

    if (isLoadingAuth) {
        return (
            <ChakraProvider>
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Spinner size="xl" color="blue.500" />
                    <Text ml={3}>Loading authentication state...</Text>
                </Box>
            </ChakraProvider>
        );
    }

    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* Student Routes */}
                    <Route path="/student/login" element={
                        <StudentLogin setAccessToken={setAccessToken} setUserRole={setUserRole} />
                    } />
                    <Route path="/register" element={<Register />} />
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
                    <Route path="/lecturer/login" element={
                        <LecturerLogin setAccessToken={setAccessToken} setUserRole={setUserRole} />
                    } />
                    <Route path="/lecturer-register" element={<LecturerRegister />} />
                    <Route path="/lecturer-dashboard" element={
                        <LecturerProtectedRoute accessToken={accessToken} userRole={userRole}>
                            <LecturerDashboard />
                        </LecturerProtectedRoute>
                    } />

                    {/* Registrar Routes */}
                    <Route path="/registrar-login" element={
                        <RegistrarLogin setAccessToken={setAccessToken} setUserRole={setUserRole} />
                    } />
                    <Route path="/registrar-signup" element={<RegistrarSignup />} />
                    <Route path="/academic-registrar" element={
                        <RegistrarProtectedRoute accessToken={accessToken} userRole={userRole}>
                            <AcademicRegistrar />
                        </RegistrarProtectedRoute>
                    } />

                    {/* Shared/General */}
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/login" element={<Navigate to="/student/login" replace />} />

                    {/* Issue Details */}
                    <Route path="/issue/:issueId" element={
                        <ProtectedRoute accessToken={accessToken} userRole={userRole} allowedRoles={['student', 'lecturer', 'registrar']}>
                            <IssueData />
                        </ProtectedRoute>
                    } />

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ChakraProvider>
    );
};

export default App;
