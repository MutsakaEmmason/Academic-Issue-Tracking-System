import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LecturerLogin from "./LecturerLogin.jsx";
import LecturerDashboard from "./LecturerDashboard.jsx";
import "./LecturerDashboard.css";
import "./LecturerLogin.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LecturerLogin />} />
                <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;