import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import './index.css';

function Navbar({ title }) {
  return (
    <nav className="navbar navbar-light bg-dark d-flex justify-content-between align-items-center px-3 top-fixed">
      <div className="d-flex align-items-center">
        <Link to="/home" className="navbar-brand d-flex align-items-center" style={{ color: 'white', textDecoration: 'none' }}>
          <span className="ms-2">{title}</span>
        </Link>
      </div>
      <div className="ms-auto">
        <FontAwesomeIcon icon={faEllipsisVertical} style={{ color: 'white' }} />
      </div>
    </nav>
  );
}

export default Navbar;
