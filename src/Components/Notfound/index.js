import React from 'react';
import './index.css'; // Import the CSS file for styling

const NotFound = () => {
  return (
    <div className="not-found">
      <img src="https://static.vecteezy.com/system/resources/thumbnails/008/255/803/small/page-not-found-error-404-system-updates-uploading-computing-operation-installation-programs-system-maintenance-a-hand-drawn-layout-template-of-a-broken-robot-illustration-vector.jpg" alt="Not Found" />
      <h1>404: Page Not Found</h1>
      <p>The page you requested could not be found.</p>
      <a href="/">Return Home</a>
    </div>
  );
};

export default NotFound;
