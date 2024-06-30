import React from 'react';
import Cookies from 'js-cookie';
import Navbar from '../NavBar';
import { useHistory } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LabelBottomNavigation from '../BottomNav'
import { jwtDecode } from 'jwt-decode';
import { faEnvelope, faFileAlt, faLock, faBalanceScale, faSignOutAlt, faQuestionCircle,faUsers,faArchive} from '@fortawesome/free-solid-svg-icons';
import './index.css';

const Profile = () => {
  const jwtToken = Cookies.get('jwt_token');
  // console.log(jwtToken)
  const decodedToken = jwtDecode(jwtToken);

  const { name, email, picture } = decodedToken;
  const history = useHistory();

  const handleSignOut = () => {
    Cookies.remove('jwt_token');
    googleLogout();
    history.push('/');
  };

  return (
    <>
      <Navbar title="Profile" />
      <div className="profile-container">
        <div className='Profile-name-container'>
          <img className='profile-image' src={picture} alt="Profile" />
          <p className='profile-name-email'>{name}</p>
        </div>
        <hr />
        <p className='Account-About-heading'>Accounts</p>
        <div className='email-icon-container'>
          <FontAwesomeIcon icon={faEnvelope} className="message-icon" />
          <p className='profile-name-email'>{email}</p>
        </div>
        <div className='email-icon-container'>
          <FontAwesomeIcon icon={faUsers} className="message-icon" />
          <p className='profile-name-email'>Subscription</p>
        </div>
        <div className='email-icon-container'>
          <FontAwesomeIcon icon={faArchive} className="message-icon" />
          <p className='profile-name-email'>Archived Chats</p>
        </div>

        <p className='Account-About-heading'>About</p>
        <div className='email-icon-container'>
          <FontAwesomeIcon icon={faFileAlt} className="message-icon" />
          <p className='profile-name-email'>Terms of Use</p>
        </div>
        <div className='email-icon-container'>
          <FontAwesomeIcon icon={faLock} className="message-icon" />
          <p className='profile-name-email'>Privacy Policy</p>
        </div>
        <div className='email-icon-container'>
          <FontAwesomeIcon icon={faBalanceScale} className="message-icon" />
          <p className='profile-name-email'>Licenses</p>
        </div>
        <div className='email-icon-container'>
          <FontAwesomeIcon icon={faQuestionCircle} className="message-icon" />
          <p className='profile-name-email'>Help</p>
        </div>
        <div className='email-icon-container' onClick={handleSignOut}>
          <FontAwesomeIcon icon={faSignOutAlt} className="message-icon" />
          <p className='profile-name-email'>Signout</p>
        </div>
      </div>
      <LabelBottomNavigation/>
    </>
  );
};

export default Profile;
