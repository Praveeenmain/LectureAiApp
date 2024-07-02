import React, { useState } from 'react';
const AddStudentForm = ({ onSubmit, onCancel, isLoading }) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    const handleNameChange = (e) => setName(e.target.value);
    const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, phoneNumber, email });
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
                            type="tel"
                            className="form-control"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={phoneNumber}
                            placeholder="Student Phone Number"
                            onChange={handlePhoneNumberChange}
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
                        <button className="btn btn-primary student-submit" type="submit" disabled={isLoading}>
                            {isLoading ? 'Adding..' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentForm;
