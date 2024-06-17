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
                
                 <div className="Audio-lectures box">
                      <Link className="HomeLinks" to='/Audio-lectures'> 
                       <FontAwesomeIcon class="box-icon" icon={faMicrophoneLines} />
                        <h1 className='box-heading'>Audio Lectures</h1>
                        </Link> 
                   </div>
                   
                   <div className="VideoLectures box">
                   <Link className="HomeLinks" to='/Video-lectures'> 
                   <FontAwesomeIcon class="box-icon" icon={faVideo} />
                   <h1 className='box-heading'>Video Lectures</h1>
                   </Link> 
                   </div>
                   <div className="classNotes box">
                   <Link className="HomeLinks" to='/classnotes'> 
                   <FontAwesomeIcon class="box-icon" icon={faBook} />
                   <h1 className='box-heading'> classNotes</h1>
                   </Link> 
                   </div>


                   <div className="classTest box">
                   <Link className="HomeLinks" to='/classtest'> 
                   <FontAwesomeIcon class="box-icon" icon={faSquareCheck} />
                   <h1 className='box-heading'>class Tests</h1>
                   </Link> 
                   </div>
                   


                 
            </div>
           

        </div>
          <LabelBottomNavigation/>
          </>
    )
}
export default Home