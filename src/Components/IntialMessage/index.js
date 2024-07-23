import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import './index.css';

const InitialMessage = ({ initialText, GoalQuestion, AssitantQuestion, challenges }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);
   const text="  "+initialText
  useEffect(() => {
    if (text) {
      let index = 0;
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
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [text]);

  const toggleQuestions = () => {
    setShowQuestions(!showQuestions);
  };

  const handleGoalQuestion = () => {
    GoalQuestion();
  };

  const handleAssistanceQuestion = () => {
    AssitantQuestion();
  };

  const handleChallengesQuestion = () => {
    challenges();
  };

  return (
    <div className='action-buttons'>
      <p className='initial-text'>{displayedText}</p>
      <div className="predefined-questions">
        {showQuestions && (
          <ul className='initial-messages-container'>
            <li className='question-button' onClick={handleGoalQuestion}>What is main goal with this File?</li>
            <li className='question-button' onClick={handleAssistanceQuestion}>Explain this in 10 lines?</li>
            <li className='question-button' onClick={handleChallengesQuestion}>What can we get from this file?</li>
          </ul>
        )}
      </div>
      <FontAwesomeIcon 
        icon={faCompass} 
        onClick={toggleQuestions} 
        className="icon-compass" 
      />
    </div>
  );
};

export default InitialMessage;
