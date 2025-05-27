import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider, Box, Spinner, Text  } from "@chakra-ui/react";
import { fetchCSRFToken } from './utils/csrf'; // Assuming this correctly fetches and sets cookie/global var

// Import your components
import LecturerRegister from "./LecturerRegister";
import StudentLogin from "./student_login";
import AboutUs from './components/AboutUs';
import Home from "./home";
import Register from "./routes/register"; // Student Register
import LecturerLogin from "./Login"; // This is likely LecturerLogin based on its usage
import IssueSubmissionForm from './components/IssueSubmissionForm';
import DashboardContainer from './components/DashboardContainer'; // Student Dashboard main container
import IssueData from './routes/IssueData'; // Likely issue details view
import LecturerDashboard from "./LecturerDashboard";
import AcademicRegistrar from './AcademicRegistrar'; // Registrar Dashboard
import RegistrarLogin from './RegistrarLogin';
import RegistrarSignup from './RegistrarSignup';

// Enhanced ProtectedRoute with role-based access
const ProtectedRoute = ({ children, allowedRoles = [], accessToken, userRole }) => {
    // console.log('ProtectedRoute - Token (from props):', accessToken ? 'Exists' : 'None'); // Log existence, not full token
    // console.log('ProtectedRoute - Role (from props):', userRole);
    // console.log('ProtectedRoute - Allowed Roles:', allowedRoles);

    // Check if user is authenticated
    if (!accessToken) {
        console.log('No access token found in state, redirecting to home (login)');
        return <Navigate to="/" replace />; // Redirect to general home/login page
    }

    // If roles are specified, check if user role is allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        console.log(`Role ${userRole} not allowed, redirecting to home (login)`);
        // Maybe a more specific "unauthorized" page or redirect to their specific dashboard if they have one?
        return <Navigate to="/" replace />;
    }

    return children;
};

// Role-specific protected routes
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
    // Initialize state from localStorage once, or null if not found
    // This initial render will be quick, and then useEffect handles persistent state
    const [accessToken, setAccessToken] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // New loading state for auth

    // Function to update auth state (and localStorage)
   const handleLoginSuccess = useCallback((access, refresh, role, id = null, name = null) => { // Add default values
    console.log("handleLoginSuccess called:", { access, refresh, role, id, name });

    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user_role', role);

    // Only set user_id and username if they are provided (not null/undefined)
    if (id !== null && id !== undefined) {
        localStorage.setItem('user_id', id);
        setUserId(id);
    } else {
        localStorage.removeItem('user_id'); // Clear if not provided
        setUserId(null); // Set state to null
    }

    if (name !== null && name !== undefined) {
        localStorage.setItem('username', name);
        setUsername(name);
    } else {
        localStorage.removeItem('username'); // Clear if not provided
        setUsername(null); // Set state to null
    }

    setAccessToken(access);
    setUserRole(role);
    // setUserId and setUsername are handled within the if blocks above
}, []);


    // Render a loading spinner or null while authentication state is being loaded
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
                    {/* Pass the handleLoginSuccess function and current auth state to login components */}
                    <Route
                        path="/student/login"
                        element={<StudentLogin
                            onLoginSuccess={handleLoginSuccess}
                            currentAccessToken={accessToken}
                            currentUserRole={userRole}
                        />}
                    />
                    {/* Student Register: NO onRegisterSuccess. It should redirect to login. */}
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
                    <Route
                        path="/lecturer/login"
                        element={<LecturerLogin
                            onLoginSuccess={handleLoginSuccess}
                            currentAccessToken={accessToken}
                            currentUserRole={userRole}
                        />}
                    />
                    {/* Lecturer Register: NO onRegisterSuccess. It should redirect to login. */}
                    <Route path="/lecturer-register" element={<LecturerRegister />} />
                    <Route path="/lecturer-dashboard" element={
                        <LecturerProtectedRoute accessToken={accessToken} userRole={userRole}>
                            <LecturerDashboard />
                        </LecturerProtectedRoute>
                    } />

                    {/* Registrar Routes */}
                    <Route
                        path="/registrar-login"
                        element={<RegistrarLogin
                            onLoginSuccess={handleLoginSuccess}
                            currentAccessToken={accessToken}
                            currentUserRole={userRole}
                        />}
                    />
                    {/* Registrar Signup: NO onRegisterSuccess. It should redirect to login. */}
                    <Route path="/registrar-signup" element={<RegistrarSignup />} />
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

                    {/* Catch all route - redirects to home if no other route matches */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ChakraProvider>
    );
};

export default App;
