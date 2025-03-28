// components/CalendarCard.js
import styles from "./CalendarCard.module.css";
import Calendar from "./Calendar/Calendar";

export default function CalendarCard({ selectedDate, onDateClick }) {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        <Calendar onDateClick={onDateClick} selectedDate={selectedDate} />
      </div>
    </div>
  );
}
