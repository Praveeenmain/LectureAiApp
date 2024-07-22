import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStopCircle, faArrowCircleUp, faStop } from '@fortawesome/free-solid-svg-icons';
import { RiRobot3Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import Navbar from '../NavBar';
import UserMessage from '../UserMessage';
import Message from '../BotMessage';
import InitialMessage from '../IntialMessage'; // Assuming corrected import
import Cookie from 'js-cookie';
import './index.css';
import axios from 'axios';

const AiBot = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [speechRecognitionActive, setSpeechRecognitionActive] = useState(false);
    const [conversation, setConversation] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const token = Cookie.get('jwt_token');

    const handleSendMessage = async () => {
        if (message.trim()) {
            setIsSending(true);
            const newMessage = { sender: 'user', text: message };
            const newMessages = [...messages, newMessage];
            setMessages(newMessages);
            setMessage('');

            try {
                const response = await axios.post('https://taaibackend.onrender.com/aichat', 
                    { question: message },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const botResponse = response.data.answer;

                const updatedConversation = [...conversation, { userMessage: message, botResponse }];
                setConversation(updatedConversation);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error state or display an error message to the user
            } finally {
                setIsSending(false);
            }
        }
    };

    const handlePredefinedQuestion = async (question) => {
        const newMessage = { sender: 'user', text: question };
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setMessage(question);

        try {
            const response = await axios.post('/aichat', 
                { question },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const botResponse = response.data.answer;

            const updatedConversation = [...conversation, { userMessage: question, botResponse }];
            setConversation(updatedConversation);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const toggleVoiceRecognition = () => {
        setSpeechRecognitionActive(!speechRecognitionActive);
        // Implement speech recognition logic if needed
    };

    return (
        <>
            <Navbar title="Chat AI" />
            <div className="Aichat-chatmessage-container">
                <InitialMessage 
                    initialText="Hello I am Your AI Assistant" 
                    GoalQuestion={() => handlePredefinedQuestion('What is your main goal with this file?')} 
                    AssistantQuestion={() => handlePredefinedQuestion('Explain this in 10 lines')} 
                    challenges={() => handlePredefinedQuestion('What can we learn from this file?')} 
                />
                {conversation.map((item, index) => (
                    <React.Fragment key={index}>
                        <UserMessage initialMessage={item.userMessage} onSend={handleSendMessage} />
                        <Message initialText={item.botResponse} />
                    </React.Fragment>
                ))}
                <Link to="/voice" className="voice-add-file-button">
                    <RiRobot3Fill />
                </Link>
                <div className="Aichat-fixed-input-box-container">
                    <button className="Aichat-voice-button" onClick={toggleVoiceRecognition}>
                        <FontAwesomeIcon icon={speechRecognitionActive ? faStopCircle : faMicrophone} />
                    </button>
                    <input 
                        placeholder="Type your message here..." 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        className="Aichat-input-box" 
                    />
                    <button className="Aichat-send-message-button" onClick={handleSendMessage}>
                        {isSending ? <FontAwesomeIcon icon={faStop}/> : <FontAwesomeIcon icon={faArrowCircleUp} />}
                    </button>
                </div>
            </div>
        </>
    );
};

export default AiBot;
