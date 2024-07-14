import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Components/Home';
import AudioRecorder from './Components/AudioAiApp';
import NotFound from './Components/Notfound';
import AiBot from './Components/AiBot'
import NotesAi from './Components/NotesAiApp'
import PopContent from './Components/AudioContent/popcontent'
import NoteDetails from './Components/NoteContent/index'
import VideoAi from './Components/VideoAiApp/index'
import VideoContent from './Components/VideoContent/index'
import ClassTestAi from './Components/ClassTestAi/index'
import ClassAsk from './Components/classAsk/index'
import GoogleLoginComponent from './Components/GoogleLogin'
import VoiceAIComponent  from './Components/Voiceweb'
import ProtectedRoute from './Components/ProtectedRoute'
import PrivateRoute from './Components/PrivateRoute';

import './App.css';
import Profile from './Components/Profile';
import AddStudents from './Components/AddStudents';
import TeacherProfile from './Components/TeacherProfile';

function App() {
  return (                      
    <div className="App">                
      <Router>
        <Switch>

          <PrivateRoute path="/" exact component={GoogleLoginComponent} />
          <ProtectedRoute path="/profile" exact component={Profile} />
          <ProtectedRoute path="/students" exact component={AddStudents} />
          <ProtectedRoute path="/Home" exact component={Home} />
          <ProtectedRoute path="/Audio-lectures" exact component={AudioRecorder} />
          <ProtectedRoute path="/voice" exact component={VoiceAIComponent} />
          <ProtectedRoute path="/audio-files/:id" exact component={PopContent} />
          <ProtectedRoute path="/classnotes" exact component={NotesAi} />
          <ProtectedRoute path="/Video-lectures" exact component={VideoAi} />
          <ProtectedRoute path="/classtest" exact component={ClassTestAi} />
          <ProtectedRoute path="/notes/:id" exact component={NoteDetails} />
          <ProtectedRoute path="/Videos/:id" exact component={VideoContent} />
          <ProtectedRoute path="/pqs/:id" exact component={ClassAsk} />
          <ProtectedRoute path="/teacherprofile" exact component={TeacherProfile} />
          <ProtectedRoute path="/chat" exact component={AiBot} />
          
       
       
          <Route path="*" component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
