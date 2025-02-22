import React from "react";
import LecturerLogin from "./Login";
import StudentLogin from "./student_login"; // Ensure this import is correct
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/student_login" element={<StudentLogin />} />
          <Route path="/" element={<LecturerLogin />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
