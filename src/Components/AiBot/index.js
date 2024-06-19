import React, { useState } from 'react';
import LabelBottomNavigation from '../BottomNav';
import Navbar from '../NavBar';

import './index.css';

const AiBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSendMessage = () => {
        if (input.trim()) {
            setMessages([...messages, { sender: 'user', text: input }]);
            setInput('');
            setMessages([...messages, { sender: 'user', text: input }, { sender: 'bot', text: `You said: ${input}` }]);
        }
    };

    return (
        <>
        <Navbar title="Lecture Bot"/>
        <div className="AiBot-container">

          
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Type your message here..."
                    className="message-input"
                />
                <button onClick={handleSendMessage} className="send-button">Send</button>
            </div>
            <LabelBottomNavigation/>
        </div>
        </>
    );
};

export default AiBot;
