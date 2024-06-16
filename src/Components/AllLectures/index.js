import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItem from '../menuitem/menu'; // Adjust the import path as needed
import PopContent from '../popupcontent/popcontent';
import { Circles } from 'react-loader-spinner';

import './index.css';

const Lectures = () => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [selectedAudioFile, setSelectedAudioFile] = useState(null); // State to track selected audio file
    const [audioFiles, setAudioFiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7); // Number of items to display per page
    const [isLoading, setIsLoading] = useState(true); // State to track loading status

    useEffect(() => {
        const fetchAudioFiles = async () => {
            try {
                const response = await axios.get('https://lectureaibackend.onrender.com/audios');
               
                const reversedAudioFiles = response.data.reverse();
                setAudioFiles(reversedAudioFiles);
                setIsLoading(false); 
            } catch (error) {
                console.error('Error fetching audio files:', error);
                setIsLoading(false); 
            }
        };
        fetchAudioFiles();
        
    }, []);
  
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = audioFiles.slice(indexOfFirstItem, indexOfLastItem);

    const handleClick = (audioFile) => {
        setSelectedAudioFile(audioFile); // Set the selected audio file
        setPopupVisible(true);
    };

    const handleClose = () => {
        setPopupVisible(false);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="lectures-container">
            {isLoading ? (
                <div className="loader-container">
                    <Circles
                        height="80"
                        width="80"
                        color="white"
                        ariaLabel="circles-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                </div>
            ) : audioFiles.length === 0 ? (
                <p className="no-audio-message">
                    No Lectures available,Please upload.
                </p>
            ) :(
                <>
                    <ul className="menu">
                        {currentItems.map((audioFile, index) => (
                            <div key={index}>
                                <MenuItem
                                    audioFile={audioFile}
                                    onClick={() => handleClick(audioFile)} // Pass audioFile object to handleClick
                                />
                            </div>
                        ))}
                    </ul>
                 
                    <div className="pagination">
                        {[...Array(Math.ceil(audioFiles.length / itemsPerPage)).keys()].map((number) => (
                            <button
                                className={currentPage === number + 1 ? 'pagination-button active' : 'pagination-button'}
                                key={number + 1}
                                onClick={() => paginate(number + 1)}
                            >
                                {number + 1}
                            </button>
                        ))}
                    </div>
                    {isPopupVisible && selectedAudioFile && (
                        <PopContent
                            key={`popup-${selectedAudioFile.id}`} // Assuming selectedAudioFile has an 'id' field
                            audioFile={selectedAudioFile}
                            handleClose={handleClose}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Lectures;
