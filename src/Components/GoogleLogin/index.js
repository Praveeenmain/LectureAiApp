import React, { useState, useEffect, useMemo } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';

import './index.css';

const GoogleLoginComponent = () => {
    const history = useHistory();
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [bgColor, setBgColor] = useState('#ffffff');
    const [showText, setShowText] = useState(false); // Initial state to hide text

    const texts = ["Teacher Assitant Ai","Explore taai.", "Upload doc and chat.", "Generate questions", "Upload Youtube url and chat.","Record auido and Chat"];
    
    // Using useMemo to initialize colors array
    const colors = useMemo(() => ['#f28b82', '#fbbc04', '#34a853', '#4285f4'], []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setShowText(false); // Hide current text
            setTimeout(() => {
                setCurrentTextIndex(prevIndex => (prevIndex + 1) % texts.length);
                setBgColor(colors[Math.floor(Math.random() * colors.length)]);
                setShowText(true); // Show next text
            }, 200); // Delay before showing the next text
        }, 2000); // Change every 3 seconds

        return () => clearInterval(intervalId);
    }, [texts.length, colors]); // Include texts.length and colors in the dependency array

    const onSuccess = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;
             
              Cookies.set('jwt_token', token, { expires: 30 ,secure: true, sameSite: 'strict'});
            // Navigate to the home page after successful login
            history.push('/home');
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    };

    const onError = () => {
        console.log('Login Failed');
    };

    return (
        <div className='Login-bg-container'>
            <div className='Login-text-container' style={{ backgroundColor: bgColor, padding: '20px', fontSize: '25px', fontFamily: "Roboto", fontWeight: "bold" }}>
                {showText && (
                    <span>{texts[currentTextIndex]}</span>
                )}
            </div>
            <div className='google-button-email-container'>
                <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                    <GoogleLogin onSuccess={onSuccess} onError={onError} />
                </GoogleOAuthProvider>

            </div>
        </div>
    );
};

export default GoogleLoginComponent;
