import { useRef, useState } from 'react';
import Navbar from "../NavBar";
import LabelBottomNavigation from '../BottomNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faComment } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './index.css';

const wsUrl = `wss://websockect.onrender.com`;

const VoiceGpt = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [socket, setSocket] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioChunks = useRef([]);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setTimer(0);
  };

  const startRecording = async () => {
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    newSocket.onmessage = event => {
      setIsResponding(true);
      const audioBlob = new Blob([event.data], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => {
        setIsResponding(false);
        setIsListening(true);
      };
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    newSocket.onerror = error => {
      console.error('WebSocket error:', error);
    };

    setSocket(newSocket);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newMediaRecorder = new MediaRecorder(stream);

    newMediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        audioChunks.current = [];
        newSocket.send(audioBlob);
      }
    };

    newMediaRecorder.start(1000); // Collect audio data in 1 second chunks
    setMediaRecorder(newMediaRecorder);
    setIsRecording(true);
    setIsListening(true);
    startTimer(); // Start the timer when recording starts
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    if (socket) {
      socket.close();
    }
    setIsRecording(false);
    setIsListening(false);
    setIsResponding(false);
    stopTimer(); // Stop and reset the timer when recording stops
  };

  return (
    <>
      <Navbar title="VoiceGpt" />
      <div className="voice-ai-controls">
        <div className='voice-gpt-controls-container'>
          <button className="voice-ai-talk-button" onClick={startRecording} disabled={isRecording}>
            <FontAwesomeIcon icon={faMicrophone} />
          </button>
          <button className="click-buttton" onClick={startRecording} disabled={isRecording}>
            Click to Talk
          </button>
          <Link to="/chat" className="voice-add-file-button">
            <FontAwesomeIcon icon={faComment} />
          </Link>
        </div>

        {isRecording && (
          <div className="voice-ai-popup">
            <div className="voice-ai-popup-content">
              <div className="voice-ai-popup-header">
                <p className="voice-ai-profile-name">Voice Gpt</p>
                <p className="voice-ai-profile-greeting">Hello, I am Your Ai Assistant</p>
                <FontAwesomeIcon icon={faMicrophone} size="5x" />
                <div className="voice-ai-timer">
                  {new Date(timer * 1000).toISOString().substr(11, 8)}
                </div>
              </div>
              <button className="voice-ai-cancel-button" onClick={stopRecording}>
                Stop
              </button>
              {isResponding ? <p>Responding...</p> : isListening && <p>Listening...</p>}
            </div>
          </div>
        )}
      </div>
      <LabelBottomNavigation />
    </>
  );
};

export default VoiceGpt;
