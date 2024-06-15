import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop, faUpload, faTrash, faSpinner, faPlay, faPause, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Lectures from '../AllLectures';
import {Audio} from "react-loader-spinner"
import './index.css';  // Import the CSS file

const AudioRecorder = () => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioElementRef = useRef(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const chunks = [];

        mediaRecorder.addEventListener('dataavailable', event => {
          chunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', () => {
          const blob = new Blob(chunks, { type: 'audio/mp3' });
          const url = URL.createObjectURL(blob);
          setRecording({ src: url, dateTime: new Date() });
          setIsRecording(false);
        });

        setIsRecording(true);
        mediaRecorder.start();
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const uploadRecording = async () => {
    setIsUploading(true);
    try {
      const blob = await fetch(recording.src).then((response) => response.blob());
      const formData = new FormData();
      formData.append('audio', blob, 'recording.mp3');

      const response = await axios.post('https://lectureaibackend.onrender.com/upload-transcribe', formData);
      console.log('Upload successful:', response.data);
      setRecording(null);
      setUploadSuccess(true); // Set upload success state
    } catch (error) {
      console.error('Error uploading to backend:', error);
    }
    setIsUploading(false);
  };

  const playRecording = () => {
    if (audioElementRef.current) {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setRecording(null);
    alert("Lecture Deleted");
  };

  const toggleDeleteMenu = () => {
    setShowDeleteMenu(!showDeleteMenu);
  };

  const formattedDate = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: 'numeric',
    minute: 'numeric'
  });

  return (
    <>
      <div className="audio-recorder-container">
        <h1 className="record-title">Record</h1>

        <div className="audio-content-box">
          <button
            className={`record-button ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <FontAwesomeIcon className='stop-microphone' icon={faStop} /> : <FontAwesomeIcon className='stop-microphone' icon={faMicrophone} />}
          </button>
          {isRecording && (
            <div className="waves">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </div>

        {recording && (
          <div className="recorded-audio-container">
            <div className="audio-controls-and-date">
              <button className="play-pause-button" onClick={isPlaying ? pauseRecording : playRecording}>
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                
              </button>
              {isPlaying && (
                   <Audio
                   height={30}
                   width={30}
                   radius={9}
                   color="white"
                   ariaLabel="Loading"
                   visible={isPlaying}
                 />
                )}
              <p className="date-time">{formattedDate}</p>
            </div>
            <div className="upload-and-delete-buttons">
              <button className="upload-button" onClick={uploadRecording} disabled={isUploading}>
                {isUploading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faUpload} />}
              </button>

              <div className="delete-menu">
                <button className="delete-menu-button" onClick={toggleDeleteMenu}>
                  <FontAwesomeIcon icon={faEllipsisV} />
                </button>
                {showDeleteMenu && (
                  <div className="delete-menu-content">
                    <button className="delete-menu-option" onClick={deleteRecording}>
                      <FontAwesomeIcon icon={faTrash} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <audio ref={audioElementRef} src={recording.src} onEnded={() => setIsPlaying(false)} />
          </div>
        )}

        {uploadSuccess && (
          <div className="success-message">
            <p>Upload successful!</p>
          </div>
        )}

      </div>
      <h1 className='Lecture-heading'>Lectures</h1>
       <Lectures/>
    </>
  );
};

export default AudioRecorder;
