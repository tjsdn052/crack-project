// pages/index.js
import Layout from "../components/Layout";
import CalendarCard from "../components/CalendarCard";
import CrackPhotoCard from "../components/CrackPhotoCard";
import GraphCard from "../components/GraphCard";
import RiskRankingCard from "../components/RiskRankingCard";
import styles from "./index.module.css";
import { useState } from "react";
import dynamic from "next/dynamic";

const MapCard = dynamic(() => import("../components/MapCard"), {
  ssr: false,
});

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <Layout>
      {/* id 추가 */}
      <div id="dashboardContainer">
        <div className={styles.dashboardGrid}>
          <CalendarCard
            onDateClick={handleDateClick}
            selectedDate={selectedDate}
          />
          <MapCard />
          <CrackPhotoCard selectedDate={selectedDate} />
          <GraphCard />
          <RiskRankingCard />
        </div>
      </div>
    </Layout>
  );
}
