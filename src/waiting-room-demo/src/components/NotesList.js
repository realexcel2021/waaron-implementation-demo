import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPen, FaTrash, FaCalendarAlt, FaSync, FaEdit } from 'react-icons/fa';
import './Notes.css';

const NotesList = ({ notes, isExpired, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="notes-list">
      {notes.length === 0 ? (
        <div className="empty-state">
          <FaPen className="empty-icon" />
          <p>No notes yet. Start by adding one!</p>
        </div>
      ) : (
        notes.map(note => (
          <div key={note.id} className="note-item">
            <p>{note.text}</p>
            <div className="note-actions">
              <button 
                onClick={() => navigate(`/edit/${note.id}`)} 
                disabled={isExpired}
                className="edit-button"
              >
                <FaEdit /> Edit
              </button>
              <button 
                onClick={() => onDelete(note.id)} 
                disabled={isExpired}
                className="delete-button"
              >
                <FaTrash /> Delete
              </button>
            </div>
            <small className="note-metadata">
              <span><FaCalendarAlt /> {new Date(note.createdAt).toLocaleString()}</span>
              {note.updatedAt && (
                <span className="updated-at">
                  <FaSync /> Updated: {new Date(note.updatedAt).toLocaleString()}
                </span>
              )}
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default NotesList; 