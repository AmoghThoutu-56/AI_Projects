import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';


//React DOM renders the App component into the root element of the HTML
// This is the entry point of the React application
// Strict mode is used to highlight potential problems in the application
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// DOM is Document Object Model
// It represents the structure of a web page as a tree of objects