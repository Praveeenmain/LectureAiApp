import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './index.css';

function Navbar({ title }) {
  const history = useHistory();

  return (
    <nav className="navbar navbar-light bg-dark d-flex justify-content-between align-items-center px-2 ßtop-fixed">
      <div className="d-flex align-items-center">
        <button onClick={history.goBack} className="left-array">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
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
