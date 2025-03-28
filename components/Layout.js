// Layout.js
import React, { useState, useRef, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import styles from "./Layout.module.css";
import CalendarCard from "./CalendarCard";
import MapCard from "./MapCard";
import CrackPhotoCard from "./CrackPhotoCard";
import GraphCard from "./GraphCard";
import RiskRankingCard from "./RiskRankingCard";

export default function Layout({ children }) {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const rightSidebarRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isRightSidebarOpen &&
        rightSidebarRef.current &&
        !rightSidebarRef.current.contains(event.target)
      ) {
        setIsRightSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isRightSidebarOpen]);

  const handleDateClick = (date) => {
    setSelectedDate(new Date(date)); // 새로운 Date 객체를 생성하여 state 업데이트
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.contentContainer}>
        <Header onToggleRightSidebar={toggleRightSidebar} />
        <main className={styles.main}>
          <div className={styles.dashboardFlex}>
            <div className={styles.flexRow}>
              <CalendarCard
                className={styles.flexItem}
                onDateClick={handleDateClick}
                selectedDate={selectedDate}
              />
              <MapCard className={styles.flexItem} />
              <CrackPhotoCard
                className={styles.flexItem}
                selectedDate={selectedDate}
              />
            </div>
            <div className={styles.flexRow}>
              <GraphCard className={styles.flexItem} />
              <RiskRankingCard className={styles.flexItem} />
            </div>
          </div>
        </main>
        <RightSidebar
          isOpen={isRightSidebarOpen}
          onClose={toggleRightSidebar}
          ref={rightSidebarRef}
        />
      </div>
    </div>
  );
}
