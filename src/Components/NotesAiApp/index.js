import Navbar from "../NavBar";
import React, { useState } from 'react';
import './index.css';
import AllNotes from '../AllNotes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AddedFileContainer from '../AddFilePopup'
// Ensure the correct path for the worker file


const NotesAi = () => {
  
  const [showPopup, setShowPopup] = useState(false);
  
  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
 
  return (
    <>
      <Navbar title="Notes Ai" />

      <div className='Notes-Ai-container'>

        <div className='Notes-content-box'>
        <button className='NoteAi-Plus-button' onClick={handleOpenPopup}> <FontAwesomeIcon icon={faPlus} /> </button>
          <h1 className='Add-file-heading'> Upload Notes</h1>
        </div>
        {showPopup && <AddedFileContainer onClose={handleClosePopup}  />}
        <AllNotes />
      </div>
    </>
  );
};

export default NotesAi;
