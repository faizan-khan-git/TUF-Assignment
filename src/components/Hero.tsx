import React from 'react';
import styles from './Hero.module.css';

interface HeroProps {
  currentDate: Date;
}

export default function Hero({ currentDate }: HeroProps) {
  const monthName = currentDate.toLocaleString('default', { month: 'long' }).toUpperCase();
  const year = currentDate.getFullYear();

  return (
    <div className={styles.heroContainer}>
      <img
        className={styles.heroImage}
        src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200&auto=format&fit=crop"
        alt="Mountain Climber"
      />
      
      <div className={styles.imageOverlay}></div>
      
      <div className={styles.blueAccent}>
        <div className={styles.typography}>
          <span className={styles.year}>{year}</span>
          <span className={styles.month}>{monthName}</span>
        </div>
      </div>
    </div>
  );
}
