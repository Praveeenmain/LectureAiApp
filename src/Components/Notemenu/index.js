import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNoteSticky, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import Cookie from 'js-cookie'
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
};
const token = Cookie.get('jwt_token')
const Notemenu = ({ Note }) => {

    const [isDeleting, setIsDeleting] = useState(false);
    const formattedDate = formatDate(Note.created_at);

    const handleDelete = (event) => {
        event.preventDefault(); // Prevent default action (navigation)
        if (!Note) return;

        const url = `https://taaibackend.onrender.com/notes/${Note.id}`;
        setIsDeleting(true);

        axios
            .delete(url, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })
            .then((response) => {
                console.log('Document file deleted successfully');
                window.location.reload(); // Reload the page after successful deletion
            })
            .catch((error) => {
                console.error('Error deleting Document file:', error);
                alert('Failed to delete Document file. Please try again.');
            })
            .finally(() => {
                setIsDeleting(false);
            });
    };

    return (
        <div className="note-menu-item">
            <div className='Note-item-content'>
                <Link className="Note-menu-link" to={`/notes/${Note.id}`}>
                    <div className="Note-icons">
                        <div>
                            <FontAwesomeIcon className="Note-icon" icon={faNoteSticky} />
                        </div>
                        <div className="Note-details">
                            <h1 className="Note-title">{Note.title}</h1>
                            <div className="Note-date">{formattedDate}</div>
                        </div>
                    </div>
                </Link>
                <Popup
                    trigger={<FontAwesomeIcon icon={faTrashAlt} className="delete-icon" />}
                    position="center"
                    closeOnDocumentClick
                    modal
                >
                    {close => (
                        <div className="popup-content">
                            <p style={{ color: 'white' }}>Are you sure you want to delete this Document?</p>
                            <div className="button-container">
                                <button className="confirm-button" onClick={(event) => {
                                    event.preventDefault(); // Prevent default action (navigation)
                                    handleDelete(event);
                                    close();
                                }}>
                                    {isDeleting ? 'Deleting...' : 'Confirm'}
                                </button>
                                <button className="cancel-button" onClick={close}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </Popup>
            </div>
        </div>
    );
};

export default Notemenu;
