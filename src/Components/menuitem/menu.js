import React, { useState } from 'react';
import axios from 'axios';
import './menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
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
  const truncatedTitle = truncateTitle(audioFile.title, 20); // Adjusted the maxLength to a more reasonable value

  const handleDelete = (event) => {
    event.preventDefault(); // Prevent default action (navigation)

    if (!audioFile) return;

    const url = `https://pdfaibackend.onrender.com/audiofile/${audioFile.id}`;

    setIsDeleting(true);

    axios
      .delete(url)
      .then((response) => {
        console.log('Audio file deleted successfully');
        window.location.reload(false); // Reloading the page after deletion
      })
      .catch((error) => {
        console.error('Error deleting audio file:', error);
        alert('Failed to delete audio file. Please try again.');
        setIsDeleting(false);
      });
  };

  return (
    <li className="menu-item">
      <div className="item-content">
        <Link className="menu-link" to={`/audio-files/${audioFile.id}`}>
          <div className="details">
            <p className="audio-menu-title">{truncatedTitle}</p>
            <div className="date">{formattedDate}</div>
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
