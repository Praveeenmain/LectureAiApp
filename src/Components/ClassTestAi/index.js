import React, { useState, useRef } from 'react';
import Navbar from "../NavBar";
import AllTestQuestions from '../AllTestquestion'

import './index.css';

const ClassTestAi = () => {
    const [files, setFiles] = useState([]);
    const [fileDisplay, setFileDisplay] = useState('');
    const [uploading, setUploading] = useState(false); // State for showing loader
    const [success ,setSucess]=useState('')
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFiles([selectedFile]);
        
        // Displaying last 10 characters of file name
        const fileName = selectedFile.name;
        const displayFileName = fileName.length > 12 ? fileName.slice(-12) : fileName;
        setFileDisplay(displayFileName);
    };

    const handleUpload = async () => {
        if (!files.length) {
            alert('Please choose a file to upload.');
            return;
        }

        setUploading(true); // Show loader when starting upload

        const formData = new FormData();
        formData.append('files', files[0]);

        try {
            const response = await fetch('https://pdfaibackend.onrender.com/uploadpapers', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
            window.location.reload();
            setSucess("Uploaded Question paper succesfully")
        } catch (error) {
            console.error('Error:', error);
            setSucess("Error in the upload,pls try again aftersometime")
        } finally {
            setUploading(false); // Hide loader after upload completes (whether success or error)
            setFiles([]); // Clear selected file after upload
            setFileDisplay(''); // Clear file display name
            fileInputRef.current.value = ''; // Reset file input (if needed)

        }
    };

    return (
        <>
            <Navbar title="ClassTest Ai" />
            <div className="classTest-ai-container">
                <div className="classTest-content-box">
                    <p className='Class-Test-heading'>Generate Questions</p>
                    <label htmlFor="files" className="custom-file-upload">
                        <input
                            type="file"
                            id="files"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            required
                        />
                        Choose File
                    </label>
                    <span className='class-test-file-name'>{fileDisplay}</span>
                    <button className="upload-button" onClick={handleUpload} disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                   
                </div>
                <AllTestQuestions/>
                <p>{success}</p>
            </div>
            
        </>
    );
}

export default ClassTestAi;
