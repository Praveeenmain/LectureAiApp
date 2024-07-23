import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStopCircle, faArrowCircleUp, faStop } from '@fortawesome/free-solid-svg-icons';
import { Circles } from 'react-loader-spinner';
import Navbar from '../NavBar';
import IntialMessage from '../IntialMessage';
import UserMessage from '../UserMessage';
import Message from '../BotMessage';
import Cookie from 'js-cookie';

const ClassAsk = () => {
  const { id } = useParams();
  const [questionFile, setQuestionFile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [speechRecognitionActive, setSpeechRecognitionActive] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const token = Cookie.get('jwt_token');

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://taaibackend.onrender.com/pqfile/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const questionFile = await response.json();
          setQuestionFile(questionFile);
        } else {
          console.error('Failed to fetch question details');
        }
      } catch (error) {
        console.error('Error fetching question details:', error);
      }
      setIsLoading(false);
    };
    fetchQuestionDetails();
  }, [id, token]);

  const toggleVoiceRecognition = () => {
    setSpeechRecognitionActive(!speechRecognitionActive);
    // Add logic for speech recognition if required
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Immediately add user message to conversation
    const newUserMessage = { userMessage: message, chatbotResponse: '' };
    setConversation(prevConversation => [...prevConversation, newUserMessage]);
    setMessage('');
    setIsSending(true);
    setIsTyping(true);

    try {
      const response = await axios.post(`https://taaibackend.onrender.com/askprevious/${id}`, 
        { question: message },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const chatbotResponse = response.data.answer;
        setConversation(prevConversation =>
          prevConversation.map((msg, index) =>
            index === prevConversation.length - 1
              ? { ...msg, chatbotResponse }
              : msg
          )
        );
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error.response ? error.response.data : error.message);
    }

    setIsSending(false);
    setIsTyping(false);
  };

  const handlePredefinedQuestion = async (questionType) => {
    setIsSending(true);
    setIsTyping(true);

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
        question = questionType;
        break;
    }
    try {
      const response = await axios.post(`https://taaibackend.onrender.com/askprevious/${id}`, 
        { question },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const data = response.data.answer;
        setConversation(prev => [...prev, { userMessage: question, chatbotResponse: data }]);
      } else {
        console.error('Failed to send message:', response.statusText);
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }

    setIsSending(false);
    setIsTyping(false);
  };

  return (
    <>
      <Navbar title="Class Test Ai" />
      <div className='Video-chatbot-container'>
        <div className="chatmessage-container">
          {isLoading ? (
            <div className='loader-container'>
              <Circles height="80" width="80" color="white" ariaLabel="circles-loading" visible={true} />
            </div>
          ) : (
            <>
              <IntialMessage
                initialText={questionFile.title}
                GoalQuestion={() => handlePredefinedQuestion('What is your main goal with this File?')}
                AssitantQuestion={() => handlePredefinedQuestion('Explain this in 10 lines')}
                challenges={() => handlePredefinedQuestion('What can we learn from this file?')}
              />
              {conversation.map((item, index) => (
                <React.Fragment key={index}>
                  <UserMessage initialMessage={item.userMessage} />
                  {item.chatbotResponse ? (
                    <Message
                      initialText={item.chatbotResponse}
                      generateSummary={() => handlePredefinedQuestion('summary')}
                      generateNotes={() => handlePredefinedQuestion('notes')}
                      generateQA={() => handlePredefinedQuestion('qanda')}
                    />
                  ) : index === conversation.length - 1 && isTyping ? (
                    <div className="bot-message-container">
                      <div className="botmessage-loader">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  ) : null}
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
                    <FontAwesomeIcon icon={faStop} />
                  ) : (
                    <FontAwesomeIcon icon={faArrowCircleUp} />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ClassAsk;
