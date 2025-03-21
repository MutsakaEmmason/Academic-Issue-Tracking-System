import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct import
import App from './App';

const root = createRoot(document.getElementById('root')); // Use createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
