import React, { useState, useEffect } from 'react';
import './index.css';

const UserMessage = ({ initialMessage, onSend }) => {
  const [message, setMessage] = useState(initialMessage);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setShowButtons(message !== initialMessage);
  }, [message, initialMessage]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    onSend(message);
    setShowButtons(false);
    setMessage(''); // Clear message after sending
  };

  const handleCloseClick = () => {
    setMessage(initialMessage); // Reset message to initial value
    setShowButtons(false);
  };

  return (
    <div className="edit-send-message">
      <div className='edit-box'>
        <input
          className='edit-input'
          value={message}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        {showButtons && (
          <div className='send-cancel-button'>
            <button className='edit-cancel-button' onClick={handleCloseClick}>Cancel</button>
            <button className='edit-send-button' onClick={handleSendClick}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMessage;
