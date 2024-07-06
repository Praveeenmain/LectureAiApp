import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';


const StudentInfo = ({ name, phoneNumber, email, id }) => {
 

    const handleDelete = () => {
        // Ask for confirmation before deleting
        const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);

        if (confirmDelete) {
            // Implement your delete functionality here, e.g., make an API call to delete the student
            fetch(`https://pdfaibackend.onrender.com/students/${id}`, {
                method: 'DELETE',
                // Add headers or credentials if needed
            }).then(response => {
                // Handle success or error as per your application's needs
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
