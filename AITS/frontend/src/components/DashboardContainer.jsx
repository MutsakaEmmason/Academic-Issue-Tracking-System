import React, { useState, useEffect } from "react";
import StudentDashboard from "../routes/StudentDashboard";
import { useNavigate } from "react-router-dom";

const DashboardContainer = () => {
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        if (token) {
            fetch("http://127.0.0.1:8000/api/student-profile/", { // Corrected URL
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
                    setStudentData(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching student data:", error);
                    navigate("/student/login");
                    setLoading(false);
                });
        } else {
            navigate("/student/login");
        }
    }, [navigate]);

    return (
        <div>
            {studentData && <StudentDashboard studentData={studentData} loading={loading} />}
        </div>
    );
};

export default DashboardContainer;