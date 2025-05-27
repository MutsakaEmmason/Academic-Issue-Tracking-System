import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { Flex, Spinner } from '@chakra-ui/react'; // Add missing imports
import StudentDashboard from "../routes/StudentDashboard";
import IssueSubmissionForm from '../components/IssueSubmissionForm';

const BASE_URL = 'https://academic-issue-tracking-system-gbch.onrender.com';

const DashboardContainer = () => {
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Function to handle logout - make it reusable
    const handleLogout = () => {
        // Clear all auth-related items
        localStorage.removeItem('access_token'); // Fix: use access_token
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        
        navigate("/student/login");
    };

    useEffect(() => {
        // Fix: Use 'access_token' to match what login stores
        const token = localStorage.getItem("access_token");
        const userRole = localStorage.getItem("user_role");

        console.log("Token:", token);
        console.log("User Role:", userRole);

        if (!token || userRole !== 'student') {
            console.log(`DashboardContainer: Not a student (${userRole}) or no token. Clearing storage and redirecting.`);
            handleLogout();
            return;
        }

        const fetchStudentData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/student-profile/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    console.error(`Error fetching student data: ${response.status} ${response.statusText}`);
                    handleLogout();
                    throw new Error("Failed to fetch student data");
                }

                const data = await response.json();
                console.log("Student Data Fetched in DashboardContainer:", data);
                setStudentData(data);
            } catch (error) {
                console.error("Error fetching student data in catch block:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [navigate]);

    if (loading || !studentData) {
        return (
            <Flex justify="center" align="center" height="100vh" bg="gray.50">
                <Spinner size="xl" />
            </Flex>
        );
    }

    return (
        <div>
            <Routes>
                <Route
                    path="/"
                    element={
                        <StudentDashboard 
                            studentData={studentData} 
                            loading={loading}
                            setLoading={setLoading} // Pass setLoading function
                            handleLogout={handleLogout} // Pass handleLogout function
                        />
                    }
                />
                <Route
                    path="/issue-submission"
                    element={<IssueSubmissionForm studentData={studentData} />}
                />
            </Routes>
        </div>
    );
};

export default DashboardContainer;
