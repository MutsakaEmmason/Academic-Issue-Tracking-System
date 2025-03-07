<<<<<<< HEAD
// src/App.jsx
import React from "react";
import LecturerLogin from "./Login";
import StudentLogin from "./student_login";
import Home from "./home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Register from "./routes/register";

=======
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import LecturerLogin from "./LecturerLogin.jsx";
import LecturerDashboard from "./LecturerDashboard.jsx";
import StudentLogin from "./StudentLogin.jsx"; // Ensure correct import
import Home from "./Home.jsx"; // Ensure correct import
import Register from "./Register.jsx"; // Ensure correct import
import StudentDashboard from "./StudentDashboard.jsx";
>>>>>>> origin/fred

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
<<<<<<< HEAD
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/lecturer/login" element={<LecturerLogin />} />
          {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
          <Route path="/register" element={<Register />} />
=======
          <Route path="/lecturer-login" element={<LecturerLogin />} />
          <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
>>>>>>> origin/fred
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;