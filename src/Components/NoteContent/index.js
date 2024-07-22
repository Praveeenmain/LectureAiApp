import Navbar from "../NavBar";
import UserMessage from '../UserMessage';
import Message from '../BotMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStopCircle, faArrowCircleUp, faStop } from '@fortawesome/free-solid-svg-icons';
import { Circles } from 'react-loader-spinner';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import IntialMessage from "../IntialMessage";
import Cookie from 'js-cookie';
import './index.css';

const NoteDetails = () => {
  const { id } = useParams();
  const [noteFile, setNoteFile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [speechRecognitionActive, setSpeechRecognitionActive] = useState(false);
  const token = Cookie.get('jwt_token');

  useEffect(() => {
    const fetchNoteDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://taaibackend.onrender.com/notes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const noteDetails = await response.json();
          setNoteFile(noteDetails);
        } else {
          console.error('Failed to fetch note details');
        }
      } catch (error) {
        console.error('Error fetching note details:', error);
      }
      setIsLoading(false);
    };

    fetchNoteDetails();
  }, [id, token]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    console.log(message);
    let question = message;
    setIsSending(true);
    try {
      const response = await fetch(`https://taaibackend.onrender.com/noteask/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question }),
      });
      if (response.status === 200) {
        const data = await response.json();
        const chatbotResponse = data.answer;
        console.log(chatbotResponse);
        setConversation((prevConversation) => [
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
    if (!noteFile?.text) return;
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
        question = questionType;
        break;
    }
    try {
      const response = await axios.post(`https://taaibackend.onrender.com/ask/${id}`, { question }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
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

  const toggleVoiceRecognition = () => {
    setSpeechRecognitionActive(!speechRecognitionActive);
  };

  return (
    <>
      <Navbar title="Notes Ai" />
      <div>
        {isLoading ? (
          <div className="loader-container">
            <Circles
              height="80"
              width="80"
              color="white"
              ariaLabel="circles-loading"
              visible={true}
            />
          </div>
        ) : (
          <div className="NotesAi-chatbot-container">
            <div className="NoteAi-content">
              <div className="chatmessage-container">
                <IntialMessage
                  initialText={`Ask me about ${noteFile.title}`}
                  GoalQuestion={() => handlePredefinedQuestion('What is your main goal with this File?')}
                  AssitantQuestion={() => handlePredefinedQuestion('Explain this in 10 lines')}
                  challenges={() => handlePredefinedQuestion('What can we learn from this file?')}
                />
                {conversation.map((item, index) => (
                  <React.Fragment key={index}>
                    <UserMessage initialMessage={item.userMessage} onSend={handleSendMessage} />
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
                      <FontAwesomeIcon icon={faStop} />
                    ) : (
                      <FontAwesomeIcon icon={faArrowCircleUp} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NoteDetails;
