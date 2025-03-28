import styles from "./Header.module.css";

export default function Header({ onToggleRightSidebar }) {
  const userName = "홍길동"; // 사용자 이름

  return (
    <div className={styles.headerContainer}>
      <header className={styles.header}>
        <div className={styles.headerText}>Dashboard</div>
        <div
          className={styles.userSection}
          onClick={onToggleRightSidebar}
          style={{ cursor: "pointer" }}
        >
          <img
            src="Avatar.svg"
            alt="User Avatar"
            className={styles.userAvatar}
          />{" "}
          {/* 이미지 추가 */}
          <span className={styles.userName}>{userName}</span>
        </div>
      </header>
    </div>
  );
}
