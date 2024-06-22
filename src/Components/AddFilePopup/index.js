import React, { useState } from 'react';
// import axios from 'axios';
import './index.css';
import { pdfjs } from "react-pdf";
import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const AddedFileContainer = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState('');
  const [exam, setExam] = useState('');
  const [paper, setPaper] = useState('');
  const [subject, setSubject] = useState('');
  const [topics, setTopics] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    const chosenFile = e.target.files[0];
    setPdfFile(chosenFile);
    setFileName(chosenFile ? chosenFile.name : '');
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleExamChange = (e) => {
    setExam(e.target.value);
  };

  const handlePaperChange = (e) => {
    setPaper(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleTopicsChange = (e) => {
    setTopics(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('pdfFile', pdfFile);
      formData.append('category', category);
      formData.append('exam', exam);
      formData.append('paper', paper);
      formData.append('subject', subject);
      if (topics.trim() !== '') {
        formData.append('topics', topics);
      }
      
      // Log the formData before making the POST request
      console.log('Form Data:', formData);
      onClose()
      // Make the POST request using Axios or fetch here
      // Example with Axios:
      // const response = await axios.post('/api/upload', formData);
      // console.log('Upload successful!', response.data);
      
      // For now, simulate successful upload
      setUploadSuccess(true);
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message || 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCancel = () => {
    setTitle('');
    setPdfFile(null);
    setFileName('');
    setCategory('');
    setExam('');
    setPaper('');
    setSubject('');
    setTopics('');
    setIsLoading(false);
    setError(null);
    setUploadSuccess(false);
  };

  return (
    <div className="Added-file-container">
      <nav className="navbar navbar-light bg-dark d-flex justify-content-between align-items-center px-3">
        <div className="d-flex justify-content-center align-items-center">
          <button onClick={onClose} className="Popup-navbar navbar-brand" style={{ color: 'white', textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faLeftLong} style={{ color: 'white' }} />
          </button>
         
        </div>
      </nav>

      <div className="Add-content">
      <h1 className='dataset-heading'>Add Dataset</h1>
        <div className='notefile-upload-container'>
          <form className='notes-form-container' onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            {uploadSuccess && <div className="success-message">Upload successful!</div>}
             
            <div className='note-input-choose'>
              <label className='notes-pdf-input'>
                <input
                  type="file"
                  id="pdfFile"
                  onChange={handleFileChange}
                  required
                />
                Upload Files
              </label>
              {pdfFile && <span>{fileName}</span>}
            </div>
            <input
              className='note-input-title'
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder='Enter Title'
             
              required
            />
            <select
              className='note-input-category'
              value={category}
              onChange={handleCategoryChange}
              required
            >
              <option value="" disabled>Select Category</option>
              <option value="Legal">Legal</option>
              <option value="Health">Health</option>
              <option value="education">Education</option>
              <option value="Finance">Finance</option>
              <option value="other">Other</option>
            </select>
            <select
              className='note-input-category'
              value={exam}
              onChange={handleExamChange}
              required
            >
              <option value="" disabled>Select Exam</option>
              <option value="Prelims">Prelims</option>
              <option value="Mains">Mains</option>
              <option value="Personality Test">Personality Test</option>
              {/* Add more options as needed */}
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
              <option value="Gs Paper 2">Gs Paper 2</option>
              <option value="Gs Paper 3">Gs Paper 3</option>
              <option value="Gs Paper 4">Gs Paper 4</option>
              {/* Add more options as needed */}
            </select>
            <select
              className='note-input-category'
              value={subject}
              onChange={handleSubjectChange}
              required
            >
              <option value="" disabled>Select Subject</option>
              <option value="Indian history">Indian history</option>
              <option value="Science">Science</option>
              <option value="Agriculture">Agriculture</option>
              <option value="History">History</option>
              <option value="others">others</option>
              {/* Add more options as needed */}
            </select>
            <input
              className='note-input-title'
              type="text"
              id="topics"
              value={topics}
              onChange={handleTopicsChange}
              placeholder='Enter Topics (optional)'
              style={{ marginTop: '20px' }}
            />
            {isLoading ? (
              <div className="loader">Loading...</div>
            ) : (
              <div className='Notes-Ai-submit-cancel'>
                <button className='Notes-Ai-cancel' type="button" onClick={handleCancel}>Cancel</button>
                <button className='Notes-Ai-submit' type="submit" onClick={handleSubmit}>Submit</button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddedFileContainer;
