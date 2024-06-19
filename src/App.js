import AudioRecorder from './Components/AudioAiApp'
import Home from './Components/Home';
import {Route, Switch } from 'react-router-dom';
import NotFound from './Components/Notfound';
import AiBot from './Components/AiBot'
import './App.css';

function App() {
  return (
    <div className="App">
      <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/Audio-lectures" exact component={AudioRecorder} />
      <Route path="/aichat" exact component={AiBot} />
      <Route path="*" component={NotFound}/>
      </Switch>
     
        
       
    </div>
  );
}

export default App;
