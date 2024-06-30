import React, { useState, useEffect, useMemo } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import { FaWhatsapp } from "react-icons/fa";

import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './index.css';

const GoogleLoginComponent = () => {
    const history = useHistory();
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [bgColor, setBgColor] = useState('#ffffff');
    const [showText, setShowText] = useState(false); // Initial state to hide text

    const texts = ["Introducing TaAi","Teacher Assitant Ai","Lecture to Notes", "Notes to Tests", "Tests to Lecture", "Anything to Everything","Your Content your control","Your Assitant Ai"];
    
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
        }, 5000); // Change every 3 seconds

        return () => clearInterval(intervalId);
    }, [texts.length, colors]); // Include texts.length and colors in the dependency array

    const onSuccess = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;
           
            const decodedToken = jwtDecode(token);

            const { name, email } = decodedToken; // Extract name and email from decoded token
    
            
            // Set the JWT token in cookies
            Cookies.set('jwt_token', token, { expires: 30, secure: true, sameSite: 'strict' });
    
            // Post the decoded token details to the server
            await fetch('https://pdfaibackend.onrender.com/api/store-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                   
                },
                body: JSON.stringify({ name, email }) // Use name and email variables here
            });
    
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
                <h1 className='ai-create-heading' > Create Your Ai Assitant</h1>
                <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                    <GoogleLogin onSuccess={onSuccess} onError={onError} />
                </GoogleOAuthProvider>
                 <button className='Whatapp-button'>
                 <FaWhatsapp className='Whatapp-icon' />
                    <span className='Whatapp-text'>Talk to us</span>
                 </button>
            </div>
        </div>
    );
};

export default GoogleLoginComponent;
