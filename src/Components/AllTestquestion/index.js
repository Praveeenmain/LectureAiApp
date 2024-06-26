import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Circles } from 'react-loader-spinner';
import Previousmenu from '../questionpapermenu';
const AllTestQuestions = () => {
    const [allTests, setAllTest] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = allTests.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const fetchAllQuestionPapers = async () => {
            try {
                const response = await axios.get('https://pdfaibackend.onrender.com/pqfiles');
                const reversedAllNotes = response.data.reverse(); // Reverse the array if needed
                setAllTest(reversedAllNotes);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching files:', error);
                setError('Failed to fetch files. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchAllQuestionPapers();
    }, []);

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
                <p className="error-message">{error}</p>
            ) : allTests.length === 0 ? (
                <p className="no-pdf-message">No documents available. Please upload some.</p>
            ) : (
                <>
                    <ul className="note-menu">
                        {currentItems.map((document, index) => (
                            <div key={index}>
                                <Previousmenu questionPaper={document} />
                            </div>
                        ))}
                    </ul>
                    <div className="pagination">
                        {[...Array(Math.ceil(allTests.length / itemsPerPage)).keys()].map((number) => (
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

export default AllTestQuestions;
