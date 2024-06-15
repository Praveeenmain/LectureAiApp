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
    const [itemsPerPage] = useState(3); // Number of items to display per page
    const [isLoading, setIsLoading] = useState(true); // State to track loading status

    useEffect(() => {
        const fetchAudioFiles = async () => {
            try {
                const response = await axios.get('https://lectureaibackend.onrender.com/audios');
                // Reverse the array received from the server
                const reversedAudioFiles = response.data.reverse();
                setAudioFiles(reversedAudioFiles);
                setIsLoading(false); // Set loading state to false after data is fetched
            } catch (error) {
                console.error('Error fetching audio files:', error);
                setIsLoading(false); // Set loading state to false in case of error
            }
        };

        fetchAudioFiles();
    }, []);

    // Logic to calculate current items to display based on pagination
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
            ) : (
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
                    {/* Pagination controls */}
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
