import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Components/Home';
import AudioRecorder from './Components/AudioAiApp';
import NotFound from './Components/Notfound';
import AiBot from './Components/AiBot';
import PopContent from './Components/popupcontent/popcontent';
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
          <Route path="*" component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
