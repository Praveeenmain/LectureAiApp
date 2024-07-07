import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop, faUpload, faTrash, faSpinner, faEllipsisV,faGlobe } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Lectures from '../AllLectures';

import Navbar from '../NavBar';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './index.css';

const AudioRecorder = () => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [language, setLanguage] = useState('en'); // Default language is English

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
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    // Add your language change logic here
  };

  const uploadRecording = async () => {
    setIsUploading(true);
    try {
      if (!recording) {
        console.error('No recording to upload');
        return;
      }
  
      const blob = await fetch(recording.src).then((response) => response.blob());
      const formData = new FormData();
      formData.append('audio', blob, 'recording.mp3');
  
      const response = await axios.post('https://pdfaibackend.onrender.com/upload-transcribe', formData);
      console.log('Upload successful:', response.data);
      setRecording(null);
      setUploadSuccess(true); // Set upload success state
    } catch (error) {
      console.error('Error uploading to backend:', error);
    }
    setIsUploading(false);
  };
  
  useEffect(() => {
    if (uploadSuccess) {
      window.location.reload(false);
    }
  }, [uploadSuccess]);

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
      <Navbar title="Audio Ai" />
      <div className="audio-recorder-container">
       

        <div className="audio-content-box">
          <button
            className={`record-button ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <FontAwesomeIcon className='stop-microphone' icon={faStop} /> : <FontAwesomeIcon className='stop-microphone' icon={faMicrophone} />}
          
          
          
          </button>
          <h1 className="record-title">Record</h1>
          {isRecording && (
            <div className="waves">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
            <div className="language-selector">
        <FontAwesomeIcon className="language-icon" icon={faGlobe} />
        <select value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          {/* Add more language options as needed */}
        </select>
      </div>
        </div>

        {recording && (
          <div className="recorded-audio-container">
           
            <div className="audio-controls-and-date">
              
              <AudioPlayer
                src={recording.src}
                customAdditionalControls={[]} 
                customVolumeControls={[]} 
                showJumpControls={false}
                layout="grid" 
                autoPlay={false}
                showFilledProgress={false}
                style={{ backgroundColor: 'black', color: 'white', maxWidth: '350px' }} // Added maxWidth style
              />
                
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
                    <div className="date-time">{formattedDate}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {uploadSuccess && (
          <div className="success-message">
            <p>Upload successful!</p>
          </div>
        )}
      </div>
      <h1 className='Lecture-heading'>Lectures</h1>
      <Lectures />
     
    </>
  );
};

export default AudioRecorder;
