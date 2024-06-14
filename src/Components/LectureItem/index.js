import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTrash, faPlay, faPause, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import LectureTitle from '../LectureTitle';
import './index.css';

const LectureItem = ({ lecture, deleteRecording, deletingId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const toggleAudioPlayer = () => {
    setIsPlaying(!isPlaying);
  };

  const formattedDate = new Date(lecture.date).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: 'numeric',
    minute: 'numeric'
  });

  const toggleDeletePopup = () => {
    setShowDeletePopup(!showDeletePopup);
  };

  return (
    <div className="lecture-item">
      <div className='audio-lecture-time-title'>
        <div className='audio-time'>
          <FontAwesomeIcon
            icon={isPlaying ? faPause : faPlay}
            size="2x"
            className="media-symbol"
            onClick={toggleAudioPlayer}
            style={{ cursor: 'pointer' }}
          />
          <audio ref={audioRef} src={`data:audio/wav;base64,${lecture.audio}`} />
          <p className='date-time'>{formattedDate}</p>
        </div>
        <div className='lecture-title'>
          <LectureTitle lecture={lecture} id={lecture._id} />
        </div>
      </div>

      <div className='title-delete'>
        <FontAwesomeIcon
          icon={faEllipsisV}
          size="2x"
          className="ellipsis-menu"
          onClick={toggleDeletePopup}
          style={{ cursor: 'pointer' }}
        />

        {showDeletePopup && (
          <div className="delete-popup">
            <p className='sure-paragraph'>Are you sure you want to delete this recording?</p>
            <button
              className="delete-confirm-button"
              onClick={() => deleteRecording(lecture._id)}
              disabled={deletingId === lecture._id}
            >
              {deletingId === lecture._id ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon icon={faTrash} />
              )}
              Delete
            </button>
            <button className="cancel-button" onClick={toggleDeletePopup}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LectureItem;
