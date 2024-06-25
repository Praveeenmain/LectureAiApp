import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Circles } from 'react-loader-spinner';
import Videomenu from '../Videomenu'
const AllVideos=()=>{
    const [AllVideos, setAllVideos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchAllVideos = async () => {
            try {
                const response = await axios.get('https://pdfaibackend.onrender.com/videos');
                const AllVideos = response.data;
                setAllVideos(AllVideos);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching Video files:', error);
                setError('Failed to fetch Video files. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchAllVideos();
    }, []);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = AllVideos.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return(
        <div className="AllVideosAi-container">
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
        ) : AllVideos.length === 0 ? (
            <p className="no-pdf-message">
                No Videos available. Please upload some.
            </p>
        ) : (
            <>
                  <ul className='note-menu'>
                    {AllVideos.map((video, index) => (
                        <div  key={index}>
                           
        
                            <Videomenu Video={video} />
                         
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

    )
}
export default AllVideos