import React, { useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import LectureTitle from '../LectureTitle';
import UserMessage from '../UserMessage';
import Navbar from '../NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleUp, faVolumeMute, faMicrophone, faStopCircle,faStop } from '@fortawesome/free-solid-svg-icons';
import Message from '../BotMessage';
import {Circles } from 'react-loader-spinner';
import { useParams } from 'react-router-dom';
import IntialMessage from '../IntialMessage';
import './popup.css';

const PopContent = () => {
  const { id } = useParams();
  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognitionActive, setSpeechRecognitionActive] = useState(false);
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  useEffect(() => {
    const fetchAudioDetails = async (id) => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://pdfaibackend.onrender.com/audiofile/${id}`);
        if (response.ok) {
          const audioFile = await response.json();
          setAudioFile(audioFile);
        } else {
          console.error('Failed to fetch audio details');
        }
      } catch (error) {
        console.error('Error fetching audio details:', error);
      }
      setIsLoading(false);
    };
    fetchAudioDetails(id);
  }, [id]);

  const toggleVoiceRecognition = () => {
    if (!isListening) {
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
      };
      setIsListening(true);
      setSpeechRecognitionActive(true);
    } else {
      recognition.stop();
      setIsListening(false);
      setSpeechRecognitionActive(false);
    }
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
    } else {
      alert('Speech synthesis is not supported in your browser.');
    }
  };

  const handleStopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleSpeakStop = () => {
    if (isSpeaking) {
      handleStopSpeaking();
    } else if (audioFile?.AudioFile?.transcription) {
      handleSpeak(audioFile.AudioFile.transcription);
    }
  };

  const truncateTitle = (title, maxLength) => {
    if (title.length <= maxLength) return title;
    return title.split(' ').slice(0, maxLength).join(' ');
  };

  const handleSendMessage = async () => {
    if (message.trim() === '') {
      alert('Please enter a message');
      return;
    }
    setIsSending(true);
    try {
      const response = await fetch(`https://pdfaibackend.onrender.com/audioask/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: message }),
      });
      if (response.ok) {
        const data = await response.json();
        setConversation((prev) => [...prev, { userMessage: message, chatbotResponse: data.answer }]);
        setMessage('');
      } else {
        console.error('Failed to send message:', response.statusText);
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
    setIsSending(false);
  };

  const bufferToBase64 = (buffer) => {
    const binary = Array.from(new Uint8Array(buffer)).map((byte) => String.fromCharCode(byte)).join('');
    return window.btoa(binary);
  };

  const handlePredefinedQuestion = async (question) => {
    if (!audioFile?.AudioFile?.transcription) return;
   

    // Create a new AbortController
  

    setIsSending(true);
    try {
      const response = await fetch(`https://pdfaibackend.onrender.com/audioask/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      if (response.ok) {
        const data = await response.json();
        setConversation((prev) => [...prev, { userMessage: question, chatbotResponse: data.answer }]);
      } else {
        console.error('Failed to send message:', response.statusText);
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
    setIsSending(false);
  };

  return (
    <div>
      <Navbar title="Audio Ai" />
      <div className="popup">
        <div className="popup-content">
          {isLoading ? (
            <div className="loader-container">
              <Circles height="80" width="80" color="white" ariaLabel="circles-loading" visible={true} />
            </div>
          ) : (
            audioFile && (
              <>
                <div className="audio-player-container">
                  {audioFile.AudioFile?.audio?.data && (
                    <AudioPlayer
                      src={`data:audio/wav;base64,${bufferToBase64(audioFile.AudioFile.audio.data)}`}
                      autoPlay={false}
                      showJumpControls={true}
                      customAdditionalControls={[]}
                      className="audio-player"
                    />
                  )}
                </div>
                <div className="Title-voice">
                  <LectureTitle lecture={{ title: truncateTitle(audioFile.AudioFile.title, 3) }} id={audioFile?.id} onClick={toggleSpeakStop} />
                  <button className="speak-stop-button" onClick={toggleSpeakStop}>
                    <FontAwesomeIcon className={isSpeaking ? 'volume-mute' : 'volumeup-icon'} icon={isSpeaking ? faVolumeMute : faMicrophone} />
                    {!isSpeaking && <img className="volumeup-icon" src="https://res.cloudinary.com/dgviahrbs/image/upload/v1718715561/audio-book_1_htj0pr.png" alt="volumeup" />}
                  </button>
                </div>
                <div className="chatmessage-container">
                  <IntialMessage initialText={audioFile.AudioFile.transcription} GoalQuestion={() => handlePredefinedQuestion('What is your main goal with this File?')} AssitantQuestion={() => handlePredefinedQuestion('Explain this in 10 lines')} challenges={() => handlePredefinedQuestion('What we can learn from this file?')} />
                  {conversation.map((item, index) => (
                    <React.Fragment key={index}>
                      <UserMessage initialMessage={item.userMessage} onSend={handleSendMessage} />
                      <Message initialText={item.chatbotResponse} generateSummary={() => handlePredefinedQuestion('Generate summary')} generateNotes={() => handlePredefinedQuestion('Notes: Point 1, Point 2, ...')} generateQA={() => handlePredefinedQuestion('Write a question and answer for this file')} />
                    </React.Fragment>
                  ))}
                  <div className="input-box-container">
                    <button className="voice-button" onClick={toggleVoiceRecognition}>
                      <FontAwesomeIcon icon={speechRecognitionActive ? faStopCircle : faMicrophone} />
                    </button>
                    <input placeholder="Type your message here..." value={message} onChange={(e) => setMessage(e.target.value)} className="input-box" />
                    <button className="send-message-button" onClick={handleSendMessage}>
                      {isSending ? <FontAwesomeIcon icon={faStop}/> : <FontAwesomeIcon icon={faArrowCircleUp} />}
                    </button>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PopContent;
