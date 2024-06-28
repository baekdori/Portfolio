import React, { useEffect, useState, useRef } from "react";
import h337 from "heatmap.js";
import "./HeatMap.css";
import axios from "axios";

const HeatMap = () => {
  const heatmapRef = useRef(null);
  const [exhibitionList, setExhibitionList] = useState([]);
  const [selectedExhibition, setSelectedExhibition] = useState({
    id: "exhb1",
    name: "제1전시관",
  });
  const [maxCapacity, setMaxCapacity] = useState(1000);
  const [currentCapacity, setCurrentCapacity] = useState(0);
  const [heatmapInstance, setHeatmapInstance] = useState(null);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userID");
        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }
        const response = await axios.get(`http://localhost:4000/getexhb`, {
          params: { userId },
          withCredentials: true,
        });
        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length === 0) {
      return;
    }

    const exhb1 = data[0]["exhb_id"];
    const exhb2 = data[1]["exhb_id"];
    const exhb3 = data[2]["exhb_id"];
    const exhb4 = data[3]["exhb_id"];

    const exhibitionList = [
      { id: exhb1, name: "제1전시관" },
      { id: exhb2, name: "제2전시관" },
      { id: exhb3, name: "제3전시관" },
      { id: exhb4, name: "제4전시관" },
    ];
    setExhibitionList(exhibitionList);
    setSelectedExhibition(exhibitionList[0]);
  }, [data]);




  const initializeHeatmap = () => {
    const instance = h337.create({
      container: heatmapRef.current,
      radius: 20,
      maxOpacity: 0.8,
      minOpacity: 0.1,
      blur: 0.75,
    });
    setHeatmapInstance(instance);
    return instance;
  };

  const clearHeatmap = () => {
    if (heatmapInstance) {
      heatmapInstance.setData({ max: 0, data: [] });
    }
  };

  const renderHeatmap = (data) => {
    clearHeatmap();
    heatmapInstance.repaint();
    const max = data.reduce((prev, curr) => Math.max(prev, curr.value), 0);
    const heatmapData = { max, data };
    heatmapInstance.setData(heatmapData);
  };

  useEffect(() => {
    if (!selectedExhibition) return;

    const fetchData = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const exhbId = selectedExhibition.id;
        const userId = sessionStorage.getItem("userID");
        const response = await axios.get(`http://localhost:4000/heatmap`, {
          params: {
            userId,
            exhbId,
            // time: `${today}`,
          },
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log("response.data", response.data); // response.data를 콘솔에 출력하여 확인
          console.log("selectedExhibition.id", selectedExhibition.id);
          const filteredData = response.data.filter(
            (item) => item.exhb_id === selectedExhibition.id
          );
          console.log("filteredData", filteredData); // filteredData를 콘솔에 출력하여 확인
          const formattedData = filteredData.map((item) => ({
            x: item.x,
            y: item.y,
            value: 1,
          }));
          console.log("formattedData", formattedData); // formattedData를 콘솔에 출력하여 확인

          renderHeatmap(formattedData);
        }
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
      }
    };

      if (!heatmapInstance) {
        initializeHeatmap();
      }

      fetchData();

      const interval = setInterval(fetchData, 30000);

      return () => clearInterval(interval);
    }, [selectedExhibition, heatmapInstance]);

  useEffect(() => {
    if (data2.length === 0) {
      return;
    }


  }, [data2]);

  useEffect(() => {
    return () => {
      if (heatmapInstance && typeof heatmapInstance.destroy === "function") {
        heatmapInstance.destroy();
        setHeatmapInstance(null);
      }
    };
  }, [heatmapInstance]);

  const handleExhibitionChange = (event) => {
    const selectedExhibitionId = event.target.value;
    const selectedExhibition = exhibitionList.find(
      (exhibition) => exhibition.id === selectedExhibitionId
    );
    setSelectedExhibition(selectedExhibition);
  };

  return (
    <div className="heatmap-container">
      <div className="selectExhibition">
      <select id="selectEx" onChange={handleExhibitionChange}>
        {exhibitionList.map((exhibition) => (
          <option key={exhibition.id} value={exhibition.id}>
            {exhibition.name}
          </option>
        ))}
      </select>
      </div>

      {selectedExhibition && (
        <div>
          <p
            style={{
              fontFamily: "Pretendard",
              fontWeight: "regular",
              fontSize: "2rem",
              color: "white",
              margin: "2rem",
            }}
          >
            최대 입장객 수: <b>{maxCapacity}명</b> / 현재 입장객 수:{" "}
            <b>{currentCapacity}명</b>
          </p>
        </div>
      )}
      <div className="heatmapcon">
        <div
          ref={heatmapRef}
          style={{
            backgroundImage: "url(/canvas.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1200px 700px",
            width: "1200px",
            height: "700px",
          }}
        ></div>
      </div>
    </div>
  );
}

export default HeatMap;
