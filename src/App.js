import './App.css';
import React from 'react';
import Navbar from './components/NavBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homescreen from './screens/Homescreen';
import Bookingscreen from './screens/Bookingscreen';
import Registerscreen from './screens/Registerscreen';
import Loginscreen from './screens/Loginscreen';

function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/home' Component={Homescreen} />
          <Route path='/book/:roomid' Component={Bookingscreen} />
          <Route path='/register' Component={Registerscreen} />
          <Route path='/login' Component={Loginscreen} />

        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
