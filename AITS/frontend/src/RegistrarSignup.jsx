import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistrarSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
    phone_number: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    // Check if passwords match
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return false;
    }

    // Check password strength (at least 8 characters)
    if (formData.password.length < 4) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Check if all required fields are filled
    const requiredFields = ['username', 'email', 'first_name', 'last_name', 'password',];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in all required fields`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Create payload (excluding confirm_password)
      const payload = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
        phone_number: formData.phone_number,
        role: 'registrar' // Explicitly set role to registrar
      };
      
      // Send signup request
      const response = await axios.post('http://127.0.0.1:8000/api/registrar/signup/', payload);
      
      setSuccess('Registration successful! You can now log in.');
      
      // Clear form
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        confirm_password: '',
        phone_number: ''
      });
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/registrar-login');
      }, 2000);
      
    } catch (error) {
      console.error('Signup error:', error.response || error);
      
      if (error.response && error.response.data) {
        // Handle specific error messages from the backend
        if (typeof error.response.data === 'object') {
          // If the error is an object with field-specific errors
          const errorMessages = Object.entries(error.response.data)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('; ');
          setError(errorMessages);
        } else if (typeof error.response.data === 'string') {
          setError(error.response.data);
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        setError('An error occurred during registration. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Styles for a clean, professional signup form
  const styles = {
    pageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    },
    container: {
      width: '100%',
      maxWidth: '600px',
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
      marginBottom: '30px',
      textAlign: 'center'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#2C7A7B',
      marginBottom: '10px'
    },
    subtitle: {
      fontSize: '16px',
      color: '#666'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    formRow: {
      display: 'flex',
      gap: '20px',
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      flex: '1 1 calc(50% - 10px)',
      minWidth: '250px'
    },
    fullWidth: {
      flex: '1 1 100%'
    },
    label: {
      fontWeight: '500',
      fontSize: '14px'
    },
    input: {
      padding: '12px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '16px'
    },
    button: {
      padding: '14px',
      backgroundColor: '#2C7A7B',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '16px',
      marginTop: '10px',
      transition: 'background-color 0.3s'
    },
    buttonHover: {
      backgroundColor: '#1A5354'
    },
    error: {
      color: '#e53e3e',
      textAlign: 'center',
      marginBottom: '15px',
      padding: '10px',
      backgroundColor: '#fff5f5',
      borderRadius: '4px',
      border: '1px solid #fed7d7'
    },
    success: {
      color: '#38a169',
      textAlign: 'center',
      marginBottom: '15px',
      padding: '10px',
      backgroundColor: '#f0fff4',
      borderRadius: '4px',
      border: '1px solid #c6f6d5'
    },
    footer: {
      marginTop: '30px',
      textAlign: 'center',
      fontSize: '14px'
    },
    link: {
      color: '#2C7A7B',
      textDecoration: 'underline',
      cursor: 'pointer',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Registrar Registration</h1>
          <p style={styles.subtitle}>Create your account to manage academic issues</p>
        </div>
        
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Personal Information */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="first_name" style={styles.label}>First Name*</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter your first name"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="last_name" style={styles.label}>Last Name*</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter your last name"
              />
            </div>
          </div>
          
          {/* Account Information */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="username" style={styles.label}>Username*</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Choose a username"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email Address*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter your email address"
              />
            </div>
          </div>
          
          {/* Password */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>Password*</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Create a password"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="confirm_password" style={styles.label}>Confirm Password*</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Confirm your password"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(loading ? { opacity: 0.7 } : {})
            }}
            disabled={loading}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div style={styles.footer}>
          <p>
            Already have an account?{' '}
            <span 
              style={styles.link}
              onClick={() => navigate('/registrar-login')}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrarSignup;