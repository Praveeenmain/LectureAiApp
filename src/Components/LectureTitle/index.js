import React, { useState } from 'react';
import './index.css';

const LectureTitle = ({ lecture, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(lecture.title);
  const [error, setError] = useState(null);

  // Function to truncate title to 4 words
  const truncateTitle = (text) => {
    const words = text.split(' ');
    if (words.length <= 4) {
      return text; // Return full title if it has 4 or fewer words
    }
    return words.slice(0, 4).join(' ') + '...'; // Truncate and add ellipsis
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`https://lectureaibackend.onrender.com/audio-files/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Failed to update the title.');
      }

      const updatedLecture = await response.json();
      setTitle(updatedLecture.title);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating the title:', error);
      setError('Failed to update the title. Please try again.');
    }
  };

  return (
    <div className="lecture-title">
      {error && <p className="error">{error}</p>}
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleSaveClick}
          autoFocus
          className="edit-input"
        />
      ) : (
        <h1 className="title" onClick={handleEditClick}>
          {truncateTitle(title)}
        </h1>
      )}
    </div>
  );
};

export default LectureTitle;
