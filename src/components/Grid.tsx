import React, { useState } from 'react';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, 
  isBefore, isAfter, addMonths, subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Grid.module.css';

interface GridProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
}

export default function Grid({ 
  currentDate, setCurrentDate, startDate, setStartDate, endDate, setEndDate 
}: GridProps) {
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [animationClass, setAnimationClass] = useState('');

  const holidays: Record<string, string> = {
    '12-25': 'Christmas Day',
    '01-01': "New Year's Day",
    '10-31': 'Halloween',
    '02-14': "Valentine's Day",
    '07-04': 'Independence Day',
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDateOfWeek = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDateOfWeek = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDateOfWeek, end: endDateOfWeek });

  const handleDayClick = (day: Date) => {
    if (!startDate) {
      setStartDate(day);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (isSameDay(day, startDate)) {
        setStartDate(null);
      } else if (isBefore(day, startDate)) {
        setEndDate(startDate);
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    } else if (startDate && endDate) {
      setStartDate(day);
      setEndDate(null);
    }
  };

  const isIntermediate = (day: Date) => {
    if (startDate && endDate) {
      return isWithinInterval(day, { start: startDate, end: endDate }) && 
             !isSameDay(day, startDate) && !isSameDay(day, endDate);
    }
    if (startDate && hoverDate && !endDate) {
      const lower = isBefore(hoverDate, startDate) ? hoverDate : startDate;
      const upper = isAfter(hoverDate, startDate) ? hoverDate : startDate;
      return isWithinInterval(day, { start: lower, end: upper }) && 
             !isSameDay(day, lower) && !isSameDay(day, upper);
    }
    return false;
  };

  const handleNextMonth = () => {
    setAnimationClass(styles.slideOutLeft);
    setTimeout(() => {
      setCurrentDate(addMonths(currentDate, 1));
      setAnimationClass(styles.slideInRight);
    }, 150);
  };
  
  const handlePrevMonth = () => {
    setAnimationClass(styles.slideOutRight);
    setTimeout(() => {
      setCurrentDate(subMonths(currentDate, 1));
      setAnimationClass(styles.slideInLeft);
    }, 150);
  };

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className={styles.gridContainer}>
      <div className={styles.controls}>
        <button className={styles.navButton} onClick={handlePrevMonth} aria-label="Previous Month">
          <ChevronLeft size={20} />
        </button>
        <span className={styles.monthLabel}>{format(currentDate, 'MMMM yyyy')}</span>
        <button className={styles.navButton} onClick={handleNextMonth} aria-label="Next Month">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className={styles.weekDays}>
        {weekDays.map((day, idx) => (
          <div 
            key={day} 
            className={`${styles.weekDay} ${idx >= 5 ? styles.weekendDay : ''}`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className={`${styles.grid} ${animationClass}`} onAnimationEnd={() => setAnimationClass('')}>
        {days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          let isActualStart = false;
          let isActualEnd = false;

          if (startDate && endDate) {
            isActualStart = isSameDay(day, startDate);
            isActualEnd = isSameDay(day, endDate);
          } else if (startDate && hoverDate && !endDate) {
            const lower = isBefore(hoverDate, startDate) ? hoverDate : startDate;
            const upper = isAfter(hoverDate, startDate) ? hoverDate : startDate;
            isActualStart = isSameDay(day, lower);
            isActualEnd = isSameDay(day, upper);
          } else if (startDate) {
            isActualStart = isSameDay(day, startDate);
          }

          const isMiddle = isIntermediate(day);

          let dayClasses = styles.dayInfo;
          if (!isCurrentMonth) dayClasses += ` ${styles.notCurrentMonth}`;
          if (isActualStart) dayClasses += ` ${styles.selectedStart}`;
          if (isActualEnd && (!isActualStart || (startDate && endDate))) dayClasses += ` ${styles.selectedEnd}`;
          
          const activeEndDate = endDate || hoverDate;
          const hasRange = startDate && activeEndDate && !isSameDay(startDate, activeEndDate);
          if (isActualStart && hasRange) dayClasses += ` ${styles.rangeStart}`;
          if (isActualEnd && hasRange && (!isActualStart || (startDate && endDate))) dayClasses += ` ${styles.rangeEnd}`;

          if (isMiddle) dayClasses += ` ${styles.intermediate}`;

          const dayMonthStr = format(day, 'MM-dd');
          const holidayName = holidays[dayMonthStr];

          let cellClasses = styles.dayCell;
          if (isMiddle) cellClasses += ` ${styles.intermediateCell}`;

          return (
            <div 
              key={day.toISOString()} 
              className={cellClasses}
              onMouseEnter={() => setHoverDate(day)}
              onMouseLeave={() => setHoverDate(null)}
              onClick={() => handleDayClick(day)}
              title={holidayName ? holidayName : undefined}
            >
              <div className={dayClasses}>
                <span className={styles.dayNumber}>{format(day, 'd')}</span>
              </div>
              {holidayName && <div className={styles.holidayDot}></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
