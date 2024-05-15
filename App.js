import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Game from './pages/Game';
import Register from './pages/Register';
import SignInSide from './pages/SignIn';
import Dashboard from './pages/Dashboard';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {localStorage.getItem('token') && (
            <Route path='/dashboard' element={<Dashboard />} />
          )}
          <Route path='/' element={<Register />} />
          <Route path='/login' element={<SignInSide />} />
          <Route path='/flappy-bird' element={<Game />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
