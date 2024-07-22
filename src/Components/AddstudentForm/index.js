import React, { useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';

const AddStudentForm = ({ onCancel }) => {
    const [name, setName] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading state

    const handleNameChange = (e) => setName(e.target.value);
    const handleStudentNumberChange = (e) => setStudentNumber(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const token = Cookie.get('jwt_token'); // Retrieve token from cookies

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        try {
            const response = await axios.post('https://taaibackend.onrender.com/students', {
                name,
                studentNumber,
                email
            }, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include token in headers
                }
            });
            console.log(response);
            // Reset form fields after successful submission
            setName('');
            setStudentNumber('');
            setEmail('');
            
            // Close the popup or perform other actions after success
            onCancel();
            window.location.reload();
        } catch (error) {
            console.error('Error submitting the form', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="student-add-file-container">
            <div className="student-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleNameChange}
                            placeholder='Name'
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            id="studentNumber"
                            name="studentNumber"
                            value={studentNumber}
                            placeholder="Student Number"
                            onChange={handleStudentNumberChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={email}
                            placeholder="Student Email"
                            onChange={handleEmailChange}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-secondary student-cancel" type="button" onClick={onCancel}>Cancel</button>
                        <button className="btn btn-primary student-submit" type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentForm;
