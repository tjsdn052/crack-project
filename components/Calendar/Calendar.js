import React, { useState } from "react";
import styles from "./Calendar.module.css";

const Calendar = ({ onDateClick, selectedDate }) => {
  const [date, setDate] = useState(new Date());

  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

  const days = [];

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const prevMonthDay = lastDayOfPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, prevMonthDay);
    days.push(
      <div
        key={`prev-${prevMonthDay}`}
        className={`${styles.day} ${styles.prevNextMonthDay}`}
        onClick={() => onDateClick(prevMonthDate)}
      >
        {prevMonthDay}
      </div>
    );
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const fullDate = new Date(year, month, i);
    const isSelected =
      selectedDate && fullDate.toDateString() === selectedDate.toDateString();
    const isToday = today.toDateString() === fullDate.toDateString();

    days.push(
      <div
        key={i}
        className={`${styles.day} ${isSelected ? styles.selected : ""} ${
          isToday ? styles.today : ""
        }`}
        onClick={() => onDateClick(fullDate)}
      >
        {i}
      </div>
    );
  }

  let nextMonthDay = 1;
  while (days.length < 42) {
    const nextMonthDate = new Date(year, month + 1, nextMonthDay);
    days.push(
      <div
        key={`next-${nextMonthDay}`}
        className={`${styles.day} ${styles.prevNextMonthDay}`}
        onClick={() => onDateClick(nextMonthDate)}
      >
        {nextMonthDay}
      </div>
    );
    nextMonthDay++;
  }

  const goToPrevMonth = () => {
    setDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    "January 01",
    "February 02",
    "March 03",
    "April 04",
    "May 05",
    "June 06",
    "July 07",
    "August 08",
    "September 09",
    "October 10",
    "November 11",
    "December 12",
  ];

  return (
    <div className={styles.calendar} style={{ height: "300px" }}>
      <div className={styles.header}>
        <h1>{monthNames[month]}</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "1.75rem",
          }}
        >
          <button onClick={goToPrevMonth}>&lt;</button>
          <h2>{year}</h2>
          <button onClick={goToNextMonth}>&gt;</button>
        </div>
      </div>
      <div className={styles.weekdays}>
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className={styles.days}>{days}</div>
    </div>
  );
};

export default Calendar;
