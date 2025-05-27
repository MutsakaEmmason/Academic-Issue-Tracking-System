import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const BASE_URL = 'https://aits-i31l.onrender.com';

const RegistrarLogin = ({ onLoginSuccess, currentAccessToken, currentUserRole }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [csrfToken, setCsrfToken] = useState('');

    // Fetch CSRF Token
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/csrf-token/`, { credentials: 'include' });
                if (!response.ok) {
                    console.error("Failed to fetch CSRF token response:", response);
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || `Failed to fetch CSRF token: ${response.statusText}`);
                }
                const data = await response.json();
                setCsrfToken(data.csrfToken);
                console.log("CSRF Token fetched for Registrar Sign In:", data.csrfToken);
            } catch (error) {
                console.error("Error fetching CSRF token for Registrar Sign In:", error);
                toast({
                    title: 'Error.',
                    description: "Failed to load security token for login. Please refresh the page.",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchCsrfToken();
    }, [toast]);

    // Navigate if authentication state is already set and correct
    useEffect(() => {
        if (currentAccessToken && currentUserRole === 'registrar' && window.location.pathname !== '/registrar-dashboard') {
            console.log("RegistrarSignIn: Navigating to registrar dashboard because state is set correctly.");
            navigate("/registrar-dashboard");
        }
    }, [currentAccessToken, currentUserRole, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!csrfToken) {
            setError("CSRF token not available. Please refresh the page.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify({ username: email, password }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Server error" }));
                setError(errorData.detail || errorData.message || "Login failed");
                toast({
                    title: 'Login Failed.',
                    description: errorData.detail || errorData.message || "Please check your credentials.",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            const data = await response.json();
            console.log('Login successful data:', data);

            // Call the onLoginSuccess prop
            if (onLoginSuccess) {
                // Assuming data contains access, refresh, role, user_id, username
                onLoginSuccess(data.access, data.refresh, data.role, data.user_id, data.username);
            }

            toast({
                title: 'Login successful.',
                description: "You've successfully logged in. Redirecting...",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

        } catch (err) {
            setError("Network error, please try again.");
            console.error("Login request failed:", err);
            toast({
                title: 'Login Failed.',
                description: err.message || "Network error, please try again.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Registrar Login</h2>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="username" style={styles.label}>Username or Email</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter your username or email"
          />
          <p style={styles.helpText}>
            This should be the username you created during registration
          </p>
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter your password"
          />
        </div>
        
        <button 
          type="submit" 
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      </form>
      
      <div style={styles.signupLink}>
        Don't have an account?{' '}
        <span 
          style={styles.link}
          onClick={() => navigate('/registrar-signup')}
        >
          Sign Up
        </span>
      </div>
    </div>
  );
};

export default RegistrarLogin;
