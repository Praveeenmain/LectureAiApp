import React, { useState } from 'react';
import axios from 'axios';
import Navbar from "../NavBar";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import './index.css';
import AllNotes from '../AllNotes'
// Ensure the correct path for the worker file
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const NotesAi = () => {
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState(null); // Changed state variable name to pdfFile
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [uploadSuccess, setUploadSuccess] = useState(false); // State for upload success

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFileChange = (e) => {
    const chosenFile = e.target.files[0];
    setPdfFile(chosenFile); // Updated state variable to pdfFile
    setFileName(chosenFile ? chosenFile.name : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Set loading to true when submitting

    try {
      // Create FormData object to send files and other data
      const formData = new FormData();
      formData.append('title', title); // Append title
      formData.append('pdfFile', pdfFile);   // Append pdfFile
      
      // Make POST request to the backend endpoint
      const response = await axios.post('https://pdfaibackend.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Handle successful response
      console.log('Upload successful:', response.data);
      setUploadSuccess(true); // Set upload success state
      // Optionally, you can redirect or show a success message here
    
    } catch (error) {
      // Handle error
      console.error('Upload failed:', error);
      setError(error.message || 'Upload failed'); // Set error state
    } finally {
      setIsLoading(false); // Reset loading state regardless of success or failure
    }
  };

  return (
    <>
      <Navbar title="Notes Ai" />
      
      <div className='Notes-Ai-container'>
      <h1 className="note-title">Upload Notes</h1>
        <div className='Notes-content-box'>
          <form className='notes-form-container' onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            {uploadSuccess && <div className="success-message">Upload successful!</div>}
            <div>
              <input
                className='note-input-title'
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder='Enter Title'
                required
              />
            </div>
            <div className='note-input-choose'>
              <label className='notes-pdf-input'>
                <input
                  type="file"
                  id="pdfFile"
                  onChange={handleFileChange}
                  required
                />
                Upload Notes
              </label>
              <span className='notes-file-name'>{fileName}</span>
            </div>
            {isLoading ? (
              <div className="loader">Loading...</div>
            ) : (
              <button className='Notes-Ai-submit' type="submit">Submit</button>
            )}
          </form>
        </div>
        <AllNotes/>
      </div>
     
    </>
  );
};

export default NotesAi;
