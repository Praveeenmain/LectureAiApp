import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function Navbar() {
  return (
    <nav className="navbar navbar-light bg-dark fixed-top d-flex justify-content-between align-items-center px-3">
      <div className="d-flex align-items-center">
        <div className="navbar-brand" style={{color:'white'}} >
          <img
            src="https://play-lh.googleusercontent.com/nPFp9nxBxCdnfiKHfW3dOwPrchqIoXr0c2ujvEhIAqXdXa4H1rRN9iUBKeXD2SMNreWV"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="home-logo"
          />
          Lecture AI
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
