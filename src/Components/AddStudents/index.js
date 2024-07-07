import React, { useState, useEffect } from 'react'; // Import useEffect for fetching data
import Navbar from "../NavBar";
import LabelBottomNavigation from '../BottomNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import './index.css';

import AddStudentForm from "../AddstudentForm"
import StudentInfo from '../studentInfo/index'; // Assuming StudentInfo component is imported

const AddStudents = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [students, setStudents] = useState([]); // State to store fetched students

    useEffect(() => {
        // Fetch students data from API
        fetch("https://pdfaibackend.onrender.com/students")

            .then(response => response.json())
           
            .then(data => setStudents(data.students)) // Assuming data is an array of students
            .catch(error => console.error('Error fetching students:', error));
    }, []); // Empty dependency array to run once on component mount
   
    const handleAddFileClick = () => {
        setShowPopup(true);
    };

    const handleCancel = () => {
        setShowPopup(false);
    };


    return (
        <>
            <Navbar title="Add Student" />
            <div className="student-add-container">
                {/* Render student info fetched from API */}
            
                {students.map(student => (
                    <StudentInfo key={student.id} name={student.name} phoneNumber={student.student_number} email={student.email} id={student.id} />
                ))}
                <div className='add-file-button' onClick={handleAddFileClick}>
                    <FontAwesomeIcon icon={faCirclePlus} />
                </div>
            </div>

            {showPopup && <AddStudentForm onCancel={handleCancel} />}

            <LabelBottomNavigation />
        </>
    );
};

export default AddStudents;
