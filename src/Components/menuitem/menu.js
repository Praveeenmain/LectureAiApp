import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

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

const MenuItem = ({ audioFile, onClick }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = formatDate(audioFile.date);
  const truncatedTitle = truncateTitle(audioFile.title, 2);

  const handleDelete = () => {
    if (!audioFile) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this Lecture audio?');
    if (!confirmDelete) {
      return;
    }

    const url = `https://lectureaibackend.onrender.com/audio-files/${audioFile._id}`;

    setIsDeleting(true);

    axios
      .delete(url)
      .then((response) => {
        console.log('Audio file deleted successfully');
        // Optionally perform any cleanup or state update after successful deletion
      })
      .catch((error) => {
        console.error('Error deleting audio file:', error);
        alert('Failed to delete audio file. Please try again.');
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const handleItemClick = () => {
    onClick(); 
  };

  useEffect(() => {
    if (isDeleting) {
      window.location.reload(false); 
    }
  }, [isDeleting]);

  return (
    <li className="menu-item" onClick={handleItemClick}>
      <div className="item-content">
        <div className="icons">
          <div className="icon">
            <FontAwesomeIcon icon={faPlay} />
          </div>
        </div>
        <div className="details">
          <h1 className="title">{truncatedTitle}</h1>
          <div className="date">{formattedDate}</div>
        </div>
        <div className="icon" onClick={handleDelete}>
          {isDeleting ? (
            <span>Deleting...</span>
          ) : (
            <FontAwesomeIcon icon={faTrashAlt} />
          )}
        </div>
      </div>
    </li>
  );
};

export default MenuItem;
