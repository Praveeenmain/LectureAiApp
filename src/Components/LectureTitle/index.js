import React, { useState } from 'react';

const LectureTitle = ({ lecture,id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(lecture.title);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    
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
    } catch (error) {
      console.error('Error updating the title:', error);
     
    }
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleSaveClick}
          autoFocus
        />
      ) : (
        <p className='title' onClick={handleEditClick}>
          {title}
        </p>
      )}
    </div>
  );
};

export default LectureTitle;
