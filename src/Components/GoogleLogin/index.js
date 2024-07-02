import React, { useState, useEffect, useMemo } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FaWhatsapp } from "react-icons/fa";
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // corrected import
import './index.css';

const GoogleLoginComponent = () => {
    const history = useHistory();
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [bgColor, setBgColor] = useState('#ffffff');
    const [showText, setShowText] = useState(false);

    const texts = [
       
       
        "Teacher Assistant Ai",
        "Lecture to Notes",
        "Notes to Tests",
        "Tests to Lecture",
        "Lecture to Test",
        "Test to Notes",
        "Anything to Everything",
        "Your Content",
        "Your control",
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
            }, prevIndex => (prevIndex <= 3 ? 600 : 100)); 

        }, 3000); 

        return () => clearInterval(intervalId);
    }, [texts.length, colors]); 

    const onSuccess = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;
            const decodedToken = jwtDecode(token);

            const { name, email } = decodedToken;
    
           
            Cookies.set('jwt_token', token, { expires: 30, secure: true, sameSite: 'strict' });
    
            
            await fetch('https://pdfaibackend.onrender.com/api/store-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email })
            });
    
           
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
                 <h1 className='main-taAi'>Introducing <br/> <span className='Taai-span'>TaAi</span></h1>
                {showText && <span className="text-showing"  dangerouslySetInnerHTML={{ __html: texts[currentTextIndex] }} />}
            </div>
            <div className='google-button-email-container'>
                <h1 className='ai-create-heading'>Create Your Ai Assistant</h1>
                <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                
                <GoogleLogin  onSuccess={onSuccess} onError={onError} text="continue_with" />
         
                </GoogleOAuthProvider>
                <button className='Whatapp-button'  onClick={() => {
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
