import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Cookie from 'js-cookie'; // Import Cookie for getting JWT token

const StudentInfo = ({ name, phoneNumber, email, id }) => {
    
    const handleDelete = () => {
        // Ask for confirmation before deleting
        const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
        const token = Cookie.get('jwt_token'); // Retrieve token from cookies

        if (confirmDelete) {
            // Implement your delete functionality here, e.g., make an API call to delete the student
            fetch(`https://taaibackend.onrender.com/student/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token in headers
                    'Content-Type': 'application/json' // Optional, depending on your API requirements
                }
            }).then(response => {
                if (response.ok) {
                    // Handle success, e.g., remove the student from the UI or refresh the list
                    window.location.reload(); // Refresh the page or update state as needed
                } else {
                    // Handle errors, e.g., show an error message
                    console.error('Error deleting student:', response.statusText);
                }
            }).catch(error => {
                console.error('Error deleting student:', error);
            });
        }
    };

    return (
        <div className='students-container'>
            <p className="student-name">{name}</p>
            <p className="student-phone">{phoneNumber}</p>
            <p className="student-email">{email}</p>
            <div className="dropdown-container">
                <FontAwesomeIcon icon={faTrashAlt} className="delete-icon" onClick={handleDelete} />
            </div>
        </div>
    );
};

export default StudentInfo;
