import React, { useState, useEffect } from 'react';
import MenuBar from '../components/MenuBar';
import { useNavigate } from 'react-router-dom';
import { FormControl, FormLabel, Input, Button } from '@chakra-ui/react';

const StudentDashboard = ({ studentData, loading }) => { // Receive studentData and loading
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [profileVisible, setProfileVisible] = useState(false);
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

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const toggleProfile = () => {
        setProfileVisible(!profileVisible);
    };

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
        <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5em', padding: '20px', backgroundColor: 'green', color: 'white' }}>STUDENT DASHBOARD</h1>
            <p style={{ color: 'white', background: "green" }}>WELCOME, {studentData.fullName}</p>
            <hr />
            <MenuBar visible={menuVisible} />
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