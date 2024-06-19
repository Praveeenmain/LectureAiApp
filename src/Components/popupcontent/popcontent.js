import React, { useState} from 'react';
import AudioPlayer from 'react-h5-audio-player';
import LectureTitle from '../LectureTitle';
import 'react-h5-audio-player/lib/styles.css';
import  UserMessage from '../UserMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaperPlane,faVolumeMute, faMicrophone, faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import Message from '../BotMessage';
import { TailSpin } from 'react-loader-spinner';
import './popup.css';

const PopContent = ({ handleClose, audioFile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]); // Combined array of user messages and chatbot responses
  const [isListening, setIsListening] = useState(false); // State to track if voice recognition is active
  const [speechRecognitionActive, setSpeechRecognitionActive] = useState(false); // State to manage speech recognition UI

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)(); // Initialize SpeechRecognition object
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US'; // Set language for speech recognition

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

  // Event handler for starting or stopping voice recognition
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
    } else {
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
    setIsLoading(true);
    try {
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
      });

      const prompt = `${audioFile.title}: ${message}`;
      const result = await chat.sendMessage(prompt);
      const response = result.response;
      const chatbotMessage = response.candidates[0].content.parts[0].text;

      // Update conversation with both user message and chatbot response
      setConversation(prevConversation => [
        ...prevConversation,
        { userMessage: message, chatbotResponse: chatbotMessage }
      ]);

      // Clear message input
        setMessage('');
        setIsLoading(false);
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please try again.');
    }
  };
  const SendMessage = async (updatedMessage) => {
    // Check if the message is empty
    if (updatedMessage.trim() === '') {
      alert('Please enter a message');
      return;
    }
  
    // Set loading state to true
    setIsLoading(true);
  
    try {
      // Start a new chat session with the generative model
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
      });
  
      // Prepare the prompt combining lecture title and user message
      const prompt = `${audioFile.title}: ${updatedMessage}`;
  
      // Send the message to the chat model and await response
      const result = await chat.sendMessage(prompt);
      const response = result.response;
  
      // Extract the chatbot's response from the result
      const chatbotMessage = response.candidates[0].content.parts[0].text;
  
      // Update conversation with both user message and chatbot response
      setConversation(prevConversation => [
        ...prevConversation,
        { userMessage: updatedMessage, chatbotResponse: chatbotMessage }
      ]);
  
      // Clear message input and set loading state to false
      setMessage('');
      setIsLoading(false);
  
    } catch (error) {
      // Handle any errors that occur during the chat interaction
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please try again.');
      setIsLoading(false); // Ensure loading state is reset on error
    }
  };
  
 
  return (
    <>
    <div className="popup">
  
      <div className="popup-content">
        <div className="audio-player-container">
          <span className="close" onClick={handleClose}>
            &times;
          </span>
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
    <FontAwesomeIcon icon={faVolumeMute} />
  ) : (
    <img className='volumeup-icon' src="https://res.cloudinary.com/dgviahrbs/image/upload/v1718715561/audio-book_1_htj0pr.png" alt="volumeup" />
  )}
</button>

        </div>

        <div className="chatmessage-container">
        
            <Message text={audioFile.chatResponse} />
       
          {conversation.map((item, index) => (
            <React.Fragment key={index}>
             
           
                <UserMessage  initialMessage={item.userMessage} onSend={SendMessage} />
                <Message text={item.chatbotResponse}/>
            
            </React.Fragment>
          ))}
        </div>

        <div className="input-box-container">
          <button className="voice-button" onClick={toggleVoiceRecognition}>
            <FontAwesomeIcon icon={speechRecognitionActive ? faStopCircle : faMicrophone} />
          </button>
          <textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input-box"
          />
          <button className="send-message-button" onClick={handleSendMessage}>
             {isLoading?(<TailSpin
  visible={true}
  height="20"
  width="20"
  color="white"
  ariaLabel="tail-spin-loading"
  radius="1"
  wrapperStyle={{}}
  wrapperClass=""
  />)
        
              :<FontAwesomeIcon icon= {faPaperPlane}/>
             }
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default PopContent;
