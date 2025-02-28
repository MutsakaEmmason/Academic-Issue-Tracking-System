import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "./Login.css";

const LecturerLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [course, setCourse] = useState("");
    const [department, setDepartment] = useState("");
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
    const [error, setError] = useState("");
    const navigate = useNavigate(); // For navigation

    // Check if the lecturer is already signed up
    const isLecturerSignedUp = () => {
        const lecturer = localStorage.getItem("lecturer");
        return lecturer ? true : false;
    };

    // Handle login
    const handleLogin = (e) => {
        e.preventDefault();
        const lecturer = JSON.parse(localStorage.getItem("lecturer"));
        if (lecturer && lecturer.email === email && lecturer.password === password) {
            navigate("/lecturer-dashboard", { state: { username: lecturer.email } }); // Redirect to dashboard
            setError("");
        } else {
            setError("Invalid email or password.");
        }
    };

    // Handle signup
    const handleSignup = (e) => {
        e.preventDefault();
        if (email && password && course && department) {
            const lecturer = { email, password, course, department };
            localStorage.setItem("lecturer", JSON.stringify(lecturer)); // Save lecturer details
            alert("Signup successful! Please log in.");
            setIsLogin(true); // Switch to login after signup
            setError("");
        } else {
            setError("Please fill in all fields.");
        }
    };

    return (
        <div className="login-container">
            <h2>{isLogin ? "Lecturer Login" : "Lecturer Sign Up"}</h2>
            {error && <p className="error">{error}</p>}

            <form onSubmit={isLogin ? handleLogin : handleSignup}>
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

                {!isLogin && (
                    <>
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
                    </>
                )}

                <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
            </form>

            <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer", color: "#4CAF50" }}>
                    {isLogin ? "Sign Up" : "Login"}
                </span>
            </p>
        </div>
    );
};

export default LecturerLogin;