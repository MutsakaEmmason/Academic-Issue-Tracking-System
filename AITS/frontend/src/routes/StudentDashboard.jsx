import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const StudentDashboard = ({ studentData, loading }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredIssues, setFilteredIssues] = useState([]);

    useEffect(() => {
        if (!studentData && !loading) {
            navigate('/student/login');
        }
    }, [studentData, loading, navigate]);

    useEffect(() => {
        if (studentData && studentData.issues) {
            setFilteredIssues(studentData.issues);
        }
    }, [studentData]);

    const handleLogout = () => {
        console.log("User logged out");
        navigate('/');
    };

    const handleSearch = () => {
        console.log("Search initiated for:", searchTerm);
        const filtered = studentData.issues.filter(issue =>
            issue.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredIssues(filtered);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!studentData) {
        return <p>No student data available.</p>;
    }

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: 'green', color: 'white' }}>
                <h1 style={{ fontSize: '2.5em', padding: '20px' }}>STUDENT DASHBOARD</h1>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ marginRight: '10px' }}>WELCOME, {studentData.fullName}</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/issue-submission" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
                            Submit an Issue
                        </Link>
                        <Link to="/profile" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
                            View Profile
                        </Link>
                        <Link to="/" onClick={handleLogout} style={{ color: 'white', textDecoration: 'none' }}>
                            Logout
                        </Link>
                    </div>
                </div>
            </header>
            <hr />
            <FormControl mt={4}>
                <FormLabel>Search by Issue Title</FormLabel>
                <Input
                    type="text"
                    placeholder="Enter issue title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ border: '1px solid green', width: '150px' }}
                />
                <Button onClick={handleSearch} mt={2} colorScheme="green" style={{ border: '1px solid green' }}>Search</Button>
            </FormControl>
            {filteredIssues.length === 0 && (
                <p>No issues logged. Please submit an issue.</p>
            )}
            <div>
                {filteredIssues.map(filteredIssue => (
                    <div key={filteredIssue.id}>
                        <p>{filteredIssue.title}</p>
                        <p>{filteredIssue.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;
