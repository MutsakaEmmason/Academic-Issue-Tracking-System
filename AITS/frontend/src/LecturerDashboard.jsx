import React from "react";
import { useLocation } from "react-router-dom"; // To access state
import "./LecturerDashboard.css";

const LecturerDashboard = () => {
    const location = useLocation();
    const { username } = location.state || { username: "Lecturer" }; // Default fallback

    return (
        <div className="dashboard-container">
            <h2>Hi, {username}!</h2>
            <p>Welcome to your Lecturer Dashboard.</p>
            <div className="dashboard-content">
                <h3>Your Courses</h3>
                <ul>
                    <li>Course 1: Introduction to Programming</li>
                    <li>Course 2: Data Structures</li>
                    <li>Course 3: Algorithms</li>
                </ul>
            </div>
        </div>
    );
};

export default LecturerDashboard;