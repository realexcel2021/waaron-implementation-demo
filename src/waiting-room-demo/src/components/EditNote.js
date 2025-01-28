import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Notes.css';

const EditNote = ({ isExpired }) => {
  const [note, setNote] = useState(null);
  const [editedText, setEditedText] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const foundNote = notes.find(n => n.id === Number(id));
    if (foundNote) {
      setNote(foundNote);
      setEditedText(foundNote.text);
    } else {
      navigate('/notes');
    }
  }, [id, navigate]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleUpdate();
    }
  };

  const handleUpdate = () => {
    if (isExpired || !editedText.trim()) return;

    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const updatedNotes = notes.map(n => 
      n.id === Number(id) 
        ? { 
            ...n, 
            text: editedText,
            updatedAt: new Date().toISOString()
          }
        : n
    );
    
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    navigate('/notes');
  };

  if (!note) return null;

  return (
    <div className="notes-container">
      <div className="page-header">
        <h2>Edit Note</h2>
        <button onClick={() => navigate('/notes')} className="secondary-button">
          <span role="img" aria-label="back">⬅️</span> Back to Notes
        </button>
      </div>

      <div className="notes-input">
        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Edit your note... (Ctrl + Enter to save)"
          disabled={isExpired}
          autoFocus
        />
        <div className="input-actions">
          <button 
            onClick={handleUpdate} 
            disabled={isExpired || !editedText.trim()}
            className="primary-button"
          >
            <span role="img" aria-label="save">💾</span> Update Note
          </button>
          <button 
            onClick={() => navigate('/notes')} 
            className="cancel-button"
          >
            <span role="img" aria-label="cancel">❌</span> Cancel
          </button>
        </div>
      </div>

      <div className="note-metadata">
        <small>
          <span role="img" aria-label="created">📅</span> Created: {new Date(note.createdAt).toLocaleString()}
          {note.updatedAt && (
            <>
              <br />
              <span role="img" aria-label="updated">🔄</span> Last Updated: {new Date(note.updatedAt).toLocaleString()}
            </>
          )}
        </small>
      </div>
    </div>
  );
};

export default EditNote; 