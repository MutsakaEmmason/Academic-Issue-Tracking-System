
import React from "react";
import LecturerLogin from "./Login";
import StudentLogin from "./student_login";
import Home from "./home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Register from "./routes/register";

function App() {
    return (
        <div>
            <LecturerLogin />
        </div>
    );
}

export default App;