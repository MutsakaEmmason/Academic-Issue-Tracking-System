import { useState } from "react";
import "./Login.css"; // Ensure this path is correct

const LecturerLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [course, setCourse] = useState("");
    const [department, setDepartment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login Data:", { email, password, course, department });
    };

    return (
        <div className="login-container">
            <h2>Lecturer Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Course Taught"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LecturerLogin;
