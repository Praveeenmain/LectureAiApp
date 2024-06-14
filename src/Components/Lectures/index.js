import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LectureTitle from '../LectureTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './index.css';

const Lectures = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lecturesPerPage] = useState(3); // Number of lectures per page

  const fetchLectures = async () => {
    try {
      const response = await axios.get('https://lectureaibackend.onrender.com/audios');
      setLectures(response.data.reverse());
    } catch (error) {
      console.error("Error fetching the lectures:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []); // Empty dependency array to run only once on mount

  const deleteRecording = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`https://lectureaibackend.onrender.com/audio-files/${id}`);
      await fetchLectures();
    } catch (error) {
      console.error("Error deleting the lecture:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const indexOfLastLecture = currentPage * lecturesPerPage;
  const indexOfFirstLecture = indexOfLastLecture - lecturesPerPage;
  const currentLectures = lectures.slice(indexOfFirstLecture, indexOfLastLecture);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="loader"></div>;
  }

  if (lectures.length === 0) {
    return (
      <div className="no-files">
        <p className='no-lectures'>No lectures available, start recording...</p>
      </div>
    );
  }

  return (
    <div className="Lectures-container">
      <h1 className='Lecture-heading'>Lectures</h1>
      {currentLectures.map((lecture) => (
        <div key={lecture._id} className="Lecture-item">
          <div>
            {/* <ReactAudioPlayer controls src={`data:audio/wav;base64,${lecture.audio}`} />
            <p><strong>Date:</strong> {new Date(lecture.date).toLocaleString()}</p> */}
          </div>
          <div className='title-delete'>
            <LectureTitle lecture={lecture} id={lecture._id} /> {/* Pass the entire lecture object */}
            <button 
              className="delete-button" 
              onClick={() => deleteRecording(lecture._id)}
              disabled={deletingId === lecture._id}
            >
              {deletingId === lecture._id ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon icon={faTrash} />
              )}
            </button>
          </div>
        </div>
      ))}

      <div className="pagination">
        {Array.from({ length: Math.ceil(lectures.length / lecturesPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className="page-button"
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
