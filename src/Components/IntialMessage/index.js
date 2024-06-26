import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import './index.css'
const IntialMessage = ({ initialText ,GoalQuestion,AssitantQuestion,challenges}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    if (initialText) {
      let index = 0;
      const timer = setInterval(() => {
        setDisplayedText(prev => {
          if (index < initialText.length) {
            return prev + initialText[index];
          }
          return prev;
        });
        index += 1;
        if (index === initialText.length) {
          clearInterval(timer);
        }
      }, 15);
      return () => clearInterval(timer);
    }
  }, [initialText]);

  const toggleQuestions = () => {
    setShowQuestions(!showQuestions);
  };

  const handleGoalQuestion = () => {
    GoalQuestion()
  };

  const handleAssistanceQuestion = () => {
   
    AssitantQuestion()
  };

  const handleChallengesQuestion = () => {
   
    challenges()
  };

 

  return (
    <div className='action-buttons'>
      <p className='intial-text'>{displayedText}</p>
      <div className="predefined-questions">
        {showQuestions && (
          <ul className='intial-messages-container'>
            <li className='question-button' onClick={handleGoalQuestion}>What is main goal with this File?</li>
            <li className='question-button' onClick={handleAssistanceQuestion}>Explain this in 10 lines?</li>
            <li className='question-button' onClick={handleChallengesQuestion}>what we can get from this file?</li>
            
           
          </ul>
        )}
      </div>
      <FontAwesomeIcon icon={faCompass} onClick={toggleQuestions} />
    </div>
  );
};

export default IntialMessage;
