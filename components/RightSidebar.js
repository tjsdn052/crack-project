// components/RightSidebar.js
import styles from "./RightSidebar.module.css";
import { FaTimes } from "react-icons/fa"; // Import the close icon
import { forwardRef } from "react";

const RightSidebar = forwardRef(({ isOpen, onClose }, ref) => {
  // Use forwardRef
  return (
    <div
      className={`${styles.rightSidebar} ${isOpen ? styles.open : ""}`}
      ref={ref}
    >
      {" "}
      {/* Attach the ref */}
      <button className={styles.closeButton} onClick={onClose}>
        {" "}
        {/* Close button */}
        <FaTimes />
      </button>
      <h2>마이페이지</h2>
      <div className={styles.profile}>
        {/* 사용자 프로필 정보 */}
        <div className={styles.profileIcon}>프</div>
        <p>이름: {}</p>
        <p>ID: {}</p>
        {/* 추가적인 프로필 정보 */}
      </div>
      <div className={styles.settings}>
        <h3>설정</h3>
        <ul>
          <li>계정 정보</li>
          <li>알림 설정</li>
          <li>로그아웃</li>
        </ul>
      </div>
    </div>
  );
});

RightSidebar.displayName = "RightSidebar"; // Recommended for better debugging

export default RightSidebar;
