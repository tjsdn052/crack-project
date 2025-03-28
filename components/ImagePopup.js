// components/ImagePopup.js
import React from "react";
import styles from "./ImagePopup.module.css"; // 팝업 스타일을 위한 CSS 모듈

const ImagePopup = ({ imageUrl, description, onClose }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <div className={styles.imageContainer}>
          <img src={imageUrl} alt="균열 사진" />
        </div>
        <div className={styles.descriptionContainer}>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ImagePopup;
