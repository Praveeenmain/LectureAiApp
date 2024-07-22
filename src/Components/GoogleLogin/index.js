import React, { useState, useEffect, useMemo } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FaWhatsapp } from "react-icons/fa";
import Cookies from 'js-cookie';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Circles } from 'react-loader-spinner';

import './index.css';

const GoogleLoginComponent = () => {
    const history = useHistory();
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [bgColor, setBgColor] = useState('#ffffff');
    const [showText, setShowText] = useState(false);
    const [isFirstCycle, setIsFirstCycle] = useState(true);
    const [loading, setLoading] = useState(false);

    const texts = [
        "Lecture to Notes",
        "Notes to Tests",
        "Tests to Lecture",
        "Lecture to Tests",
        "Test to Notes",
        "Anything to Everything",
        "Your Content",
        "Your Control",
        "Your Assistant Ai"
    ];

    const colors = useMemo(() => ['#f28b82', '#fbbc04', '#34a853', '#4285f4'], []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setShowText(false);

            setTimeout(() => {
                setCurrentTextIndex(prevIndex => (prevIndex + 1) % texts.length);
                setBgColor(colors[Math.floor(Math.random() * colors.length)]);
                setShowText(true);

                if (isFirstCycle && currentTextIndex === 0) {
                    setIsFirstCycle(false);
                }
            }, 600);
        }, 3000);

        return () => clearInterval(intervalId);
    }, [texts.length, colors, currentTextIndex, isFirstCycle]);

    const onSuccess = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;
            Cookies.set('jwt', token, { expires: 30, secure: true, sameSite: 'strict' });
          
            // Set the loader state to true
            setLoading(true);

            // API call to authenticate with your backend
            const res = await axios.post('https://taaibackend.onrender.com/auth/google', { tokenId: token });
            const googletoken = res.data.token;
            Cookies.set('jwt_token', googletoken, { expires: 1/24, secure: true, sameSite: 'strict' });

            // Set a timer to redirect after 1 second
            setTimeout(() => {
                history.push('/voice');
                setLoading(false);  // Hide loader after redirect
            }, 1000);
        } catch (error) {
            console.error('Error decoding token or during Google Sign-In:', error);
            setLoading(false);  // Ensure loader is hidden on error
        }
    };
    
    const onError = (error) => {
        console.error('Google Sign-In Error:', error);
    };
    

    return (
        <div className='Login-bg-container'>
            
            <div className='Login-text-container' style={{ backgroundColor: bgColor, padding: '20px', fontSize: '25px', fontFamily: "Roboto", fontWeight: "bold", position: 'relative' }}>
                <h1 className='main-taAi' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%' }}>
                    {isFirstCycle && currentTextIndex === 0 ? (
                        <span className='Taai-span'>TaAi <br/> </span>
                    ) : (
                        <div>
                            <span className='Taai-span'>TaAi <br/> </span>
                            <p className='t-2'> <span className='bold'>T</span>eacher <span className='bold'>a</span>ssistant <span className='bold'>A</span>i</p>
                        </div>
                    )}
                </h1>
                {showText && <span className="text-showing" dangerouslySetInnerHTML={{ __html: texts[currentTextIndex] }} />}
            </div>
            {loading && (
                <div className="loader-container">
                    <Circles
                        height="80"
                        width="80"
                        color="white"
                        ariaLabel="circles-loading"
                        visible={true}
                    />
                </div>
            )}
            <div className='google-button-email-container'>
                <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                    <div className="google-button-wrapper">
                        <GoogleLogin size='large' onSuccess={onSuccess} onError={onError} text="continue_with" />
                    </div>
                    
                </GoogleOAuthProvider>
                <button className='Whatapp-button custom-whatsapp-button' onClick={() => {
                    const message = encodeURIComponent("Hello, I want to know more about TaAi. My name is [Your Name]");
                    window.open(`https://wa.me/919972968390?text=${message}`, '_blank');
                }}>
                    <FaWhatsapp className='Whatapp-icon' />
                    <span className='Whatapp-text'>Talk to us</span>
                </button>
            
            </div>
          
        </div>
    );
};

export default GoogleLoginComponent;
