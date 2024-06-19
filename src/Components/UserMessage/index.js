
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './index.css';

const UserMessage = ({ initialMessage, onSend }) => {
  const [message, setMessage] = useState(initialMessage);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    onSend(message);
    setIsEditing(false);
  };

  const handleCloseClick = () => {
    setIsEditing(false);
    setMessage(initialMessage); // Reset message to initial value
  };

  return (
    <div className="edit-send-message">
      <div className={isEditing ? 'edit-actions' : ''}>
        {isEditing ? (
          <>
            <input
              className='edit-input'
              type="text"
              value={message}
              onChange={handleInputChange}
            />
            <button className='edit-send-button' onClick={handleSendClick}>
              <FontAwesomeIcon  icon={faPaperPlane} />
            </button>
            <FontAwesomeIcon
              icon={faTimes}
              onClick={handleCloseClick}
              className="close-icon"
            />
          </>
        ) : (
          <>
            <div className='user-message'>
              <FontAwesomeIcon className='edit-user-icon' onClick={handleEditClick} icon={faEdit} />  
              {message}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserMessage;
