"use client";

import React, { useState, useEffect } from 'react';
import styles from './Calendar.module.css';
import Hero from './Hero';
import Grid from './Grid';
import Notes from './Notes';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedCurrent = localStorage.getItem('calendar-current-date');
    if (savedCurrent) setCurrentDate(new Date(savedCurrent));

    const savedStart = localStorage.getItem('calendar-start-date');
    if (savedStart) setStartDate(new Date(savedStart));

    const savedEnd = localStorage.getItem('calendar-end-date');
    if (savedEnd) setEndDate(new Date(savedEnd));
    
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    
    localStorage.setItem('calendar-current-date', currentDate.toISOString());
    
    if (startDate) {
      localStorage.setItem('calendar-start-date', startDate.toISOString());
    } else {
      localStorage.removeItem('calendar-start-date');
    }
    
    if (endDate) {
      localStorage.setItem('calendar-end-date', endDate.toISOString());
    } else {
      localStorage.removeItem('calendar-end-date');
    }
  }, [currentDate, startDate, endDate, isInitialized]);
  
  const themes = [
    { name: 'Sky', color: '#0ea5e9', hover: '#0284c7' },
    { name: 'Rose', color: '#f43f5e', hover: '#e11d48' },
    { name: 'Emerald', color: '#10b981', hover: '#059669' },
    { name: 'Amber', color: '#f59e0b', hover: '#d97706' },
  ];
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);

  const calendarStyle = {
    '--primary-color': selectedTheme.color,
    '--primary-hover': selectedTheme.hover,
  } as React.CSSProperties;

  return (
    <div className={styles.calendarPaper} style={calendarStyle}>
      <div className={styles.bindingPlaceholder}>
        {[...Array(20)].map((_, i) => (
          <div key={i} className={styles.spiralHole}></div>
        ))}
      </div>
      
      <div className={styles.themeSwitcher}>
        {themes.map((theme) => (
          <button
            key={theme.name}
            className={`${styles.themeButton} ${selectedTheme.name === theme.name ? styles.activeTheme : ''}`}
            style={{ backgroundColor: theme.color }}
            onClick={() => setSelectedTheme(theme)}
            aria-label={`Select ${theme.name} theme`}
            title={`Select ${theme.name} theme`}
          />
        ))}
      </div>
      
      <Hero currentDate={currentDate} />
      
      <div className={styles.bottomSection}>
        <div className={styles.notesSection}>
          <Notes currentDate={currentDate} startDate={startDate} endDate={endDate} />
        </div>
        <div className={styles.gridSection}>
          <Grid 
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>
      </div>
    </div>
  );
}
