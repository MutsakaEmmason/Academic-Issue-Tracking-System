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

    return (
        <nav>
            <div style={menuStyle}>
                <button onClick={toggleMenu} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Menu
                </button>
                {isOpen && (
                <ul>
                    <li><Link to="/issue-submission">Submit an Issue</Link></li>
                    <li><Link to="/profile">View Profile</Link></li>
                    <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
                </ul>
                )}
            </div>
        </nav>
    );
};

export default MenuBar;
