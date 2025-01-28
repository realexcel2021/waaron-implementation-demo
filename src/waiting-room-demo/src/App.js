import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login';
import WaitingRoom from './components/WaitingRoom';
import Notes from './components/Notes';
import CreateNote from './components/CreateNote';
import EditNote from './components/EditNote';
import './App.css'

// App Component
const App = () => {
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : null;
  });
  const [vwrToken, setVwarToken] = useState(() => localStorage.getItem('vwrToken'));
  const [vwrTokenExpiresIn, setVwarTokenExpiresIn] = useState(() => {
    const savedExpiry = localStorage.getItem('vwrTokenExpiresIn');
    if (!savedExpiry) return null;

    const expiryTime = parseInt(savedExpiry, 10);
    const now = Date.now();
    const tokenSetTime = parseInt(localStorage.getItem('tokenSetTime') || '0', 10);
    const timeElapsed = Math.floor((now - tokenSetTime) / 1000);
    
    return Math.max(0, expiryTime - timeElapsed);
  });

  // Persist auth state
  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('auth');
      // Clear other auth-related items when logging out
      localStorage.removeItem('vwrToken');
      localStorage.removeItem('vwrTokenExpiresIn');
      localStorage.removeItem('tokenSetTime');
    }
  }, [auth]);

  useEffect(() => {
    if (vwrToken) {
      localStorage.setItem('vwrToken', vwrToken);
    } else {
      localStorage.removeItem('vwrToken');
    }
  }, [vwrToken]);

  useEffect(() => {
    if (vwrTokenExpiresIn) {
      localStorage.setItem('vwrTokenExpiresIn', vwrTokenExpiresIn.toString());
      localStorage.setItem('tokenSetTime', Date.now().toString());
    } else {
      localStorage.removeItem('vwrTokenExpiresIn');
      localStorage.removeItem('tokenSetTime');
    }
  }, [vwrTokenExpiresIn]);

  // Check token expiration on mount and start monitoring
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (auth && vwrTokenExpiresIn !== null) {
        if (vwrTokenExpiresIn <= 0) {
          setAuth(null);
        } else {
          setVwarTokenExpiresIn(prev => prev - 1);
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 1000);
    return () => clearInterval(interval);
  }, [auth, vwrTokenExpiresIn]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          auth ? (
            <WaitingRoom auth={auth} setVwarToken={setVwarToken} setVwarTokenExpiresIn={setVwarTokenExpiresIn}/>
          ) : (
            <LoginPage setAuth={setAuth}/>
          )
        } />
        <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
        <Route
          path="/waiting"
          element={
            auth ? (
              <WaitingRoom auth={auth} setVwarToken={setVwarToken} setVwarTokenExpiresIn={setVwarTokenExpiresIn}/>
            ) : (
              <p>Please log in first.</p>
            )
          }
        />
        <Route
          path="/notes"
          element={
            auth ? (
              <Notes vwrToken={vwrToken} tokenExpiryInSeconds={vwrTokenExpiresIn} setAuth={setAuth}/>
            ) : (
              <p>Please log in first.</p>
            )
          }
        />
        <Route
          path="/create"
          element={
            auth ? (
              <CreateNote isExpired={!vwrTokenExpiresIn || vwrTokenExpiresIn <= 0}/>
            ) : (
              <p>Please log in first.</p>
            )
          }
        />
        <Route
          path="/edit/:id"
          element={
            auth ? (
              <EditNote isExpired={!vwrTokenExpiresIn || vwrTokenExpiresIn <= 0}/>
            ) : (
              <p>Please log in first.</p>
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
