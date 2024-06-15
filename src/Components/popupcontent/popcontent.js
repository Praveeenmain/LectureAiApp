import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faTimes, faTrash, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { Audio } from 'react-loader-spinner';
import './popup.css';

const PopContent = ({ handleClose, audioFile }) => {
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioElementRef = useRef(null);

  const toggleDeleteOptions = () => {
    setShowDeleteOptions(!showDeleteOptions);
  };

  const handleDelete = () => {
    if (!audioFile) return;

    console.log('Delete audio file:', audioFile);

    const url = `https://lectureaibackend.onrender.com/audio-files/${audioFile._id}`;

    axios.delete(url)
      .then(response => {
        console.log('Audio file deleted successfully');
        handleClose();
      })
      .catch(error => {
        console.error('Error deleting audio file:', error);
        alert('Failed to delete audio file. Please try again.');
      });
  };

  const playRecording = () => {
    if (audioElementRef.current) {
      audioElementRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error playing audio:', error);
          alert('Failed to play audio. Please try again.');
        });

      audioElementRef.current.onended = () => {
        setIsPlaying(false);
      };

      audioElementRef.current.onerror = () => {
        setIsPlaying(false);
        console.error('Audio playback error');
      };
    }
  };

  const pauseRecording = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div id="popup" className="popup">
      <div className="popup-content">
        <div className="audio-icon">
              <div className="audio-player-container">
                <button className="play-pause-button" onClick={isPlaying ? pauseRecording : playRecording}>
                  <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                </button>
                <audio ref={audioElementRef} src={`data:audio/wav;base64,${audioFile.audio}`} />
                {isPlaying && (
                  <div className="loading-spinner">
                    <Audio
                      height={30}
                      width={30}
                      radius={9}
                      color="white"
                      ariaLabel="Loading"
                      visible={isPlaying}
                    />
                  </div>

                )} <p>Recorded Lecture</p>
              </div>

              <div className="options-menu" onClick={toggleDeleteOptions}>
                <FontAwesomeIcon icon={faEllipsisV} size="lg" />

                {showDeleteOptions && (
                  <div className="delete-options">
                    <button onClick={handleDelete} className="delete-button">
                      <FontAwesomeIcon icon={faTrash} /> 
                    </button>
                    <button onClick={toggleDeleteOptions} className="cancel-button">
                      <FontAwesomeIcon icon={faTimes} /> 
                    </button>
                  </div>
                )}
              </div>
        </div>




        <span className="close" onClick={handleClose}>&times;</span>
        <p>{audioFile.title}</p>
        <p>{audioFile.chatResponse}</p>
        <div>
          <button className="generate-notes-btn">Generate Notes</button>
          <button className="generate-summary-btn">Generate Summary</button>
        </div>
      </div>
      <div>
        <button>Ask question</button>
      </div>
    </div>
  );
};

export default PopContent;
