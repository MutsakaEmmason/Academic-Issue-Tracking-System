import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const MenuBar = ({ handleLogout }) => {
    const [isOpen, setIsOpen] = useState(false);

    const menuStyle = {
        display: 'block', // Change to block for left alignment

        flexDirection: 'column',
        width: '200px',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '10px',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };







};
export default MenuBar;