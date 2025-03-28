// components/GraphCard.js
import styles from "./GraphCard.module.css";

export default function GraphCard() {
  return (
    <div className={styles.card}>
      <h3>균열 폭 확장 속도</h3>
      <div className={styles.graphPlaceholder}>
        {/* 실제 그래프 표시는 여기에 구현 */}
        <p>균열 변화 속도 그래프 영역</p>
      </div>
    </div>
  );
}
