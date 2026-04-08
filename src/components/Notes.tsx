import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import styles from './Notes.module.css';

interface NotesProps {
  currentDate: Date;
  startDate: Date | null;
  endDate: Date | null;
}

export default function Notes({ currentDate, startDate, endDate }: NotesProps) {
  const [noteContent, setNoteContent] = useState('');

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
    setNoteContent(saved || '');
  }, [storageKey]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNoteContent(value);
    localStorage.setItem(storageKey, value);
  };

  return (
    <div className={styles.notesContainer}>
      <h3 className={styles.notesTitle}>{title}</h3>
      <div className={styles.paperTextarea}>
        <textarea
          className={styles.textarea}
          value={noteContent}
          onChange={handleChange}
          placeholder="Jot down memos here..."
          spellCheck="false"
        />
        <div className={styles.lines}></div>
      </div>
    </div>
  );
}
