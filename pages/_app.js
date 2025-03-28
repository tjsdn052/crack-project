// pages/_app.js
import "../styles/globals.css";
import "cesium/Build/Cesium/Widgets/widgets.css"; // Cesium 기본 위젯 스타일

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
