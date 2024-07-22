import React from "react";
import { Link } from "react-router-dom";

import './index.css'
const LandingPage=()=>{
    return(
        <div className="Landing-page-container">
         <div className="landing-nav-container">
         <img className="landing-logo" src="https://play-lh.googleusercontent.com/nPFp9nxBxCdnfiKHfW3dOwPrchqIoXr0c2ujvEhIAqXdXa4H1rRN9iUBKeXD2SMNreWV" alt="mobishala"/>
         <h1 className="nav-heading"> Mobishaala</h1>
         </div> 
       
          
          
          
           <div className="Landing-heading-describe">
               <h1 className="landing-desc"> Which describes You Best?</h1>
               <div className="teacher-Assistant-Ai">
               <div className="ai-logo-container">
                <img className="ai-logo" src="https://res.cloudinary.com/dgviahrbs/image/upload/v1721233321/Untitled-removebg-preview_ufpwz0.png" alt="teacher" />
               </div>
               <h1 className="landing-heading"> For Teachers</h1>
               <p className="landing-caption">Empower Your Self with Teacher assistant Ai-<span className="landing-Ai-heading">TaAi.</span></p>
               <Link to="/login" className="teacher-get-started"> Get Started</Link>
           </div>
           <div className="student-Assistant-Ai">
           <div className="ai-logo-container">
                <img className="ai-logo" src="https://res.cloudinary.com/dgviahrbs/image/upload/v1721233288/Untitled__1_-removebg-preview_txuvcr.png" alt="teacher" />
               </div>
               <h1 className="landing-heading"> For Students</h1>
               <p className="landing-caption">Learn at Light Speed with Student Assistant- <span className="landing-Ai-heading">SaAi </span></p>
               <Link to={{ pathname: "https://mobishaala-saai.netlify.app/" }} target="_blank" className="student-get-started">
      Get Started
    </Link>
           </div>
           </div>

          

         </div>
    )
}
export default LandingPage