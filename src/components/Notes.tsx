import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import styles from './Notes.module.css';

interface NotesProps {
  currentDate: Date;
  startDate: Date | null;
  endDate: Date | null;
}

interface NoteItem {
  id: string;
  text: string;
}

export default function Notes({ currentDate, startDate, endDate }: NotesProps) {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [inputValue, setInputValue] = useState('');

  let keyContext = format(currentDate, 'yyyy-MM');
  let title = `Notes for ${format(currentDate, 'MMMM yyyy')}`;

  const isRelevant = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    if (startDate && endDate) {
      return startDate <= monthEnd && endDate >= monthStart;
    }
    if (startDate) {
      return startDate >= monthStart && startDate <= monthEnd;
    }
    return false;
  };

  if (isRelevant()) {
    if (startDate && endDate) {
      keyContext = `range_${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}`;
      title = `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;
    } else if (startDate) {
      keyContext = `day_${format(startDate, 'yyyy-MM-dd')}`;
      title = format(startDate, 'MMMM d, yyyy');
    }
  }

  const storageKey = `calendar-notes-${keyContext}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setNotes(parsed);
        } else {
          setNotes([{ id: '1', text: saved }]);
        }
      } catch (e) {
        if (saved.trim().length > 0) {
          setNotes([{ id: Date.now().toString(), text: saved }]);
        }
      }
    } else {
      setNotes([]);
    }
  }, [storageKey]);

  const handleAddNote = () => {
    if (inputValue.trim()) {
      const newNotes = [...notes, { id: Date.now().toString(), text: inputValue.trim() }];
      setNotes(newNotes);
      localStorage.setItem(storageKey, JSON.stringify(newNotes));
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddNote();
    }
  };

  const handleDeleteNote = (id: string) => {
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    localStorage.setItem(storageKey, JSON.stringify(newNotes));
  };

  return (
    <div className={styles.notesContainer}>
      <h3 className={styles.notesTitle}>{title}</h3>
      
      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a note..."
        />
        <button onClick={handleAddNote} className={styles.addButton}>Add</button>
      </div>

      <div className={styles.notesList}>
        {notes.length === 0 ? (
          <p className={styles.emptyMessage}>No notes right now. Add a note to get started!</p>
        ) : (
          notes.map(note => (
            <div key={note.id} className={styles.noteItem}>
              <span className={styles.noteText}>{note.text}</span>
              <button 
                className={styles.deleteButton} 
                onClick={() => handleDeleteNote(note.id)}
                aria-label="Delete note"
              >
                X
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
