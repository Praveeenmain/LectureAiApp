import React, { useState, useRef, useEffect, useCallback } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import axios from 'axios';
import 'react-h5-audio-player/lib/styles.css';
import './index.css';

const agentId = process.env.REACT_APP_AGENT_ID;
const apiKey = process.env.REACT_APP_API_KEY;

const wsUrl = `wss://api.play.ai/v1/talk/${agentId}`;

const VoiceAIComponent = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isResponding, setIsResponding] = useState(null);
  const [error, setError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [profileDetails, setProfileDetails] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const timerRef = useRef(null);
  const accumulatedAudioData = useRef('');

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        headers: {
          Authorization: apiKey,
          'X-USER-ID': process.env.REACT_APP_USER_ID,
          accept: 'application/json'
        }
      };

      try {
        const response = await axios.get(`http://localhost:3000/api/v1/agents/${agentId}`, options);
        setProfileDetails(response.data);
      } catch (error) {
        console.error('Axios error:', error);
        setError('Failed to fetch profile details.');
      }
    };

    fetchData();
  }, []);

  const handleAudioStream = useCallback(async () => {
    
    const base64Data = accumulatedAudioData.current;
    const blob = base64toBlob(base64Data);

    const url = URL.createObjectURL(blob);
    setAudioURL(url);

    accumulatedAudioData.current = ''; // Clear accumulated data
     setIsResponding(false)
     setIsListening(true)
  }, []);

  useEffect(() => {
    if (isConnected) {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        wsRef.current.send(JSON.stringify({ type: 'setup', apiKey: apiKey, outputFormat: 'mp3', outputSampleRate: 24000 }));
        console.log('Setup message sent');
      };

      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case 'voiceActivityStart':
            console.log('Voice activity started');
            setIsListening(true); // Set listening status
            setIsResponding(false);
            break;
            case 'audioStream':
              setIsListening(false); // Set listening status
              setIsResponding(true);
            accumulatedAudioData.current += message.data;
                
            break;
          case 'voiceActivityEnd':
            console.log('Voice activity ended');
          
            setIsResponding(false);
           
            handleAudioStream();
            setIsListening(true); // Reset listening status
           
            break;
         
          case 'error':
            console.error('Error from server:', message.message);
            setError(message.message);
            break;
          default:
            console.log('New message type:', message.type);
            break;
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket error occurred.');
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket closed');
        setIsConnected(false);
      };
    }
  }, [isConnected, handleAudioStream]);

  const handleStartRecording = async () => {
    if (!isConnected) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (event) => {
        const base64Data = await blobToBase64(event.data);
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'audioIn', data: base64Data }));
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      startTimer();
    
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to start recording.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
      window.location.reload();
    }
  };

  const base64toBlob = (base64Data) => {
    const sliceSize = 512;
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: 'audio/mpeg' });
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="voice-ai-container">
      <h2>Voice AI Interaction</h2>
      <div className="voice-ai-controls">
        {!isConnected && (
          <button className="voice-ai-connect-button" onClick={() => setIsConnected(true)}>
            Connect
          </button>
        )}
        {isConnected && (
          <>
            <button
              className={`voice-ai-talk-button ${isRecording ? 'voice-ai-recording' : ''}`}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={!isConnected}
            >
              {isRecording ? 'Stop' : 'Talk'}
            </button>
          </>
        )}
        {isRecording && (
          <div className="voice-ai-popup">
            <div className="voice-ai-popup-content">
              <div className="voice-ai-popup-header">
                <img className={`voice-ai-profile-image ${isPlaying ? 'blink-animation' : ''}`} src={profileDetails.avatarPhotoUrl} alt="Profile" />
                <div>
                  <p className="voice-ai-profile-name">{profileDetails.displayName}</p>
                  <p className="voice-ai-profile-greeting">{profileDetails.greeting}</p>
                </div>
                {isListening && <div className="voice-ai-status">Listening...</div>}
                {isResponding && <div className="voice-ai-status">Responding...</div>}
                <span className="voice-ai-recording-time">{formatTime(recordingTime)}</span>
              </div>
              <AudioPlayer
                autoPlay
                ref={audioPlayerRef}
                src={audioURL}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                style={{ display: 'none' }}
              />
              <p className="voice-ai-powered-by">Powered by Mobishala</p>
              <button className="voice-ai-cancel-button" onClick={handleStopRecording}>
                Cancel
              </button>
            </div>
          </div>
        )}
     
        {error && <div className="voice-ai-error-message">{error}</div>}
      </div>
    </div>
  );
};

export default VoiceAIComponent;
