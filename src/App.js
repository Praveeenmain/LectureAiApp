import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Components/Home';
import AudioRecorder from './Components/AudioAiApp';
import NotFound from './Components/Notfound';
import AiBot from './Components/AiBot';
import NotesAi from './Components/NotesAiApp'
import PopContent from './Components/AudioContent/popcontent';
import NoteDetails from './Components/NoteContent/index'
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/Audio-lectures" exact component={AudioRecorder} />
          <Route path="/aichat" exact component={AiBot} />
          <Route path="/audio-files/:id" exact component={PopContent} />
          <Route path="/classnotes" exact component={NotesAi} />
          <Route path="/notes/:id" exact component={NoteDetails} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
