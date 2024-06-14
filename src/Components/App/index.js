import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop, faUpload, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import ReactAudioPlayer from 'react-audio-player';
import axios from 'axios';
import './index.css';  // Import the CSS file

import Lectures from '../Lectures';

const AudioRecorder = () => {
  const [recording, setRecording] = useState(null);  // State to store the recorded audio
  const [isRecording, setIsRecording] = useState(false);  // State to track if currently recording
  const [isUploading, setIsUploading] = useState(false);  // State to track if currently uploading
  const mediaRecorderRef = useRef(null);  // Ref to store the MediaRecorder instance
  const audioPlayerRef = useRef(null);  // Ref to store the ReactAudioPlayer instance

  // Function to start recording audio
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

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  // Function to upload the recorded audio to a backend server
  const uploadRecording = async () => {
    setIsUploading(true);
    try {
      const blob = await fetch(recording.src).then(response => response.blob());
      const formData = new FormData();
      formData.append('audio', blob, 'recording.mp3');

      const response = await axios.post('https://lectureaibackend.onrender.com/upload-transcribe', formData);
      console.log('Upload successful:', response.data);
      setRecording(null);  
    } catch (error) {
      console.error('Error uploading to backend:', error);
    }
    setIsUploading(false);
  };

  
  const deleteRecording = () => {
    setRecording(null);  
    alert("Lecture Deleted");
  };

  return (
    <>
     
      <div className="audio-recorder-container">
        <h1 className="record-title">Record</h1>
        <div className="audio-content-box">
          <button
            className={`record-button ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <FontAwesomeIcon icon={faStop} /> : <FontAwesomeIcon icon={faMicrophone} />}
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
            <div className="audio-time">
              <ReactAudioPlayer
                className="react-audio-player"
                src={recording.src}
                controls
                ref={audioPlayerRef}
              />
              <p className="time">{recording.dateTime.toLocaleString()}</p>
            </div>
            <div>
              <button className="upload-button" onClick={uploadRecording} disabled={isUploading}>
                {isUploading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faUpload} />}
              </button>
              <button className="delete-button" onClick={deleteRecording}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        )}
        <Lectures/>
        
      </div>
    </>
  );
};

export default AudioRecorder;
