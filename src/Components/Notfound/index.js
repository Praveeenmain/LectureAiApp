import React from 'react';
import './index.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const NotFound = () => {
  return (
    <div className="not-found">
      
      <h1>Under Construction</h1>
      <p>The page will avaiable soon</p>
      <Link className="HomeLinks" to="/home"><button> Return Home </button></Link>
    </div>
  );
};

export default NotFound;
