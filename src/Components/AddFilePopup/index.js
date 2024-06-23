import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import './index.css';
import { pdfjs } from "react-pdf";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong,faTimes } from '@fortawesome/free-solid-svg-icons';
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

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
      files.forEach(file => formData.append('files', file));
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
  
      const response = await axios.post('https://pdfaibackend.onrender.com/uploadnotes', formData);
      console.log('Upload successful!', response.data);
  
      setUploadSuccess(true);
      onClose()
      window.location.reload(false);
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message || 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (uploadSuccess) {
      window.location.reload(false);
    }
  }, [uploadSuccess]);

  return (
    <div className="Added-file-container">
      <nav className="navbar navbar-light bg-dark d-flex justify-content-between align-items-center px-3">
        <div className="d-flex justify-content-center align-items-center">
          <button onClick={onClose} className="Popup-navbar navbar-brand" style={{ color: 'white', textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faLeftLong} style={{ color: 'white' }} />
          </button>
          <h1 className='dataset-heading'>Add Dataset</h1>
        </div>
      </nav>

      <div className="Add-content">
        <div className='notefile-upload-container'>
          <form className='notes-form-container' onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            {uploadSuccess && <div className="success-message">Upload successful!</div>}

            <div className='note-input-choose'>
              <label className='notes-pdf-input'>
                <input
                  type="file"
                  id="files"
                  onChange={handleFileChange}
                  multiple
                  required
                />
                Upload Files
              </label>
              {fileNames.length > 0 && (
  <div className="file-names-container">
  <span>{fileNames.map(name => name.slice(-10)).join(', ')}</span>

    <button className="close-button" onClick={() => setFileNames([])}><FontAwesomeIcon icon={faTimes}/></button>
  </div>
)}

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
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
              <option value="Other">Other</option>
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
            </select>
            <select
              className='note-input-category'
              value={subject}
              onChange={handleSubjectChange}
              required
            >
              <option value="" disabled>Select Subject</option>
              <option value="Indian History">Indian History</option>
              <option value="Science">Science</option>
              <option value="Agriculture">Agriculture</option>
              <option value="History">History</option>
              <option value="Others">Others</option>
            </select>
            <input
              className='note-input-title'
              type="text"
              id="topics"
              value={topics}
              onChange={handleTopicsChange}
              placeholder='Enter Topics'
              style={{ marginTop: '20px' }}
            />
            {isLoading ? (
              <div className="loader">Loading...</div>
            ) : (
              <div className='Notes-Ai-submit-cancel'>
                <button className='Notes-Ai-cancel' type="button" onClick={handleCancel}>Cancel</button>
                <button className='Notes-Ai-submit' type="submit">Submit</button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddedFileContainer;
