import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Circles } from 'react-loader-spinner';
import Notemenu from '../Notemenu'
import './index.css';

const AllNotes = () => {
    const [allDocuments, setAllDocuments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllPdfs = async () => {
            try {
                const response = await axios.get('https://pdfaibackend.onrender.com/notefiles');
                const reversedAllNotes = response.data;
                setAllDocuments(reversedAllNotes);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching PDF files:', error);
                setError('Failed to fetch PDF files. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchAllPdfs();
    }, []);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = allDocuments.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <div className="Allnotes-container">
            {isLoading ? (
                <div className="loader-container">
                    <Circles
                        height={80}
                        width={80}
                        color="white"
                        ariaLabel="circles-loading"
                    />
                </div>
            ) : error ? (
                <p className="error-message">
                    {error}
                </p>
            ) : allDocuments.length === 0 ? (
                <p className="no-pdf-message">
                    No documents available. Please upload some.
                </p>
            ) : (
                <>
                    <ul className="note-menu">
                        {allDocuments.map((document, index) => (
                            <div key={index}>
                               
            
                                <Notemenu Note={document} />
                             
                            </div>
                        ))}
                    </ul>
                    <div className="pagination">
                        {[...Array(Math.ceil(currentItems.length / itemsPerPage)).keys()].map((number) => (
                            <button
                                className={currentPage === number + 1 ? 'pagination-button active' : 'pagination-button'}
                                key={number + 1}
                                onClick={() => paginate(number + 1)}
                            >
                                {number + 1}
                            </button>
                        ))}
                    </div>

                </>
            )}
              
        </div>
    );
};

export default AllNotes;
