<<<<<<< HEAD
// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Corrected import path
=======
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Ensure this file exists in your project
import App from './App.jsx';
>>>>>>> origin/fred

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
<<<<<<< HEAD
  </React.StrictMode>
);
=======
  </StrictMode>
);
>>>>>>> origin/fred
