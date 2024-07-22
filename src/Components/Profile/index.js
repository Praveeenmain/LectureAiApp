import React from 'react';
import Cookies from 'js-cookie';
import Navbar from '../NavBar';
import { useHistory } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LabelBottomNavigation from '../BottomNav';
import { jwtDecode } from 'jwt-decode';
import { 
  faRobot, 
  faLock, 
  faBalanceScale, 
  faSignOutAlt, 
  faFileAlt, 
  faCreditCard, 
  faComments, 
  faLifeRing, 
  faUsers, 
  faArchive 
} from '@fortawesome/free-solid-svg-icons';
import './index.css';

const Profile = () => {
  const profile = Cookies.get('jwt');
  const decodedToken = jwtDecode(profile);
  const { name, email, picture } = decodedToken;
  const history = useHistory();

  const handleSignOut = () => {
    Cookies.remove('jwt_token');
    googleLogout();
    history.push('/');
  };

  const menuItems = [
    { icon: faUsers, label: 'Documents' },
    { icon: faArchive, label: 'Knowledge' },
    { icon: faRobot, label: 'Assistant' },
    { icon: faLock, label: 'Activity' },
    { icon: faBalanceScale, label: 'Settings' },
    { icon: faFileAlt, label: 'Account' },
    { icon: faCreditCard, label: 'Payment' },
    { icon: faComments, label: 'Feedback' },
    { icon: faLifeRing, label: 'Help' },
  ];

  return (
    <>
      <Navbar title="Profile" />
      <div className="profile-container">
        <div className="profile-name-container">
          <img className="profile-image" src={picture} alt="Profile" />
          <div className="profile-name-email">
            <p className="profile-name">{name}</p>
            <p className="profile-email">{email}</p>
          </div>
        </div>
        
        <hr />
        
        <p className="profile-about-heading">About</p>

        {menuItems.map((item, index) => (
          <div className="profile-email-icon-container" key={index}>
            <FontAwesomeIcon icon={item.icon} className="profile-message-icon" />
            <span className="profile-name-email">{item.label}</span>
          </div>
        ))}
        
        <div className="profile-signout-container" onClick={handleSignOut}>
          <FontAwesomeIcon icon={faSignOutAlt} className="profile-message-icon" />
          <span className="profile-name-email">Sign Out</span>
        </div>
      </div>
      <LabelBottomNavigation />
    </>
  );
};

export default Profile;
