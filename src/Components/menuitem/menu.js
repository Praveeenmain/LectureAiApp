import React from 'react';
import './menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import the delete icon

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleString('en-US', options);
};

const truncateTitle = (title, maxLength) => {
  if (title.length <= maxLength) {
    return title;
  }

  const words = title.split(' ');
  
  return words.slice(0, 3).join(' ') + '...';
}

const MenuItem = ({ onClick, audioFile }) => {
  const formattedDate = formatDate(audioFile.date);
  const truncatedTitle = truncateTitle(audioFile.title, 4);
  
  const handleItemClick = () => {
    onClick(); 
  
  };

  return (
    <li className="menu-item" onClick={handleItemClick}>
      <div className="item-content">
        <div className="icons">
          <div className="icon">
            <FontAwesomeIcon icon={faPlay} />
          </div>
         
        </div>
        <div className="details">
          <div className="title">{truncatedTitle}</div>
          <div className="date">{formattedDate}</div>
        </div>
        <div className="icon">
            <FontAwesomeIcon icon={faTrashAlt} />
          </div>
      </div>
      
    </li>
  );
};

export default MenuItem;
