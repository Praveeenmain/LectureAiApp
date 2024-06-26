import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import WhatsAppIcon from '@mui/icons-material/WhatsApp'; // Import WhatsApp icon from Material-UI Icons
import './index.css'; // Import the CSS file for styling

const Header = () => {
    return (
        <nav className="navbar navbar-light bg-dark text-white">
            <div className="container-fluid">
                <div className="brand">
                    <FontAwesomeIcon className='header-icon' icon={faBars} />
                    <h1 className="header-heading">TaAi</h1>
                </div>
                <div className='message-help-icon'>
                    <WhatsAppIcon className='header-icon' /> {/* Replace FontAwesomeIcon with WhatsAppIcon */}
                    <div className="help-text">
                        <h1 className='help-heading'>Help</h1>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
