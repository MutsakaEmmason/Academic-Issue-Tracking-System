import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"; // Import useLocation
import { ChakraProvider } from "@chakra-ui/react";


import { fetchCSRFToken } from './utils/csrf';

// Import your components
import LecturerRegister from "./LecturerRegister";
import StudentLogin from "./student_login";
import AboutUs from './components/AboutUs';
import Home from "./home";
import Register from "./routes/register";
import LecturerLogin from "./Login"; // Assuming this is your Lecturer Login component



import IssueSubmissionForm from './components/IssueSubmissionForm';
import DashboardContainer from './components/DashboardContainer'; // Student Dashboard
import IssueData from './routes/IssueData';
import LecturerDashboard from "./LecturerDashboard";
import AcademicRegistrar from './AcademicRegistrar'; // Registrar Dashboard
import RegistrarLogin from './RegistrarLogin';
import RegistrarSignup from './RegistrarSignup';

const ProtectedRoute = ({ children }) => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        return <Navigate to="/" replace />;
    }

    return children;
};
const App = () => {
    // This useEffect is likely for CSRF token fetching.
    // Ensure `WorkspaceCSRFToken` uses the BASE_URL.
    useEffect(() => {
        fetchCSRFToken();
    }, []);

    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* Student Routes */}
                    <Route path="/student-dashboard" element={
                        <ProtectedRoute>
                            <DashboardContainer />
                        </ProtectedRoute>
                    } />
                    <Route path="/issue-submission" element={<IssueSubmissionForm />} /> {/* This might need to be protected too */}
                    <Route path="/student/login" element={<StudentLogin />} />

                    {/* Generic /login redirect to student login */}
                    <Route path="/login" element={<Navigate to="/student/login" replace />} />

                    {/* Lecturer Routes */}
                    <Route path="/lecturer/login" element={<LecturerLogin />} />
                    <Route path="/lecturer-register" element={<LecturerRegister />} />
                    <Route path="/lecturer-dashboard" element={
                        <ProtectedRoute> {/* Protect Lecturer Dashboard */}
                            <LecturerDashboard />
                        </ProtectedRoute>
                    } />

                    {/* Registrar Routes */}
                    <Route path="/academic-registrar" element={
                        <ProtectedRoute> {/* Protect Registrar Dashboard */}
                            <AcademicRegistrar />
                        </ProtectedRoute>
                    } />
                    <Route path="/registrar-login" element={<RegistrarLogin />} />
                    <Route path="/registrar-signup" element={<RegistrarSignup />} />

                    {/* Other Routes */}
                    <Route path="/register" element={<Register />} /> {/* Generic registration? */}
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/issue/:issueId" element={
                        <ProtectedRoute> {/* Protect individual issue details */}
                            <IssueData />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </ChakraProvider>
    );
};

export default App;
