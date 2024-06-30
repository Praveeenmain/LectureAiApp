import React, { useState } from 'react';
import Navbar from '../NavBar';
import LabelBottomNavigation from '../BottomNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './index.css';

const AddStudents = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [parentPhoneNumber, setParentPhoneNumber] = useState('');
    const [dob, setDOB] = useState(''); // Added state for DOB
    const [address, setAddress] = useState(''); // Added state for Address
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenPopup = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Start loading
        setIsLoading(true);

        try {
            // Simulate API call or any async operation (replace with actual logic)
            await submitFormToServer();

            // Reset form fields and close popup
            setName('');
            setPhoneNumber('');
            setEmail('');
            setParentPhoneNumber('');
            setDOB('');
            setAddress('');
            setShowPopup(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle error state if needed
        } finally {
            // Stop loading
            setIsLoading(false);
        }
    };

    const submitFormToServer = () => {
        // Replace with actual API call to submit form data
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success
                resolve();
            }, 2000); // Simulating 2 seconds delay
        });
    };

    const handleCancel = () => {
        // Reset form fields and close popup
        setName('');
        setPhoneNumber('');
        setEmail('');
        setParentPhoneNumber('');
        setDOB('');
        setAddress('');
        setShowPopup(false);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleParentPhoneNumberChange = (event) => {
        setParentPhoneNumber(event.target.value);
    };

    const handleDOBChange = (event) => {
        setDOB(event.target.value);
    };

    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };

    return (
        <>
            <Navbar title="Add Student" />
            <div className="student-add-container">
                <div className="student-form-container" onClick={handleOpenPopup}>
                    Click here to add student
                </div>
                <div className="student-list-container">
                    {/* Student list */}
                </div>
            </div>
            {showPopup && (
                <div className="student-add-file-container">
                    <nav className="navbar navbar-light bg-dark d-flex justify-content-between align-items-center px-3">
                        <div className="d-flex justify-content-center align-items-center">
                            <button onClick={handleClosePopup} className="popup-navbar navbar-brand student-close">
                                <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white' }} />
                            </button>
                            <h1 className="dataset-heading">Add Details</h1>
                        </div>
                    </nav>
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
                            <div className="form-group">
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="parentPhoneNumber"
                                    name="parentPhoneNumber"
                                    value={parentPhoneNumber}
                                    placeholder="Parent Phone Number"
                                    onChange={handleParentPhoneNumberChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="date"
                                    className="form-control"
                                    id="dob"
                                    name="dob"
                                    value={dob}
                                    onChange={handleDOBChange}
                                    required
                                />
                            </div>
                            <div className="form-group-address">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    name="address"
                                    value={address}
                                    onChange={handleAddressChange}
                                    placeholder="Address"
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button className="btn btn-secondary student-cancel" type="button" onClick={handleCancel}>Cancel</button>
                                <button className="btn btn-primary student-submit" type="submit" disabled={isLoading}>
                                    {isLoading ? 'Adding..' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <LabelBottomNavigation />
        </>
    );
};

export default AddStudents;
