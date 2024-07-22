import React, { useState, useEffect } from 'react';
import './index.css'; // Assuming you have a CSS file for styling
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons'; // Import the edit, save, and close icons

const LectureTitle = ({ lecture, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(lecture);
  const [originalTitle, setOriginalTitle] = useState(lecture); // To keep track of original title
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
 
 
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setError(null); // Clear any previous errors when the user starts typing
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setOriginalTitle(title); // Store the original title when starting to edit
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`https://lectureaibackend.onrender.com/audio-files/${id}`, {
        title,
      });

      console.log('Response:', response); // Debugging log

      if (response.status >= 400 || response.data.error) {
        throw new Error(response.data.message || response.data.error || 'Failed to update the title.');
      }

      // Log the response data structure to understand it
      console.log('Response data:', response.data);

      // Assuming the response contains the updated lecture data in response.data.lecture
      const updatedTitle = response.data.lecture?.title || response.data.title || title;
      setTitle(updatedTitle);
      setIsEditing(false);
      setIsSaved(true);
    } catch (error) {
      console.error('Error updating the title:', error);
      setError('Failed to update the title. Please try again.'); // Generic message for user
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseClick = () => {
    setTitle(originalTitle); // Reset title to original title
    setIsEditing(false);
    setError(null); // Clear any error messages
  };

  useEffect(() => {
    if (isSaved) {
      window.location.reload(false);
    }
  }, [isSaved]);

  return (
    <div className="lecture-title">
      {error && <p className="error">{error}</p>}
      {isEditing ? (
        <div className="editing-container">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            autoFocus
            className="edit-input"
          />
          <button onClick={handleSaveClick} className="save-button">
            <FontAwesomeIcon icon={faSave} />
          </button>
          <button onClick={handleCloseClick} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
          
        </div>
      ) : (
        <h1 className="title">
          {isLoading ? 'Saving...' : title}
          <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={handleEditClick} />
        </h1>
      )}
    </div>
  );
};

export default LectureTitle;