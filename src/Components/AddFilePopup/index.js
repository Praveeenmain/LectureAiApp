import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import Navbar from '../NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Cookie from 'js-cookie';

const AddedFileContainer = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [category, setCategory] = useState('');
  const [exam, setExam] = useState('');
  const [paper, setPaper] = useState('');
  const [subject, setSubject] = useState('');
  const [topics, setTopics] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const token = Cookie.get('jwt_token');

  const handleFileChange = (e) => {
    const chosenFiles = Array.from(e.target.files);
    if (chosenFiles.length > 2) {
      setError('You can upload a maximum of 3 files.');
      return;
    }
    setFiles(chosenFiles);
    setFileNames(chosenFiles.map(file => file.name));
    setError(null); // Clear error message on new file selection
    setUploadSuccess(false); // Clear success message on new file selection
  };

  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleExamChange = (e) => setExam(e.target.value);
  const handlePaperChange = (e) => setPaper(e.target.value);
  const handleSubjectChange = (e) => setSubject(e.target.value);
  const handleTitleChange = (e) => setTitle(e.target.value);

  const handleCancel = () => {
    setTitle('');
    setFiles([]);
    setFileNames([]);
    setCategory('');
    setExam('');
    setPaper('');
    setSubject('');
    setTopics('');
    setIsLoading(false);
    setError(null);
    setUploadSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setError('Please select files to upload.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('file', files[0]); // Ensure single file upload key matches 'file'
      formData.append('category', category);
      formData.append('exam', exam);
      formData.append('paper', paper);
      formData.append('subject', subject);
      if (topics.trim() !== '') {
        formData.append('topics', topics);
      }

      // Log the formData entries before making the POST request
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post('https://taaibackend.onrender.com/upload-notes', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Upload successful!', response.data);
      setUploadSuccess(true);
      onClose();
      window.location.reload(false);
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message || 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Added-file-container">
      <Navbar title="Add Dataset" />
      <div className="Add-content">
        <div className='notefile-upload-container'>
          <form className='notes-form-container' onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            {uploadSuccess && <div className="success-message">Upload successful!</div>}
            <div className='note-input-choose'>
              {fileNames.length > 0 && (
                <div className="file-names-container">
                  <span>{fileNames.map(name => name.slice(-10)).join(', ')}</span>
                  <button className="close-button" onClick={() => setFileNames([])}><FontAwesomeIcon icon={faTimes} /></button>
                </div>
              )}
              <label className='notes-pdf-input'>
                <input
                  type="file"
                  id="files"
                  onChange={handleFileChange}
                  multiple
                  required
                />
                Upload File
              </label>
            </div>
            <input
              className='note-input-title'
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Title"
              required
            />
            <select
              className='note-input-category'
              value={category}
              onChange={handleCategoryChange}
              required
            >
              <option value="" disabled>Exam Category</option>
              <option value="UPSC">UPSC</option>
              {/* Add other category options here */}
            </select>
            <select
              className='note-input-category'
              value={exam}
              onChange={handleExamChange}
              required
            >
              <option value="" disabled>Exam Stage</option>
              <option value="Prelims">UPSC Prelims</option>
              <option value="Mains">UPSC Mains GS</option>
              {/* Add other exam options here */}
            </select>
            <select
              className='note-input-category'
              value={paper}
              onChange={handlePaperChange}
              required
            >
              <option value="" disabled>Select Paper</option>
              <option value="Any Indian Language">Any Indian Language</option>
              <option value="English">English</option>
              <option value="Essay">Essay</option>
              <option value="GS Paper 1">GS Paper 1</option>
              <option value="GS Paper 2">GS Paper 2</option>
              <option value="GS Paper 3">GS Paper 3</option>
              <option value="GS Paper 4">GS Paper 4</option>
              <option value="GS Paper 2-CSAT">GS Paper 2-CSAT</option>
              {/* Add other paper options here */}
            </select>
            <select
              className='note-input-category'
              value={subject}
              onChange={handleSubjectChange}
              required
            >
              <option value="" disabled>Select Subject</option>
              <option value="History">History</option>
              <option value="Science">Science</option>
              <option value="Geography">Geography</option>
              <option value="Economics">Economics</option>
              <option value="Polity">Polity</option>
              <option value="Environment">Environment</option>
              <option value="General Science">General Science</option>
              <option value="Current Affairs">Current Affairs</option>
              <option value="Quantitative Aptitude">Quantitative Aptitude</option>
              <option value="Verbal Aptitude">Verbal Aptitude</option>
              <option value="Reasoning">Reasoning</option>
              <option value="Indian History">Indian History</option>
              <option value="World History">World History</option>
              <option value="Indian Geography">Indian Geography</option>
              <option value="World Geography">World Geography</option>
              <option value="Art and Culture">Art and Culture</option>
              <option value="Society">Society</option>
              <option value="Indian Polity & Governance">Indian Polity & Governance</option>
              <option value="Public Administration">Public Administration</option>
              <option value="International Relations and Security">International Relations and Security</option>
              <option value="Social Justice">Social Justice</option>
              <option value="Disaster Management">Disaster Management</option>
              <option value="Internal Security">Internal Security</option>
              <option value="Ethics">Ethics</option>
              <option value="Integrity">Integrity</option>
              <option value="Emotional Intelligence">Emotional Intelligence</option>
              {/* Add other subject options here */}
            </select>
            <input
              className='note-input-title'
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="Topics (optional)"
            />
            <div className='Notes-Ai-submit-cancel'>
            <button className='Notes-Ai-submit' type="submit" disabled={isLoading}>
              {isLoading ? 'Uploading...' : 'Submit'}
            </button>
            <button className='Notes-Ai-cancel' onClick={handleCancel}>Reset</button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default AddedFileContainer;
