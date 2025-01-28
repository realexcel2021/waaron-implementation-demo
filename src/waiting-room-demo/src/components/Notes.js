import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHourglassHalf, FaExclamationTriangle, FaPen, FaSignOutAlt } from 'react-icons/fa';
import NotesList from './NotesList';
import './Notes.css';

const Notes = ({ vwrToken, tokenExpiryInSeconds, setAuth }) => {
  const [notes, setNotes] = useState([]);
  const [timeLeft, setTimeLeft] = useState(tokenExpiryInSeconds);
  const [showExpiryDialog, setShowExpiryDialog] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const navigate = useNavigate();

  // Load notes from localStorage on component mount
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    setNotes(storedNotes);
  }, []);

  // Token expiration countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        // Show warning dialog when 30 seconds remaining
        if (prev === 30) {
          setShowExpiryDialog(true);
        }
        
        if (prev <= 1) {
          setIsExpired(true);
          setShowExpiryDialog(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRenewal = () => {
    localStorage.setItem('redirectReason', 'Token renewal needed');
    navigate('/');
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('redirectReason');
    navigate('/');
  };

  const handleDelete = (id) => {
    if (isExpired) {
      setShowExpiryDialog(true);
      return;
    }
    if (window.confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }
  };

  return (
    <div className="notes-container">
      {showExpiryDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <FaExclamationTriangle className="warning-icon" />
            <h3>{isExpired ? 'Session Expired' : 'Session Expiring Soon'}</h3>
            <p>
              {isExpired 
                ? 'Your session has expired. Please renew your session to continue editing notes.'
                : `Your session will expire in ${timeLeft} seconds. Please renew your session to avoid interruption.`
              }
            </p>
            <div className="dialog-actions">
              <button onClick={handleRenewal} className="primary-button">
                Renew Session
              </button>
              {!isExpired && (
                <button onClick={() => setShowExpiryDialog(false)} className="secondary-button">
                  Continue Working
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <div className="header-left">
          <h2>My Notes</h2>
          <div className="token-expiry">
            <FaHourglassHalf className="timer-icon" />
            <span>{Math.floor(timeLeft / 60)} minutes {timeLeft % 60} seconds remaining</span>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/create')} className="primary-button" disabled={isExpired}>
            <FaPen /> New Note
          </button>
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <NotesList 
        notes={notes}
        isExpired={isExpired}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Notes; 