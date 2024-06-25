import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNoteSticky, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
};

const truncateTitle = (title) => {
    const words = title.split(' ');
    return words.length > 2 ? words.slice(0, 2).join(' ') + '...' : title;
};

const Videomenu = ({ Video }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const formattedDate = formatDate(Video.date);

    const handleDelete = (event) => {
        event.preventDefault(); // Prevent default action (navigation)
        if (!Video) return;

        const url = `https://pdfaibackend.onrender.com/notefile/${Video.id}`;
        setIsDeleting(true);

        axios
            .delete(url)
            .then((response) => {
                console.log('Video file deleted successfully');
                window.location.reload(); // Reload the page after successful deletion
            })
            .catch((error) => {
                console.error('Error deleting Video file:', error);
                alert('Failed to delete Video file. Please try again.');
            })
            .finally(() => {
                setIsDeleting(false);
            });
    };

    console.log(Video);

    return (
        <div className="Video-menu-item">
            <div className='Note-item-content'>
                <Link className="Note-menu-link" to={`/Videos/${Video.id}`}>
                    <div className="Note-icons">
                        <div>
                            <FontAwesomeIcon className="Note-icon" icon={faNoteSticky} />
                        </div>
                        <div className="Note-details">
                            <h1 className="Note-title">{truncateTitle(Video.title)}</h1>
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

export default Videomenu;
