import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';
import LectureItem from '../LectureItem';

const Lectures = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lecturesPerPage] = useState(3); // Number of lectures per page

  // Fetch lectures from API
  const fetchLectures = async () => {
    try {
      const response = await axios.get('https://lectureaibackend.onrender.com/audios');
      setLectures(response.data.reverse()); // Reverse to show latest first
    } catch (error) {
      console.error("Error fetching the lectures:", error);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchLectures when component mounts
  useEffect(() => {
    fetchLectures();
  }, []); // Empty dependency array to run only once on mount

  // Delete a lecture recording
  const deleteRecording = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`https://lectureaibackend.onrender.com/audio-files/${id}`);
      await fetchLectures(); // Refresh the lectures after deletion
    } catch (error) {
      console.error("Error deleting the lecture:", error);
    } finally {
      setDeletingId(null);
    }
  };

  // Pagination logic
  const indexOfLastLecture = currentPage * lecturesPerPage;
  const indexOfFirstLecture = indexOfLastLecture - lecturesPerPage;
  const currentLectures = lectures.slice(indexOfFirstLecture, indexOfLastLecture);

  // Function to change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Loading state while fetching data
  if (loading) {
    return <div className="loader"></div>;
  }

  // Render when there are no lectures
  if (lectures.length === 0) {
    return (
      <div className="no-files">
        <p className='no-lectures'>No lectures available, start recording...</p>
      </div>
    );
  }

  // Render when there are lectures
  return (
    <div className="Lectures-container">
      <h1 className='Lecture-heading'>Lectures</h1>
      {currentLectures.map((lecture) => (
        <LectureItem key={lecture._id} lecture={lecture} deleteRecording={deleteRecording} deletingId={deletingId} />
     
      
      ))}

  
      <div className="pagination">
        {Array.from({ length: Math.ceil(lectures.length / lecturesPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
            style={{
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              margin: '4px',
              cursor: 'pointer',
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Lectures;
