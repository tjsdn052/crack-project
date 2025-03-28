// pages/settings.js
import Layout from "../components/Layout";
import styles from "./settings.module.css";

export default function SettingsPage() {
  return (
    <Layout>
      <div className={styles.container}>
        <h1>환경 설정</h1>
        <div className={styles.section}></div>
      </div>
    </Layout>
  );
}
