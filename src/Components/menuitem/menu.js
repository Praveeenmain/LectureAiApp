import React from 'react';
import './menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleString('en-US', options);
};

const truncateTitle = (title, maxLength) => {
  if (title.length <= maxLength) {
    return title;
  }
  // Split the title into words
  const words = title.split(' ');
  // Join the first 4 words with a space and add ellipsis at the end
  return words.slice(0, 6).join(' ') + '...';
};

const MenuItem = ({ onClick, audioFile }) => {
  const formattedDate = formatDate(audioFile.date);
  const truncatedTitle = truncateTitle(audioFile.title, 4);

  const handleItemClick = () => {
    onClick(); // Call the onClick function passed from parent (App component)
  };

  return (
    <li className="menu-item" onClick={handleItemClick}>
      <div className="item-content">
        <div className="icon">
          <FontAwesomeIcon icon={faPlay} />
        </div>
        <div className="details">
          <div className="title">{truncatedTitle}</div>
          <div className="date">{formattedDate}</div>
        </div>
      </div>
    </li>
  );
};

export default MenuItem;
