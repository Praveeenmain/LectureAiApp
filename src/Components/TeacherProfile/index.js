import React, { useState } from 'react';
import Navbar from '../NavBar'; // Adjust path as necessary
import './index.css'; // Adjust path as necessary
import { jwtDecode } from 'jwt-decode'; // Correct import statement
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faPlus } from '@fortawesome/free-solid-svg-icons'; // Import plus icon
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const TeacherProfile = () => {
  // Get JWT token from cookies
  const jwtToken = Cookies.get('jwt_token');

  // Decode JWT token to get user information
  const decodedToken = jwtToken ? jwtDecode(jwtToken) : null;
  const { name, picture } = decodedToken || {};

  // State variables for editable fields
  const [subject, setSubject] = useState('');
  const [exams, setExams] = useState('');
  const [about, setAbout] = useState('');
  const [documents, setDocuments] = useState([]);

  // Function to save profile
  const saveProfile = () => {
    // Implement your save logic here
    console.log('Profile saved!');
    // Example: Send data to backend or update state as needed
  };

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Update documents state with the new file
      setDocuments([...documents, file]);
    }
  };

  // Function to render uploaded documents
  const renderDocuments = () => {
    if (documents.length === 0) {
      return (
        <div className="no-documents">
          <FontAwesomeIcon icon={faFilePdf} />
          <p>No documents uploaded</p>
        </div>
      );
    } else {
      return (
        <ul className="document-list">
          {documents.map((doc, index) => (
            <li key={index}>
              <FontAwesomeIcon icon={faFilePdf} />
              <span>{doc.name}</span>
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <>
      <Navbar title="Teacher" />
      <div className="teacherprofile-upload-pdf-section">
        <div className="teacher-profile-container">
          <h1 className="teacher-p-heading">Teacher Profile</h1>
          <div className="profile-section">
            {picture && <img className="profile-picture" src={picture} alt="Profile" />}
            {name && <p className="profile-name">{name}</p>}
          </div>

          <div className="details-section">
            <div className="details-column">
           
              <textarea
                className="subject-field"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Add subject"
              />
            </div>
            <div className="details-column">
             
              <textarea
                className="exams-field"
                value={exams}
                onChange={(e) => setExams(e.target.value)}
                placeholder="Add Exams"
              />
            </div>
          </div>

          {/* About section - Editable */}
          <div className="about-section">
     
            <textarea
              className="about-field"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Add About section"
            />
          </div>

          {/* Save button with FontAwesome icon */}
          <button className="save-button" onClick={saveProfile}>
            <FontAwesomeIcon icon={faSave} /> Save
          </button>

          <hr />

          {/* Document upload section */}
          <div className="document-upload-section">
            <h2 className="section-title">Upload Documents</h2>
            <label htmlFor="file-upload" className="upload-label">
              <FontAwesomeIcon icon={faPlus} /> Upload
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            {renderDocuments()}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherProfile;
