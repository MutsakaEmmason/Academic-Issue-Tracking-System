import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const BASE_URL = 'https://academic-issue-tracking-system-gbch.onrender.com';

const RegistrarLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Sending credentials:', credentials); // Debug log
      
      const response = await axios.post(`${BASE_URL}/api/token/`, credentials);
      
      console.log('Login response:', response.data); // Debug log
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      
      // Store user role if available
      if (response.data.role) {
        localStorage.setItem('userRole', response.data.role);
      }
      
      // Redirect to dashboard
      navigate('/academic-registrar');
    } catch (error) {
      console.error('Login error:', error.response || error);
      
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password. Please try again.');
      } else {
        setError(
          error.response?.data?.detail || 
          'Failed to login. Please check your credentials.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Simple CSS styles
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '100px auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(199, 32, 32, 0.1)',
      borderRadius: '8px',
      backgroundColor: 'white'
    },

    title: {
      textAlign: 'center',
      color: '#2C7A7B',
      marginBottom: '20px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    },
    label: {
      fontWeight: 'bold'
    },
    input: {
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd'
    },
    button: {
      padding: '12px',
      backgroundColor: '#2C7A7B',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginTop: '10px'
    },
    error: {
      color: 'red',
      textAlign: 'center',
      marginBottom: '15px'
    },
    signupLink: {
      textAlign: 'center',
      marginTop: '20px'
    },
    link: {
      color: '#2C7A7B',
      textDecoration: 'underline',
      cursor: 'pointer'
    },
    helpText: {
      fontSize: '0.8rem',
      color: '#666',
      marginTop: '5px'
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
