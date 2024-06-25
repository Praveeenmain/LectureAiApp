import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStopCircle, faArrowCircleUp, faStop } from '@fortawesome/free-solid-svg-icons';
import { Circles } from 'react-loader-spinner';
import Navbar from '../NavBar';
import IntialMessage from "../IntialMessage";
import UserMessage from '../UserMessage';
import Message from '../BotMessage';
import './index.css'; // Assuming you have some custom styles

const VideoContent = () => {
  const { id } = useParams();
  const [videoFile, setVideoFile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [speechRecognitionActive, setSpeechRecognitionActive] = useState(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState(true);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://pdfaibackend.onrender.com/videos/${id}`);
        if (response.ok) {
          const videoDetails = await response.json();
          setVideoFile(videoDetails);
        } else {
          console.error('Failed to fetch Video details');
        }
      } catch (error) {
        console.error('Error fetching Video details:', error);
      }
      setIsLoading(false);
      setIsPlayerLoading(false); 
    };
    fetchVideoDetails();
  }, [id]);

  const toggleVoiceRecognition = () => {
    setSpeechRecognitionActive(!speechRecognitionActive);
    // Add logic for speech recognition if required
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    try {
      const response = await axios.post(`https://pdfaibackend.onrender.com/youtube-ask/${id}`, { question: message });
      if (response.status === 200) {
        const chatbotResponse = response.data.answer;
        setConversation(prevConversation => [
          ...prevConversation,
          { userMessage: message, chatbotResponse }
        ]);
        setMessage('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
    setIsSending(false);
  };
  const handlePredefinedQuestion = async (questionType) => {
  
    setIsSending(true);
    let question;
    switch (questionType) {
      case 'summary':
        question = 'Generate summary';
        break;
      case 'notes':
        question = 'Notes: Point 1, Point 2, ...';
        break;
      case 'qanda':
        question = 'Write a question and answer for this file';
        break;
      default:
        question = questionType; // In case custom types are passed
        break;
    }
    try {
      const response = await axios.post(`https://pdfaibackend.onrender.com/youtube-ask/${id}`, { question });
      if (response.status === 200) {
        const data = response.data;
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
    <>
      <Navbar title="Video AI" />
      <div className='Video-chatbot-container'>
        <div className='Video-chat-popup'>
          {isLoading || isPlayerLoading ? (
            <div className="loader-container">
              <Circles height={80} width={80} color="white" ariaLabel="circles-loading" visible={true} />
            </div>
          ) : videoFile.videoUrl ? (
            <ReactPlayer
              url={videoFile.videoUrl}
              width="100%"
              height="auto"
              controls
              className="playersm"
            />
          ) : null}
        </div>
        <div className="chatmessage-container">
                <IntialMessage
                  initialText={videoFile.title}
                  GoalQuestion={() => handlePredefinedQuestion('What is your main goal with this File?')}
                  AssitantQuestion={() => handlePredefinedQuestion('Explain this in 10 lines')}
                  challenges={() => handlePredefinedQuestion('What can we learn from this file?')}
                />
                {conversation.map((item, index) => (
                  <React.Fragment key={index}>
                    <UserMessage initialMessage={item.userMessage} />
                    <Message
                      initialText={item.chatbotResponse}
                      generateSummary={() => handlePredefinedQuestion('summary')}
                      generateNotes={() => handlePredefinedQuestion('notes')}
                      generateQA={() => handlePredefinedQuestion('qanda')}
                    />
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
                      <FontAwesomeIcon icon={faStop}/>
                    ) : (
                      <FontAwesomeIcon icon={faArrowCircleUp} />
                    )}
                  </button>
                </div>
              </div>
       
      </div>
    </>
  );
};

export default VideoContent;
