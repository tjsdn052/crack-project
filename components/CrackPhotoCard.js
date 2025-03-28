import styles from "./CrackPhotoCard.module.css";
import { useState, useEffect } from "react";
import ImagePopup from "./ImagePopup";
import axios from "axios";

export default function CrackPhotoCard({ selectedDate }) {
  const [crackData, setCrackData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!selectedDate) {
      setCrackData(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const formattedDate = selectedDate.toISOString().split("T")[0];

        // 실제 API 호출
        try {
          const response = await axios.get(`/images?date=${formattedDate}`);
          setCrackData(response.data);
        } catch (apiError) {
          // 404는 정상적인 "데이터 없음" 상태로 처리
          if (apiError.response && apiError.response.status === 404) {
            setCrackData(null);
            return;
          }
          throw apiError; // 404가 아닌 다른 에러는 다시 throw
        }
      } catch (err) {
        console.error("Error fetching image:", err);

        // 404를 제외한 다른 에러 처리
        if (err.response && err.response.status === 500) {
          setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else if (!navigator.onLine) {
          setError("인터넷 연결을 확인해주세요.");
        } else {
          setError(
            "이미지를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage({ imageUrl });
  };

  const closePopup = () => {
    setSelectedImage(null);
  };

  return (
    <div className={styles.wrapper}>
      {/* 뒤에 보이도록 카드 뒤에 배치 */}
      {selectedDate && (
        <div className={`${styles.dateHeader} ${styles.fadeIn}`}>
          <img
            src="/folder_icon.svg"
            alt="폴더 아이콘"
            className={styles.folderIcon}
          />
          <p className={styles.selectedDateText}>
            {selectedDate.toLocaleDateString()}
          </p>
        </div>
      )}

      {/* 카드가 앞에 오도록 */}
      <div className={styles.card}>
        {isLoading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : crackData ? (
          <div className={styles.imageDisplay}>
            <div className={styles.imageContainer}>
              <img
                src={crackData.imageUrl}
                alt={`균열 사진 - ${selectedDate?.toLocaleDateString()}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  cursor: "pointer",
                }}
                onClick={() => handleImageClick(crackData.imageUrl)}
              />
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            {!selectedDate ? (
              <p>날짜 또는 Waypoint를 선택해주세요</p>
            ) : (
              <p>
                {selectedDate?.toLocaleDateString()}의 균열 사진 정보가
                없습니다.
              </p>
            )}
          </div>
        )}

        {selectedImage && (
          <ImagePopup
            imageUrl={selectedImage.imageUrl}
            description={null}
            onClose={closePopup}
          />
        )}
      </div>
    </div>
  );
}
