// components/Sidebar.js
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <img src={"/logo.svg"} alt="Logo" />
      </div>
    </div>
  );
}
