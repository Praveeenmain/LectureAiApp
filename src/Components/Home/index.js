import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMicrophoneLines,faBook,faSquareCheck,faVideo} from '@fortawesome/free-solid-svg-icons';
import Header from '../Header';
import { Link } from 'react-router-dom';
import LabelBottomNavigation from '../BottomNav';
const Home=()=>{
    return(
        <>
        <div className='Home-page'>
            <Header/>
            <div className="AIfeatures">
                   {/* <div className="Audio-lectures box">
                      <Link className="HomeLinks" to='/teacherprofile'> 
                       <FontAwesomeIcon className="box-icon" icon={faUser} />    
                        <h1 className='box-heading'>Profile</h1>
                        </Link> 
                   </div>
                   
                   <div className="VideoLectures box">
                   <Link className="HomeLinks" to='/aichat'> 
                   <FontAwesomeIcon className="box-icon" icon={faRobot} />   
                   <h1 className='box-heading'>Assitant</h1>
                   </Link> 
                   </div> */}



                
                 <div className="Audio-lectures box">
                      <Link className="HomeLinks" to='/Audio-lectures'> 
                       <FontAwesomeIcon className="box-icon" icon={faMicrophoneLines} />
                        <h1 className='box-heading'>Audio Lectures</h1>
                        </Link> 
                   </div>
                   
                   <div className="VideoLectures box">
                   <Link className="HomeLinks" to='/Video-lectures'> 
                   <FontAwesomeIcon className="box-icon" icon={faVideo} />
                   <h1 className='box-heading'>Video Lectures</h1>
                   </Link> 
                   </div>
                   <div className="classNotes box">
                   <Link className="HomeLinks" to='/classnotes'> 
                   <FontAwesomeIcon className="box-icon" icon={faBook} />
                   <h1 className='box-heading'> Class Notes</h1>
                   </Link> 
                   </div>


                   <div className="classTest box">
                   <Link className="HomeLinks" to='/classtest'> 
                   <FontAwesomeIcon className="box-icon" icon={faSquareCheck} />
                   <h1 className='box-heading'>Class Tests</h1>
                   </Link> 
                   </div>
                 
            </div>
           

        </div>
          <LabelBottomNavigation/>
          </>
    )
}
export default Home