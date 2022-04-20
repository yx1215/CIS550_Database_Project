// import './view/App.css';
import React from 'react';
import {
    BrowserRouter,
    Route,
    Switch
} from 'react-router-dom';
import Search from './Search';
import GamePage from './GamePage';


function App() {
  return (
      <BrowserRouter>
          <Route exact path="/" component={Search} />
          <Route path="/game" component={GamePage} />
      </BrowserRouter>
  );
}
export default App;