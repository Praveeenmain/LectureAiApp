import React from 'react';

const StudentInfo = ({ name, phoneNumber, email }) => {
    return (
        <div className='students-container'>
            <p className="student-name">{name}</p>
            <p className="student-phone">{phoneNumber}</p>
            <p className="student-email">{email}</p>
        </div>
    );
};

export default StudentInfo;
