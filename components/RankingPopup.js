// components/RankingPopup.js
import React from "react";
import styles from "./RankingPopup.module.css"; // 팝업 스타일을 위한 CSS 모듈

const RankingPopup = ({ rankings, onClose }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h3>전체 위험 순위</h3>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        {rankings.map((item) => (
          <div key={item.rank} className={styles.rankingItem}>
            <span className={styles.rank}>{item.rank}</span>
            <span className={styles.description}>{item.description}</span>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingPopup;
