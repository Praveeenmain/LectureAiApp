import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStopCircle, faArrowCircleUp, faStop } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../NavBar';
import UserMessage from '../UserMessage';
import Message from '../BotMessage';
import InitialMessage from '../IntialMessage'; // Assuming corrected import
import './index.css';
import axios from 'axios';

const AiBot = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [speechRecognitionActive, setSpeechRecognitionActive] = useState(false);
    const [conversation, setConversation] = useState([]);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/play-ai-embed@beta";
        script.type = "text/javascript";
        script.async = true;
        script.onload = () => {
            if (typeof window.PlayAI !== 'undefined') {
                window.PlayAI.open('1HKyvLxio89Uq2VDvWzNm');
            }
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const elements = document.querySelectorAll("*:not(script):not(style)");
        elements.forEach(element => {
            if (element.textContent.includes("powered by play.ai")) {
                console.log("Found element:", element);
            }
        });
    }, []);

    const handleSendMessage = async () => {
        if (message.trim()) {
            setIsSending(true);
            const newMessage = { sender: 'user', text: message };
            const newMessages = [...messages, newMessage];
            setMessages(newMessages);
            setMessage('');

            try {
                const response = await axios.post('https://pdfaibackend.onrender.com/askdb', { question: message });
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

    const handlePredefinedQuestion = (question) => {
        const newMessage = { sender: 'user', text: question };
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
    };

    const toggleVoiceRecognition = () => {
        setSpeechRecognitionActive(!speechRecognitionActive);
        // Implement speech recognition logic if needed
    };

    return (
        <>
            <Navbar title="Ai Assistant" />
            <div className="Aichat-chatmessage-container">
                <InitialMessage 
                    initialText="Hello I am Ai Assistant" 
                    GoalQuestion={() => handlePredefinedQuestion('What is your main goal with this File?')} 
                    AssistantQuestion={() => handlePredefinedQuestion('Explain this in 10 lines')} 
                    challenges={() => handlePredefinedQuestion('What we can learn from this file?')} 
                />
                {conversation.map((item, index) => (
                    <React.Fragment key={index}>
                        <UserMessage initialMessage={item.userMessage} onSend={handleSendMessage} />
                        <Message initialText={item.botResponse} />
                    </React.Fragment>
                ))}
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
