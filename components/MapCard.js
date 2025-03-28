// components/MapCard.js
import styles from "./MapCard.module.css";
import CesiumMap from "./CesiumMap";

export default function MapCard() {
  return (
    <div className={styles.card}>
      <h3>Waypoint 경로</h3>
      <div className={styles.mapPlaceholder}>
        <CesiumMap />
      </div>
    </div>
  );
}
