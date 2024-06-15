import React, { useState } from 'react';
import './index.css'; // Assuming you have a CSS file for styling
import axios from 'axios';

const LectureTitle = ({ lecture, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(lecture.title);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const truncateTitle = (text) => {
    const words = text.split(' ');
    if (words.length <= 4) {
      return text; // Return full title if it has 4 or fewer words
    }
    return words.slice(0, 4).join(' ') + '...'; // Truncate and add ellipsis
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setError(null); // Clear any previous errors when the user starts typing
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`https://lectureaibackend.onrender.com/audio-files/${id}`, {
        title,
      });

      if (response.status >= 400) { // Check for HTTP error codes
        throw new Error(response.data.message || 'Failed to update the title.');
      } else if (response.data.error) { // Check for specific error property in response data (if applicable)
        throw new Error(response.data.error);
      }

      setTitle(response.data.lecture.title); // Assuming the response contains the updated lecture data
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating the title:', error);
      setError('Failed to update the title. Please try again.'); // Generic message for user
    } finally {
      setIsLoading(false);
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
          onBlur={handleSaveClick} // Save on blur or Enter key press (optional)
          autoFocus
          className="edit-input"
        />
      ) : (
        <h1 className="title" onClick={handleEditClick}>
          {isLoading ? 'Saving...' : truncateTitle(title)}
        </h1>
      )}
    </div>
  );
};

export default LectureTitle;
