import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import LectureTitle from '../EditableText';
import 'react-h5-audio-player/lib/styles.css';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { faCopy, faShareAlt, faVolumeUp,faVolumeMute,faRandom,faRotate,faBook,faRectangleList } from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome icons for play and stop
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'

import './popup.css';

const PopContent = ({ handleClose, audioFile }) => {
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState(null); // State to hold speech utterance
  const [isSpeaking, setIsSpeaking] = useState(false); // State to track if currently speaking
 

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
    const confirmDelete = window.confirm('Are you sure you want to delete this Lecture audio');
    if (!confirmDelete) {
      return;
    }

    setIsDeleting(true);

    const url = `https://lectureaibackend.onrender.com/audio-files/${audioFile._id}`;

    axios
      .delete(url)
      .then((response) => {
        console.log('Audio file deleted successfully');
        handleClose();
      })
      .catch((error) => {
        console.error('Error deleting audio file:', error);
        alert('Failed to delete audio file. Please try again.');
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  useEffect(() => {
    if (isDeleting) {
      window.location.reload(false);
    }
  }, [isDeleting]);

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
      setSpeechUtterance(utterance);
      setIsSpeaking(true); // Set speaking state to true
    } else {
      alert('Speech synthesis is not supported in your browser.');
    }
  };

  const handleStopSpeaking = () => {
    if (speechUtterance) {
      window.speechSynthesis.cancel();
      setSpeechUtterance(null);
      setIsSpeaking(false); // Set speaking state to false
    }
  };

  const toggleSpeakStop = () => {
    if (isSpeaking) {
      handleStopSpeaking();
    } else {
      handleSpeak(audioFile.chatResponse);
    }
  };
 

  return (
    <div className="popup">
      <div className="popup-content">
        <div className="audio-player-container">
          <span className="close" onClick={handleClose}>
            &times;
          </span>

          {audioFile.audio && (
            <AudioPlayer
              src={`data:audio/wav;base64,${audioFile.audio}`}
              autoPlay={false}
              showJumpControls={true}
              customAdditionalControls={[]}
              className="audio-player"
            />
          )}

          <button className="deletebutton" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      <div>
        <LectureTitle lecture={{ title: audioFile.title }} id={audioFile._id} onClick={toggleSpeakStop} />
        
        </div>

        <p className="audio-transcript">{audioFile.chatResponse}</p>
        <div className='action-buttons'>
      <CopyToClipboard text={notes} onCopy={() => setCopied(true)}>
        <button className="copy-button" onClick={() => handleCopy(audioFile.chatResponse)}>
          <FontAwesomeIcon icon={faCopy} /> Copy
        </button>
      </CopyToClipboard>
      {copied && <span style={{ marginLeft: '10px' }}>Copied!</span>}
      
      <button className="share-button" onClick={()=>handleShare(audioFile.chatResponse,"chatresponse")}>
        <FontAwesomeIcon icon={faShareAlt} /> Share
      </button>
        <button className="speak-stop-button" onClick={toggleSpeakStop}>
          <FontAwesomeIcon icon={isSpeaking ? faVolumeUp : faVolumeMute} />
        </button>
    </div>

        







       
 <div className="popup-container">  {/*generate note and summary popup  */}
   <Popup
     modal
     trigger={
       <button type="button" className="GenerateButton">
          <FontAwesomeIcon icon={faRandom} /> Generate
       </button>
     }
   >
     {close => (
       <>
  
         <span className="close"   onClick={() => close()} >
            &times;
          </span>
        

        <div className="action-buttons">
          <button className="generate-notes-btn" onClick={generateNotes} disabled={isGeneratingNotes}>
            <FontAwesomeIcon icon={faBook} />
            {isGeneratingNotes ? 'Generating' : 'Generate Notes'}
           
            
          </button>
          <button className="generate-summary-btn" onClick={generateSummary} disabled={isGeneratingSummary}>
          <FontAwesomeIcon icon={faRectangleList} />
            {isGeneratingSummary ? 'Generating Summary...' : 'Generate Summary'}
          </button>
        </div>
        {
  !notes && !summary && (
    <div className='Nonotes-summary'>
      Generate Notes and summary of Lecture..
    </div>
  )
}

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
    </div>
  );
};

export default PopContent;
