import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Game from './pages/Game';
import Register from './pages/Register';
import SignInSide from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Notfound from './pages/Notfound';

const App = () => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) || (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

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
