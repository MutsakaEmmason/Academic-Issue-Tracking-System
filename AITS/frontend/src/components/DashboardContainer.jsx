import React, { useState, useEffect } from "react";
import StudentDashboard from "../routes/StudentDashboard";
import IssueSubmissionForm from '../components/IssueSubmissionForm'; // Import the IssueSubmissionForm
import { useNavigate, Routes, Route } from "react-router-dom"; // Import Routes and Route

const DashboardContainer = () => {
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/student/login");
            return;
        }

        const fetchStudentData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/student-profile/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch student data");
                }

                const data = await response.json();
                console.log("Student Data Fetched in DashboardContainer:", data);
                setStudentData(data);
            } catch (error) {
                console.error("Error fetching student data:", error);
                navigate("/student/login");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [navigate]);

    return (
        <div>
            <Routes>
                <Route path="/" element={<StudentDashboard studentData={studentData} loading={loading} />} />
                <Route path="/issue-submission" element={<IssueSubmissionForm studentData={studentData} />} />
            </Routes>
        </div>
    );
};

export default DashboardContainer;