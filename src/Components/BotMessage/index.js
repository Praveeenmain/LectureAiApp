import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { faCopy, faShareAlt, faRandom, faCheck, faVolumeUp, faVolumeMute, faBook, faRectangleList, faRotate } from '@fortawesome/free-solid-svg-icons';
import Popup from 'reactjs-popup';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import './index.css';

const Message = ({ text}) => {
  const [copied, setCopied] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');

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

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Chat Response',
          text: text,
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
      handleSpeak(text);
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

      const prompt = `Generate notes for the following audio transcript: ${text}`;
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

      const prompt = `Generate a summary for the following audio transcript: ${text}`;
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

  return (
    <div className="action-buttons">
      <div className='chatbot-message '>{text}</div>
      <div className='act-buttons'>
        <CopyToClipboard text={text} onCopy={handleCopy}>
          <button className='copy-button'>
            <FontAwesomeIcon  icon={copied ? faCheck : faCopy} />
          </button>
        </CopyToClipboard>

        <button className="share-button" onClick={handleShare}>
          <FontAwesomeIcon icon={faShareAlt} />
        </button>

        <button className="additional-button" onClick={toggleSpeakStop}>
          <FontAwesomeIcon icon={isSpeaking ? faVolumeMute : faVolumeUp} />
        </button>
    
       
        
        <Popup
          modal
          trigger={
            <button type="button" className="additional-button">
              <FontAwesomeIcon icon={faRandom} /> 
            </button>
          }
        >
          {close => (
            <>
              <span className="close" onClick={() => close()}>
                &times;
              </span>

              <div>
                <button className="generate-notes-btn" onClick={generateNotes} disabled={isGeneratingNotes}>
                  <FontAwesomeIcon icon={faBook} />
                  {isGeneratingNotes ? 'Generating' : 'Generate Notes'}
                </button>

                <button className="generate-summary-btn" onClick={generateSummary} disabled={isGeneratingSummary}>
                  <FontAwesomeIcon icon={faRectangleList} />
                  {isGeneratingSummary ? 'Generating Summary...' : 'Generate Summary'}
                </button>
              </div>

              {!notes && !summary && (
                <div className='Nonotes-summary'>
                  Generate Notes and summary of Lecture..
                </div>
              )}

              {notes && (
                <div className="generated-notes">
                  <h3>Generated Notes:</h3>
                  <p>{notes}</p>
                  <div>
                    <CopyToClipboard text={notes}>
                      <button className="copy-button" onClick={() => handleCopy(notes)}>
                        <FontAwesomeIcon icon={faCopy} /> 
                      </button>
                    </CopyToClipboard>
                    {copied && <span>Copied!</span>}
                    <button className="share-button" onClick={() => handleShare(notes, 'notes')}>
                      <FontAwesomeIcon icon={faShareAlt} /> 
                    </button>
                    <button className='regenerate-button' onClick={generateNotes}>
                      <FontAwesomeIcon icon={faRotate} /> 
                    </button>
                  </div>
                </div>
              )}

              {summary && (
                <div className="generated-summary">
                  <h3>Generated Summary:</h3>
                  <p>{summary}</p>
                  <div>
                    <CopyToClipboard text={summary}>
                      <button className="copy-button" onClick={() => handleCopy(summary)}>
                        <FontAwesomeIcon icon={faCopy} /> 
                      </button>
                    </CopyToClipboard>
                    {copied && <span>Copied!</span>}
                    <button className="share-button" onClick={() => handleShare(summary, 'summary')}>
                      <FontAwesomeIcon icon={faShareAlt} /> 
                    </button>
                    <button className='regenerate-button' onClick={generateSummary}>
                      <FontAwesomeIcon icon={faRotate} /> 
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </Popup>
      </div>
    </div>
  );
};

export default Message;
