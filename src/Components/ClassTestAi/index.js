import React, { useState, useRef } from 'react';
import Navbar from "../NavBar";
import AllTestQuestions from '../AllTestquestion';
import './index.css';
import Cookie from 'js-cookie';

const ClassTestAi = () => {
    const [files, setFiles] = useState([]);
    const [fileDisplay, setFileDisplay] = useState('');
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFiles([selectedFile]);
            const fileName = selectedFile.name;
            const displayFileName = fileName.length > 12 ? fileName.slice(-12) : fileName;
            setFileDisplay(displayFileName);
        }
    };

    const handleUpload = async () => {
        if (!files.length) {
            alert('Please choose a file to upload.');
            return;
        }

        setUploading(true);
        setSuccess('');
        setError('');

        const formData = new FormData();
        formData.append('file', files[0]);

        try {
            const response = await fetch('https://taaibackend.onrender.com/uploadpapers', {
                headers: {
                    'Authorization': `Bearer ${Cookie.get('jwt_token')}`,
                },
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setSuccess("Uploaded Question paper successfully");
            setFiles([]);
            setFileDisplay('');
            fileInputRef.current.value = '';
            window.location.reload(); 
        } catch (error) {
            console.error('Error:', error);
            setError("Error in the upload, please try again later");
        } finally {
            setUploading(false);
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
                    <button
                        className="upload-button"
                        onClick={handleUpload}
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                    {success && <p className='success-message'>{success}</p>}
                    {error && <p className='error-message'>{error}</p>}
                </div>
                <AllTestQuestions />
            </div>
        </>
    );
};

export default ClassTestAi;
