// src/containers/DashboardContainer.js
import React, { useState, useEffect } from "react";
import StudentDashboard from "../routes/StudentDashboard";
import IssueSubmissionForm from '../components/IssueSubmissionForm';
import { useNavigate, Routes, Route } from "react-router-dom"; // Ensure Routes and Route are imported
const BASE_URL = 'https://academic-issue-tracking-system-gbch.onrender.com';

const DashboardContainer = () => {
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Function to handle logout - make it reusable
    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the access token
        localStorage.removeItem('refresh_token'); // Clear the refresh token
        localStorage.removeItem('user_role');    // Clear the user role
        localStorage.removeItem('user_id');      // Clear user ID if stored
        localStorage.removeItem('username');     // Clear username if stored
        // You can also use localStorage.clear() if you are certain only auth-related items are there
        navigate("/student/login"); // Redirect to the student login page
    };


    useEffect(() => {
        // --- CRUCIAL CHANGE 1: Use specific keys for tokens and roles ---
        const token = localStorage.getItem("token"); // Should be 'access_token'
        const userRole = localStorage.getItem("user_role"); // Get the stored role

        // --- CRUCIAL CHANGE 2: Check both token and role ---
        if (!token || userRole !== 'student') {
            console.log(`DashboardContainer: Not a student (${userRole}) or no token. Clearing storage and redirecting.`);
            handleLogout(); // Use the consolidated logout function
            return; // Stop useEffect execution
        }

        const fetchStudentData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/student-profile/`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Use the correctly retrieved token
                    },
                });

                if (!response.ok) {
                    console.error(`Error fetching student data: ${response.status} ${response.statusText}`);
                    // If the backend returns an error (e.g., 403 Forbidden, 401 Unauthorized)
                    // it means the token is invalid or the user's role is wrong.
                    // So, force a logout.
                    handleLogout(); // Use the consolidated logout function
                    throw new Error("Failed to fetch student data"); // Throw to enter catch block
                }

                const data = await response.json();
                console.log("Student Data Fetched in DashboardContainer:", data);
                setStudentData(data);
            } catch (error) {
                console.error("Error fetching student data in catch block:", error);
                // The `handleLogout()` in the `if (!response.ok)` block already handles navigation for API errors.
                // This catch block will primarily handle network errors.
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [navigate, handleLogout]); // Add handleLogout to dependencies if using it inside useEffect

    // Add a loading spinner or placeholder for the entire container
    if (loading || !studentData) { // Also check !studentData in case of initial fetch failure
        return (
            <Flex justify="center" align="center" height="100vh" bg="gray.50">
                <Spinner size="xl" />
            </Flex>
        );
    }

    return (
        <div>
            {/* Pass handleLogout down to StudentDashboard if it has a logout button */}
            <Routes>
                <Route
                    path="/"
                    element={<StudentDashboard studentData={studentData} loading={loading} handleLogout={handleLogout} />}
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
