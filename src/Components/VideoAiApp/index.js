import Navbar from "../NavBar";
import React, { useState } from 'react';
import axios from 'axios';
import AllVideos from '../AllVideos'
import './index.css';

const VideoAi = () => {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleInputChange = (event) => {
        setUrl(event.target.value);
    };

    const isValidYouTubeUrl = (url) => {
        const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        return regex.test(url);
    };

    const handleUpload = async () => {
        if (!isValidYouTubeUrl(url)) {
            setMessage("Please enter a valid YouTube URL.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post('https://pdfaibackend.onrender.com/youtube-transcribe', {videoUrl:url });

            if (response.status === 200) {
                setMessage("Video uploaded successfully!");
            } else {
                setMessage("Failed to upload the video.");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar title="Video Ai" />
            <div className="Video-Ai-container">
                <div className="Video-Ai-content-box">
                    <input 
                        type="text"
                        placeholder="Enter YouTube URL"
                        value={url}
                        onChange={handleInputChange}
                        className="video-ai-input"
                    />
                    <button 
                        className="video-ai-button" 
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                    {message && <p className="video-ai-message">{message}</p>}
                </div>
                <AllVideos/>
            </div>
         
        </>
    );
};

export default VideoAi;
