import React, { useState } from 'react';
import Navbar from "../NavBar";
import LabelBottomNavigation from '../BottomNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import './index.css';
import StudentInfo from '../studentInfo';
import AddStudentForm from '../AddstudentForm';

const AddStudents = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);

    const handleAddFileClick = () => {
        setShowPopup(true);
    };

    const handleCancel = () => {
        setShowPopup(false);
    };

    const handleSubmit = (data) => {
        setIsLoading(true);
        setTimeout(() => {
            setSubmittedData(data);
            setIsLoading(false);
            setShowPopup(false);
        }, 2000);
    };

    return (
        <>
            <Navbar title="Add Student" />
            <div className="student-add-container">
                {submittedData && <StudentInfo {...submittedData} />}

                <div className='add-file-button' onClick={handleAddFileClick}>
                    <FontAwesomeIcon icon={faCirclePlus} />
                </div>
            </div>

            {showPopup && <AddStudentForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />}

            <LabelBottomNavigation />
        </>
    );
};

export default AddStudents;
