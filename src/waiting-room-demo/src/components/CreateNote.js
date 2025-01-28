import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notes.css';

const CreateNote = ({ isExpired }) => {
  const [newNote, setNewNote] = useState('');
  const navigate = useNavigate();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleCreate();
    }
  };

  const handleCreate = () => {
    if (isExpired || !newNote.trim()) return;

    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const newNoteObj = {
      id: Date.now(),
      text: newNote,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('notes', JSON.stringify([...notes, newNoteObj]));
    navigate('/notes');
  };

  return (
    <div className="notes-container">
      <div className="page-header">
        <h2>Create New Note</h2>
        <button onClick={() => navigate('/notes')} className="secondary-button">
          <span role="img" aria-label="back">⬅️</span> Back to Notes
        </button>
      </div>

      <div className="notes-input">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter your note... (Ctrl + Enter to save)"
          disabled={isExpired}
          autoFocus
        />
        <div className="input-actions">
          <button 
            onClick={handleCreate} 
            disabled={isExpired || !newNote.trim()}
            className="primary-button"
          >
            <span role="img" aria-label="save">💾</span> Save Note
          </button>
          <button 
            onClick={() => navigate('/notes')} 
            className="cancel-button"
          >
            <span role="img" aria-label="cancel">❌</span> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNote; 