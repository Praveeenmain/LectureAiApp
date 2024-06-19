import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
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
    setMessage(''); // Clear message after sending
  };

  const handleCloseClick = () => {
    setIsEditing(false);
    setMessage(initialMessage); // Reset message to initial value
  };

  return (
    <div className="edit-send-message">
      {isEditing ? (
        <div className='edit-box'>
          <textarea
            className='edit-input'
            value={message}
            onChange={handleInputChange}
            placeholder="Type your message..."
          />
          <div className='send-cancel-button'>
            <button className='edit-cancel-button' onClick={handleCloseClick}>Cancel</button>
            <button className='edit-send-button' onClick={handleSendClick}>Send</button>
          </div>
        </div>
      ) : (
        <div className='user-message'>
          <FontAwesomeIcon className='edit-user-icon' icon={faEdit} onClick={handleEditClick} />
          {message}
        </div>
      )}
    </div>
  );
};

export default UserMessage;
