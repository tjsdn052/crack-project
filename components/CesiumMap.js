import React, { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import axios from "axios";

const CesiumMap = () => {
  const cesiumContainer = useRef(null);
  const parentContainer = useRef(null);

  useEffect(() => {
    let viewer;

    const initializeCesium = async () => {
      try {
        Cesium.Ion.defaultAccessToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYmZhMzQzNC1lZWNiLTQwZGUtODFiMy1iYWFlNDQ0MGYxYTQiLCJpZCI6Mjg2MTQ0LCJpYXQiOjE3NDI0ODcyMDJ9.ktvHh_09ZJIeW4TtbMQPImnK6FeiroJMdicWhncT8IU";

        viewer = new Cesium.Viewer(cesiumContainer.current, {
          terrainProvider: await Cesium.CesiumTerrainProvider.fromIonAssetId(1),
          baseLayerPicker: true,
          geocoder: false,
          homeButton: false,
          animation: false,
          infoBox: true,
          sceneModePicker: false,
          selectionIndicator: false,
          timeline: false,
          navigationHelpButton: false,
          fullscreenElement: cesiumContainer.current,
        });
        viewer.scene.globe.depthTestAgainstTerrain = true;

        const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(96188);
        viewer.scene.primitives.add(tileset);
        await viewer.zoomTo(tileset);

        // 웨이포인트 목록
        const waypoints = [
          {
            id: 1,
            longitude: 127.281292,
            latitude: 36.766381,
            altitude: 115,
            name: "웨이포인트 1",
          },
          {
            id: 2,
            longitude: 127.281548,
            latitude: 36.766638,
            altitude: 115,
            name: "웨이포인트 2",
          },
          {
            id: 3,
            longitude: 127.281786,
            latitude: 36.766564,
            altitude: 115,
            name: "웨이포인트 3",
          },
          {
            id: 4,
            longitude: 127.281884,
            latitude: 36.766385,
            altitude: 115,
            name: "웨이포인트 4",
          },
        ];

        // 크랙 목록
        const cracks = [
          {
            longitude: 127.281325,
            latitude: 36.766485,
            altitude: 115.33,
            name: "크랙 1",
          },
          {
            longitude: 127.281045,
            latitude: 36.766718,
            altitude: 115,
            name: "크랙 2",
          },
        ];

        // 웨이포인트 마커 추가 (점 모양)
        waypoints.forEach((waypoint) => {
          viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(
              waypoint.longitude,
              waypoint.latitude,
              waypoint.altitude
            ),
            point: { pixelSize: 10, color: Cesium.Color.RED },
            label: {
              text: waypoint.name,
              font: "14px sans-serif",
              fillColor: Cesium.Color.WHITE,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            },
            description: `
              <table class="cesium-infoBox-defaultTable">
                <tr><th>이름</th><td>${waypoint.name}</td></tr>
                <tr><th>위도</th><td>${waypoint.latitude}</td></tr>
                <tr><th>경도</th><td>${waypoint.longitude}</td></tr>
                <tr><th>고도</th><td>${waypoint.altitude}m</td></tr>
              </table>
              <div style="margin-top: 15px;">
                <h3>균열 이미지</h3>
                <div id="waypoint-images-${waypoint.id}">
                  <p>이미지 로딩 중...</p>
                </div>
              </div>
            `,
            waypointData: waypoint,
          });
        });

        // 크랙 마커 추가 (X 모양)
        cracks.forEach((crack) => {
          viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(
              crack.longitude,
              crack.latitude,
              crack.altitude
            ),
            billboard: {
              image: generateXImage(),
              width: 20,
              height: 20,
            },
            label: {
              text: crack.name,
              font: "14px sans-serif",
              fillColor: Cesium.Color.WHITE,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            },
            description: `
              <table class="cesium-infoBox-defaultTable">
                <tr><th>이름</th><td>${crack.name}</td></tr>
                <tr><th>위도</th><td>${crack.latitude}</td></tr>
                <tr><th>경도</th><td>${crack.longitude}</td></tr>
                <tr><th>고도</th><td>${crack.altitude}m</td></tr>
              </table>
            `,
            crackData: crack,
          });
        });

        // 웨이포인트 간 점선 연결
        for (let i = 0; i < waypoints.length - 1; i++) {
          const start = Cesium.Cartesian3.fromDegrees(
            waypoints[i].longitude,
            waypoints[i].latitude,
            waypoints[i].altitude
          );
          const end = Cesium.Cartesian3.fromDegrees(
            waypoints[i + 1].longitude,
            waypoints[i + 1].latitude,
            waypoints[i + 1].altitude
          );

          viewer.entities.add({
            polyline: {
              positions: [start, end],
              width: 2,
              material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.YELLOW,
                dashLength: 10,
              }),
            },
          });
        }

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

        handler.setInputAction(async (click) => {
          const pickedObject = viewer.scene.pick(click.position);
          if (
            Cesium.defined(pickedObject) &&
            Cesium.defined(pickedObject.id) &&
            pickedObject.id.waypointData
          ) {
            viewer.selectedEntity = pickedObject.id;

            // 웨이포인트 이미지 로드
            try {
              const response = await axios
                .get(`/waypoints/${pickedObject.id.waypointData.id}/images`)
                .catch((error) => {
                  // 404는 이미지가 없는 정상적인 상황으로 처리
                  if (error.response && error.response.status === 404) {
                    return { data: [] };
                  }
                  throw error; // 다른 에러는 catch 블록으로 전달
                });

              const images = response.data || [];

              const imagesHtml =
                Array.isArray(images) && images.length > 0
                  ? images
                      .map((img) => {
                        if (!img || !img.timestamp || !img.imageUrl) {
                          return "";
                        }
                        return `
                        <div style="margin: 10px 0;">
                          <p style="margin: 5px 0;">촬영 시간: ${new Date(
                            img.timestamp
                          ).toLocaleString()}</p>
                          <img src="${
                            img.imageUrl
                          }" style="max-width: 100%; height: auto; margin: 5px 0;" alt="균열 이미지" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                          <p style="display: none; color: #ff0000;">이미지를 불러올 수 없습니다.</p>
                        </div>
                      `;
                      })
                      .join("")
                  : "<p>등록된 이미지가 없습니다.</p>";

              const imagesContainer = document.getElementById(
                `waypoint-images-${pickedObject.id.waypointData.id}`
              );
              if (imagesContainer) {
                imagesContainer.innerHTML = imagesHtml;
              }
            } catch (error) {
              console.error("이미지 로딩 실패:", error);
              const imagesContainer = document.getElementById(
                `waypoint-images-${pickedObject.id.waypointData.id}`
              );
              if (imagesContainer) {
                imagesContainer.innerHTML =
                  "<p>이미지를 불러오는데 실패했습니다.</p>";
              }
            }
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(async (click) => {
          const cartesian = viewer.camera.pickEllipsoid(
            click.position,
            viewer.scene.globe.ellipsoid
          );
          if (cartesian) {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const longitudeString = Cesium.Math.toDegrees(
              cartographic.longitude
            ).toFixed(5);
            const latitudeString = Cesium.Math.toDegrees(
              cartographic.latitude
            ).toFixed(5);

            const height = await viewer.scene.sampleHeight(cartographic);
            const altitudeString =
              height !== undefined
                ? height.toFixed(2)
                : "고도 정보를 불러올 수 없습니다.";

            const entity = viewer.entities.add({
              position: cartesian,
              description: `
                <table class="cesium-infoBox-defaultTable">
                  <tr><th>위도</th><td>${latitudeString}</td></tr>
                  <tr><th>경도</th><td>${longitudeString}</td></tr>
                  <tr><th>고도</th><td>${altitudeString}m</td></tr>
                </table>
              `,
            });
            viewer.selectedEntity = entity;
            setTimeout(() => {
              viewer.entities.remove(entity);
            }, 5000);
          }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(127.28257, 36.76457, 1500),
          orientation: {
            heading: Cesium.Math.toRadians(45.0),
            pitch: Cesium.Math.toRadians(-45.0),
            roll: Cesium.Math.toRadians(0.0),
          },
          duration: 0,
        });
      } catch (error) {
        console.error("Error initializing Cesium:", error);
      }
    };

    const generateXImage = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 20;
      canvas.height = 20;
      const ctx = canvas.getContext("2d");

      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(20, 20);
      ctx.moveTo(20, 0);
      ctx.lineTo(0, 20);
      ctx.stroke();

      return canvas;
    };

    initializeCesium();

    const resizeObserver = new ResizeObserver(() => {
      if (viewer && parentContainer.current) {
        const { width, height } =
          parentContainer.current.getBoundingClientRect();
        cesiumContainer.current.style.width = `${width}px`;
        cesiumContainer.current.style.height = `${height}px`;
        viewer.resize();
      }
    });

    if (parentContainer.current) {
      resizeObserver.observe(parentContainer.current);
    }

    return () => {
      if (viewer) {
        viewer.destroy();
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={parentContainer}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <div
        ref={cesiumContainer}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default CesiumMap;
