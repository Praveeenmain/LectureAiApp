import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './index.css';

function Navbar({ title }) {
  return (
    <nav className="navbar navbar-light bg-dark d-flex justify-content-between align-items-center px-3">
      <div className="d-flex align-items-center">
        <Link to="/" className="navbar-brand d-flex align-items-center" style={{ color: 'white', textDecoration: 'none' }}>
          <img
            src="https://play-lh.googleusercontent.com/nPFp9nxBxCdnfiKHfW3dOwPrchqIoXr0c2ujvEhIAqXdXa4H1rRN9iUBKeXD2SMNreWV"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="home-logo"
          />
          <span className="ms-2">{title}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
