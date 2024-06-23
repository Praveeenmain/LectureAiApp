import Navbar from "../NavBar";
import UserMessage from '../UserMessage';
import Message from '../BotMessage';
import { TailSpin } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faMicrophone, faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { Circles } from "react-loader-spinner";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './index.css'
const NoteDetails = () => {
  const { id } = useParams();
  const [noteFile, setNoteFile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [speechRecognitionActive, setSpeechRecognitionActive] = useState(false);

  useEffect(() => {
    const fetchNoteDetails = async (id) => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://pdfaibackend.onrender.com/notefile/${id}`);
        if (response.ok) {
          const noteDetails = await response.json();
          setNoteFile(noteDetails.pdfFile);
        } else {
          console.error('Failed to fetch note details');
        }
      } catch (error) {
        console.error('Error fetching note details:', error);
      }
      setIsLoading(false);
    };
    fetchNoteDetails(id);
  }, [id]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    try {
      const response = await axios.post(`https://pdfaibackend.onrender.com/ask/${id}`, { question: message });
      if (response.status === 200) {
        const chatbotResponse = response.data.answer;
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

  const toggleVoiceRecognition = () => {
    setSpeechRecognitionActive(!speechRecognitionActive);
    // Add logic for speech recognition if required
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
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
          />
      </div>
        ) : (
          <>
           <div className="NotesAi-chatbot-container">
            <div className="NoteAi-content">
                
                <div className="chatmessage-container">
              <Message initialText={`Ask me about ${noteFile.title}`} />
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
















            </div>
           
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default NoteDetails;
