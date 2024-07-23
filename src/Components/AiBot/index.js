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
    const [isSending, setIsSending] = useState(false);
    const [botIsTyping, setBotIsTyping] = useState(false);
    const token = Cookie.get('jwt_token');

    const handleSendMessage = async () => {
        if (message.trim()) {
            const newMessage = { sender: 'user', text: message };
            const newMessages = [...messages, newMessage];
            setMessages(newMessages);
            setMessage('');

            try {
                setIsSending(true);
                setBotIsTyping(true);
                const response = await axios.post('https://taaibackend.onrender.com/aichat', 
                    { question: message },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const botResponse = response.data.answer;

                const botMessage = { sender: 'bot', text: botResponse };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error state or display an error message to the user
            } finally {
                setIsSending(false);
                setBotIsTyping(false);
            }
        }
    };

    const handlePredefinedQuestion = async (question) => {
        const newMessage = { sender: 'user', text: question };
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setMessage(question);

        try {
            setIsSending(true);
            setBotIsTyping(true);
            console.log(token)
            const response = await axios.post('https://taaibackend.onrender.com/aichat', 
                { question },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const botResponse = response.data.answer;

            const botMessage = { sender: 'bot', text: botResponse };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsSending(false);
            setBotIsTyping(false);
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
                    initialText="  Hello I am Your AI Assistant" 
                    GoalQuestion={() => handlePredefinedQuestion('What is your main goal with this file?')} 
                    AssistantQuestion={() => handlePredefinedQuestion('Explain this in 10 lines')} 
                    challenges={() => handlePredefinedQuestion('What can we learn from this file?')} 
                />
                {messages.map((item, index) => (
                    item.sender === 'user' 
                        ? <UserMessage key={index} initialMessage={item.text} onSend={handleSendMessage} />
                        : <Message key={index} initialText={item.text} />
                ))}
                {botIsTyping && (
                    <div className="bot-message-container">
                        <div className="botmessage-loader">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                )}
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
