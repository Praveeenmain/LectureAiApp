import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faTimes, faTrash, faPlay, faPause, faVolumeUp, faVolumeMute,faCopy,faShareAlt} from '@fortawesome/free-solid-svg-icons';
import { Audio } from 'react-loader-spinner';
import './popup.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const PopContent = ({ handleClose, audioFile }) => {
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [notes, setNotes] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);


  
  const audioElementRef = useRef(null);

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

  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const toggleDeleteOptions = () => {
    setShowDeleteOptions(!showDeleteOptions);
  };

  const handleDelete = () => {
    if (!audioFile) return;

    const url = `https://lectureaibackend.onrender.com/audio-files/${audioFile._id}`;

    axios.delete(url)
      .then(response => {
        console.log('Audio file deleted successfully');
        handleClose();
      })
      .catch(error => {
        console.error('Error deleting audio file:', error);
        alert('Failed to delete audio file. Please try again.');
      });
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
  const playRecording = () => {
    if (audioElementRef.current) {
      audioElementRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error playing audio:', error);
          alert('Failed to play audio. Please try again.');
        });

      audioElementRef.current.onended = () => {
        setIsPlaying(false);
      };

      audioElementRef.current.onerror = () => {
        setIsPlaying(false);
        console.error('Audio playback error');
      };
    }
  };

  const pauseRecording = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioElementRef.current.muted = !isMuted;
  };

  const toggleSpeedOptions = () => {
    setShowSpeedOptions(!showSpeedOptions);
  };

  const handleSpeedOptionClick = (rate) => {
    setPlaybackRate(rate);
    audioElementRef.current.playbackRate = rate;
    setShowSpeedOptions(false);
  };

  const generateNotes = async () => {
    setIsGeneratingNotes(true);
    setNotes(null);

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
    setSummary(null);

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

  const updateTime = () => {
    setCurrentTime(audioElementRef.current.currentTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };


  

  const speedOptions = [0.5, 1, 1.5, 2];
 

  return (
    <div className="popup">
      <div className="popup-content">
        <div className="audio-icon">
          <div className="audio-player-container">
            <button className="play-pause-button" onClick={isPlaying ? pauseRecording : playRecording}>
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </button>
            <audio
              ref={audioElementRef}
              src={`data:audio/wav;base64,${audioFile.audio}`}
              onTimeUpdate={updateTime}
            />
            {isPlaying && (
              <div className="loading-spinner">
                <Audio
                  height={30}
                  width={30}
                  radius={9}
                  color="white"
                  ariaLabel="Loading"
                  visible={isPlaying}
                />
              </div>
            )}
          </div>
          <div className="audio-controls">
            <span className="timer">{formatTime(currentTime)} / {formatTime(audioElementRef.current?.duration || 0)}</span>
            <div className="speed-control">
              <button className="speed-button" onClick={toggleSpeedOptions}>
                {playbackRate}x  
              </button>
              {showSpeedOptions && (
                <div className="speed-options">
                  {speedOptions.map(option => (
                    <button
                      key={option}
                      className={`speed-option ${option === playbackRate ? 'active' : ''}`}
                      onClick={() => handleSpeedOptionClick(option)}
                    >
                      {option}x
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="mute-button" onClick={toggleMute}>
              <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
            </button>
          </div>
          <div className="options-menu" onClick={toggleDeleteOptions}>
            <FontAwesomeIcon icon={faEllipsisV} size="lg" />

            {showDeleteOptions && (
              <div className="delete-options">
                <button onClick={handleDelete} className="delete-button">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button onClick={toggleDeleteOptions} className="cancel-button">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}
          </div>
        </div>

        <span className="close" onClick={handleClose}>&times;</span>
        <p className="audio-title">{audioFile.title}</p>
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
    <CopyToClipboard 
      text={notes} 
      onCopy={() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Show "Copied!" for 2 seconds
      }}
    >
      <button>
        <FontAwesomeIcon icon={faCopy} />
      </button>
    </CopyToClipboard>
    {copied && <span>Copied!</span>}
    
    <button onClick={() => handleShare(notes, 'notes')}>
      <FontAwesomeIcon icon={faShareAlt} /> 
    </button>
  </div>
)}

          {summary && (
            <div className="generated-summary">
              <h3>Generated Summary:</h3>
              <p>{summary}</p>
              <CopyToClipboard 
                text={summary} 
                onCopy={() => {
                  setCopiedSummary(true);
                  setTimeout(() => setCopiedSummary(false), 2000); // Show "Copied!" for 2 seconds
                }}
              >
                <button>
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </CopyToClipboard>
              {copiedSummary && <span>Copied!</span>}
              <button onClick={() => handleShare(summary, 'summary')}>
                <FontAwesomeIcon icon={faShareAlt} /> 
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default PopContent;
