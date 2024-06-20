import React, { useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import LectureTitle from '../LectureTitle';
import 'react-h5-audio-player/lib/styles.css';
import UserMessage from '../UserMessage';
import Navbar from '../NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faVolumeMute, faMicrophone, faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import Message from '../BotMessage';
import { TailSpin, Circles } from 'react-loader-spinner';

import { useParams } from 'react-router-dom';
import './popup.css';

const PopContent = () => {
  const { id } = useParams();
  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognitionActive, setSpeechRecognitionActive] = useState(false);

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  const API_KEY = 'AIzaSyB5jwfd5r7T4cssflgHmnItKmzCNoOEGlI';
  const MODEL_NAME = 'gemini-1.0-pro';

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.75,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  useEffect(() => {
    const fetchAudioDetails = async (_id) => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://lectureaibackend.onrender.com/audio-files/${id}`);
        if (response.ok) {
          const audioFile = await response.json();
          setAudioFile(audioFile);
        } else {
          console.error('Failed to fetch book details');
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
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
      setSpeechUtterance(utterance);
      setIsSpeaking(true);
    } else {
      alert('Speech synthesis is not supported in your browser.');
    }
  };

  const handleStopSpeaking = () => {
    if (speechUtterance) {
      window.speechSynthesis.cancel();
      setSpeechUtterance(null);
      setIsSpeaking(false);
    }
  };

  const toggleSpeakStop = () => {
    if (isSpeaking) {
      handleStopSpeaking();
    } else if (audioFile && audioFile.chatResponse) {
      handleSpeak(audioFile.chatResponse);
    }
  };

  const truncateTitle = (title, maxLength) => {
    if (title.length <= maxLength) {
      return title;
    }
    const words = title.split(' ');
    return words.slice(0, maxLength).join(' ');
  };

  const handleSendMessage = async () => {
    if (message.trim() === '') {
      alert('Please enter a message');
      return;
    }
    setIsSending(true);
    try {
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
      });
      const prompt = `${audioFile.title}: ${message}`;
      const result = await chat.sendMessage(prompt);
      const response = result.response;;

      setConversation((prevConversation) => [
        ...prevConversation,
        { userMessage: message, chatbotResponse: response.text() }
      ]);

      setMessage('');
      setIsSending(false);
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please try again.');
      setIsSending(false);
    }
  };

  return (
    <div>
      <Navbar title="Audio Ai" />
      <div className="popup">
        <div className="popup-content">
          {isLoading && (
            <div className="loader-container">
              <Circles
                height="80"
                width="80"
                color="white"
                ariaLabel="circles-loading"
                visible={true}
              />
            </div>
          )}
          {!isLoading && audioFile && (
            <>
              <div className="audio-player-container">
                {audioFile.audio && (
                  <AudioPlayer
                    src={`data:audio/wav;base64,${audioFile.audio}`}
                    autoPlay={false}
                    showJumpControls={true}
                    customAdditionalControls={[]}
                    className="audio-player"
                  />
                )}
              </div>
              <div className="Title-voice">
                <LectureTitle lecture={{ title: truncateTitle(audioFile.title, 3) }} id={audioFile._id} onClick={toggleSpeakStop} />
                <button className="speak-stop-button" onClick={toggleSpeakStop}>
                  {isSpeaking ? (
                    <FontAwesomeIcon className='volume-mute' icon={faVolumeMute} />
                  ) : (
                    <img className="volumeup-icon" src="https://res.cloudinary.com/dgviahrbs/image/upload/v1718715561/audio-book_1_htj0pr.png" alt="volumeup" />
                  )}
                </button>
              </div>
              <div className="chatmessage-container">
                <Message initialText={audioFile.chatResponse} />
                {conversation.map((item, index) => (
                  <React.Fragment key={index}>
                    <UserMessage initialMessage={item.userMessage} />
                    <Message initialText={item.chatbotResponse} />
                  </React.Fragment>
                ))}
                <div className="input-box-container">
                  <button className="voice-button" onClick={toggleVoiceRecognition}>
                    <FontAwesomeIcon icon={speechRecognitionActive ? faStopCircle : faMicrophone} />
                  </button>
                  <input
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="input-box"
                  />
                  <button className="send-message-button" onClick={handleSendMessage}>
                    {isSending ? (
                      <TailSpin
                        visible={true}
                        height="20"
                        width="20"
                        color="white"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                      />
                    ) : (
                      <FontAwesomeIcon icon={faPaperPlane} />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopContent;
