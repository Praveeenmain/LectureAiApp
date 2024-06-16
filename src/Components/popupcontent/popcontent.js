import React, { useState,useEffect } from 'react';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { faCopy, faShareAlt } from '@fortawesome/free-solid-svg-icons';

import './popup.css';

const PopContent = ({ handleClose, audioFile }) => {
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (content, contentType) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: contentType === 'notes' ? 'Notes' : 'Summary',
          text: content,
        });
        console.log('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Web Share API is not supported in your browser.');
    }
  };

  const generateNotes = async () => {
    setIsGeneratingNotes(true);
    setNotes('');

    try {
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
      });

      const prompt = `Generate notes for the following audio transcript: ${audioFile.chatResponse}`;
      const result = await chat.sendMessage(prompt);
      const response = result.response;

      setNotes(response.text());
    } catch (error) {
      console.error('Error generating notes:', error);
      alert('Failed to generate notes. Please try again.');
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummary('');

    try {
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
      });

      const prompt = `Generate a summary for the following audio transcript: ${audioFile.chatResponse}`;
      const result = await chat.sendMessage(prompt);
      const response = result.response;

      setSummary(response.text());
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleDelete = () => {
    if (!audioFile) return;
    
    setIsDeleting(true);

    const url = `https://lectureaibackend.onrender.com/audio-files/${audioFile._id}`;

    axios
      .delete(url)
      .then(response => {
        console.log('Audio file deleted successfully');
        handleClose();
      })
      .catch(error => {
        console.error('Error deleting audio file:', error);
        alert('Failed to delete audio file. Please try again.');
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };
  useEffect(() => {
    if(isDeleting) {
      window.location.reload(false);
    }
  }, [isDeleting]);
  return (
    <div className="popup">
      <div className="popup-content">
        <div className="audio-player-container">
          <span className="close" onClick={handleClose}>
            &times;
          </span>
          <p className="audio-title">{audioFile.title}</p>
          {audioFile.audio && (
            <AudioPlayer
              src={`data:audio/wav;base64,${audioFile.audio}`}
              autoPlay={false}
              showJumpControls={true}
              customAdditionalControls={[]}
              className='audio-player'
            />
          )}
          <button className='deletebutton' onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>

        <p className="audio-transcript">{audioFile.chatResponse}</p>
        <div className="action-buttons">
          <button className="generate-notes-btn" onClick={generateNotes} disabled={isGeneratingNotes}>
            {isGeneratingNotes ? 'Generating Notes...' : 'Generate Notes'}
          </button>
          <button className="generate-summary-btn" onClick={generateSummary} disabled={isGeneratingSummary}>
            {isGeneratingSummary ? 'Generating Summary...' : 'Generate Summary'}
          </button>
        </div>

        {notes && (
          <div className="generated-notes">
            <h3>Generated Notes:</h3>
            <p>{notes}</p>
            <div className="action-buttons">
              <CopyToClipboard text={notes}>
                <button className="copy-button" onClick={() => handleCopy(notes)}>
                  <FontAwesomeIcon icon={faCopy} /> Copy
                </button>
              </CopyToClipboard>
              {copied && <span>Copied!</span>}
              <button className="share-button" onClick={() => handleShare(notes, 'notes')}>
                <FontAwesomeIcon icon={faShareAlt} /> Share
              </button>
            </div>
          </div>
        )}

        {summary && (
          <div className="generated-summary">
            <h3>Generated Summary:</h3>
            <p>{summary}</p>
            <div className="action-buttons">
              <CopyToClipboard text={summary}>
                <button className="copy-button" onClick={() => handleCopy(summary)}>
                  <FontAwesomeIcon icon={faCopy} /> Copy
                </button>
              </CopyToClipboard>
              {copied && <span>Copied!</span>}
              <button className="share-button" onClick={() => handleShare(summary, 'summary')}>
                <FontAwesomeIcon icon={faShareAlt} /> Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopContent;
