import React, { useState, useEffect } from "react";
import StudentDashboard from "../routes/StudentDashboard";
import { useNavigate } from "react-router-dom";

const DashboardContainer = () => {
    const [studentData, setStudentData] = useState(null); // Use studentData
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        if (token) {
            fetch("http://127.0.0.1:8000/api/student/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    console.log("API Response:", response);
                    if (!response.ok) {
                        throw new Error("Failed to fetch student data");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("API Data:", data);
                    setStudentData(data); // Set studentData
                    setLoading(false); // Set loading to false
                })
                .catch((error) => {
                    console.error("Error fetching student data:", error);
                    navigate("/student/login");
                    setLoading(false); // Set loading to false in case of error
                });
        } else {
            navigate("/student/login");
        }
    }, [navigate]);

    return (
        <div>
            {studentData && <StudentDashboard studentData={studentData} loading={loading} />} {/* Pass studentData and loading */}
        </div>
    );
};

export default DashboardContainer;