import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleString('en-US', options);
};

const truncateTitle = (title, maxLength) => {
  if (title.length <= maxLength) {
    return title;
  }

  const words = title.split(' ').map(word => word.replace(/[:,]/g, ''));
  return words.slice(0, 3).join(' ') + '...';
};

const MenuItem = ({ audioFile }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = formatDate(audioFile.date);
  const truncatedTitle = truncateTitle(audioFile.title, 2);

  const handleDelete = (event) => {
    event.preventDefault(); // Prevent default action (navigation)

    if (!audioFile) return;

    const url = `https://pdfaibackend.onrender.com/audiofile/${audioFile.id}`;

    setIsDeleting(true);

    axios
      .delete(url)
      .then((response) => {
        console.log('Audio file deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting audio file:', error);
        alert('Failed to delete audio file. Please try again.');
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  useEffect(() => {
    if (isDeleting) {
      window.location.reload(false); // Reloading the page after deletion
    }
  }, [isDeleting]);

  return (
    <li className="menu-item">
     
        <div className="item-content">
        <Link className="menu-link" to={`/audio-files/${audioFile.id}`}>
          <div className="icons">
           
          
          <div className="details">
            <h1 className="title">{truncatedTitle}</h1>
            <div className="date">{formattedDate}</div>
          </div>
          </div>
          </Link>
          <Popup
            trigger={<FontAwesomeIcon icon={faTrashAlt} className="delete-icon" />}
            position="center"
            closeOnDocumentClick
            modal
          >
            {close => (
              <div className="popup-content">
                <p style={{ color: 'white' }}>Are you sure you want to delete this Lecture audio?</p>
                <div className="button-container">
                  <button className="confirm-button" onClick={(event) => {
                    event.preventDefault(); // Prevent default action (navigation)
                    handleDelete(event);
                    close();
                  }}>
                    {isDeleting ? 'Deleting...' : 'Confirm'}
                  </button>
                  <button className="cancel-button" onClick={close}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </Popup>
        </div>
   
    </li>
  );
};

export default MenuItem;
