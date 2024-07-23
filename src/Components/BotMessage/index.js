import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  faCopy, faShareAlt, faRandom, faCheck,
  faVolumeMute, faEdit
} from '@fortawesome/free-solid-svg-icons';
import './index.css';

const Message = ({ initialText, generateSummary, generateNotes, generateQA }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [editedText, setEditedText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
   const text="  "+initialText
  
  useEffect(() => {
    if (text) {
    
      let index =0 ;
      const timer = setInterval(() => {
        setDisplayedText(prev => {
          if (index < text.length) {
           
            return prev + text[index];
          }
          return prev;
        });
        index += 1;
        if (index === text.length) {
          clearInterval(timer);
          // Scroll to top when the message is fully displayed
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 10); // Delay to ensure content is rendered
        }
      }, -20);
      return () => clearInterval(timer);
    }
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateSummary = () => {
    alert('Generating summary...');
    generateSummary();
  };

  const handleGenerateNotes = () => {
    alert('Generating notes...');
    generateNotes();
  };

  const handleGenerateQA = () => {
    alert('Generating Q/A...');
    generateQA();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Chat Response',
          text: displayedText,
        });
        console.log('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Web Share API is not supported in your browser.');
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
      handleSpeak(displayedText);
    }
  };

  const handleEditTextChange = (event) => {
    setEditedText(event.target.value);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(displayedText);
  };

  const handleSaveEdit = () => {
    setDisplayedText(editedText);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="action-buttons">
      {isEditing ? (
        <div className="edit-container">
          <textarea
            className="edit-textarea"
            value={editedText}
            onChange={handleEditTextChange}
          />
          <div className="edit-actions">
            <button className="bot-save-button" onClick={handleCancelEdit}>
              Cancel
            </button>
            <button className="bot-save-button" onClick={handleSaveEdit}>
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="chatbot-message">{displayedText}</div>
      )}
      <div className="act-buttons">
        <CopyToClipboard text={displayedText} onCopy={handleCopy}>
          <button className="copy-button" style={{ color: 'grey' }}>
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
          </button>
        </CopyToClipboard>

        <button className="share-button" onClick={handleShare} style={{ color: 'grey' }}>
          <FontAwesomeIcon icon={faShareAlt} />
        </button>

        <button className="additional-button" onClick={toggleSpeakStop} style={{ color: 'grey' }}>
          {isSpeaking ? <FontAwesomeIcon icon={faVolumeMute} /> : (
            <img className='volumeup-bot' src="https://res.cloudinary.com/dgviahrbs/image/upload/v1718715561/audio-book_1_htj0pr.png" alt="volumeup" />
          )}
        </button>

        <button className="additional-button" onClick={handleEdit} style={{ color: 'grey' }}>
          <FontAwesomeIcon icon={faEdit} />
        </button>

        <button className="additional-button" onClick={toggleOptions} style={{ color: 'grey' }}>
          <FontAwesomeIcon icon={faRandom} />
        </button>
      </div>
      {showOptions && (
        <div className="options-menu">
          <button className="option-button" onClick={handleGenerateSummary}>
            Summary
          </button>
          <button className="option-button" onClick={handleGenerateNotes}>
            Notes
          </button>
          <button className="option-button" onClick={handleGenerateQA}>
            Q/A
          </button>
        </div>
      )}
    </div>
  );
};

export default Message;
