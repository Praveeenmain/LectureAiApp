import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './index.css'; // Import the CSS file for styling

const Header = () => {
    return (
        <nav className="navbar navbar-light bg-dark text-white">
            <div className="container-fluid">
                <div className="brand">
                    <FontAwesomeIcon className='header-icons' icon={faBars} />
                    <h1 className="Heading">TaAi</h1>
                </div>
                <div className='message-help-icon'>
                    <FontAwesomeIcon className='header-icons' icon={faEnvelope} />
                    <h1 className='Heading'> Help </h1>
                </div>
            </div>
        </nav>
    );
}

export default Header;
