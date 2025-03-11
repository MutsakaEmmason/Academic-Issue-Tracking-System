import React, { useState, useEffect } from 'react';
import MenuBar from '../components/MenuBar'; // Importing the MenuBar component
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation
import { FormControl, FormLabel, Input, Button } from '@chakra-ui/react'; 

const StudentDashboard = ({ studentName, isAuthenticated, issues = [] }) => { 
    const navigate = useNavigate(); // Initialize navigate for navigation

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); // Redirect to login if not authenticated
        }
    }, [isAuthenticated, navigate]);

    const [menuVisible, setMenuVisible] = useState(false);
    console.log("StudentDashboard rendered with:", { studentName, isAuthenticated });
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [profileVisible, setProfileVisible] = useState(false); // Added state for profile visibility
    const [filteredIssues, setFilteredIssues] = useState(issues); // State for filtered issues

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const toggleProfile = () => {
        setProfileVisible(!profileVisible); // Toggle profile visibility
    };

    const handleLogout = () => {
        console.log("User logged out");
        navigate('/'); // Redirect to home page after logout
    };
    const handleSearch = () => {
        console.log("Search initiated for:", searchTerm);
        // Logic to filter issues based on search term
        const filtered = issues.filter(issue => 
            issue.courseUnit.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredIssues(filtered);
    };





};
export default StudentDashboard;