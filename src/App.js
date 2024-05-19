import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Game from './pages/Game';
import Register from './pages/Register';
import SignInSide from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Notfound from './pages/Notfound';

const App = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {localStorage.getItem('token') && (
            <Route path='/dashboard' element={<Dashboard />} />
          )}
          <Route path='/' element={<Register />} />
          <Route path='/login' element={<SignInSide />} />
          {localStorage.getItem('id') && (
            <Route path='/flappy-bird' element={<Game />} />
          )}
          <Route path='*' element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
