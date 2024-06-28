import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import styles from "./ThirdPage.module.css";
import LineGraph_2nd from "../../components/LineGraph_2nd/LineGraph_2nd";
import DangerPlaceBar_2nd from "../../components/DangerPlaceBar_2nd/DangerPlaceBar_2nd.js";
import RiskList_2nd from "../../components/RiskList_2nd/RiskList_2nd";
import StayCrowdTime_2nd from "../../components/StayCrowdTime_2nd/StayCrowdTime_2nd.js";
import GenderAgePieChart_2nd from "../../components/GenderAgePieChart_2nd/GenderAgePieChart_2nd";
import GenderAgeBar_2nd from "../../components/GenderAgeBar_2nd/GenderAgeBar_2nd";
import Header from "../../components/Header/Header.js";
import DatePick from "../../components/DatePick/DatePick.js";
import axios from "axios";

const ThirdPage = () => {
  const [selectedData, setSelectedData] = useState([]);
  const [selectedExhibition, setSelectedExhibition] = useState("exhb1");
  const [visibilityState, setVisibilityState] = useState(false);
  const pageRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dataFromBar, setDataFromBar] = useState(0);

  const handleDropdownClose = () => {
    setVisibilityState(false);
  };

  const handlePageClick = (e) => {
    if (pageRef.current && !pageRef.current.contains(e.target)) {
      setVisibilityState(false);
    }
  };

  const handleDataFromBar = (data) => {
    setDataFromBar(data);
  };

  const handleDropdownItemClick = (event) => {
    const exhibitionName = event.target.value;

    let exhbId = "";
    switch (exhibitionName) {
      case "제1전시관":
        exhbId = "exhb1";
        break;
      case "제2전시관":
        exhbId = "exhb2";
        break;
      case "제3전시관":
        exhbId = "exhb3";
        break;
      case "제4전시관":
        exhbId = "exhb4";
        break;
      default:
        exhbId = "";
    }
    setSelectedExhibition(exhbId);
  };

  return (
    <>
      <Sidebar />
      <div className={styles.content} ref={pageRef} onClick={handlePageClick}>
        <div className={styles.header}>
          <div id={styles.title}>
            <h2 className="thirdTitle">분석 정보</h2>
            <div className={styles.exhibitionSelect}>
              <select
                onChange={handleDropdownItemClick}
                style={{ padding: "8px", border: "none", fontSize: "2rem" }}
              >
                <option value="제1전시관">제1전시관</option>
                <option value="제2전시관">제2전시관</option>
                <option value="제3전시관">제3전시관</option>
                <option value="제4전시관">제4전시관</option>
              </select>
              <DatePick
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>
          </div>
        </div>
        <div className={`${styles.graphContainer} ${styles.row1}`}>
          <Header>평균 관람객 추이</Header>
          <LineGraph_2nd
            selectedDate={selectedDate}
            selectedExhibition={selectedExhibition}
          />
        </div>
        <div className={`${styles.graphContainer} ${styles.row2}`}>
          <Header>혼잡도 상위 구역 5곳</Header>
          <DangerPlaceBar_2nd
            selectedDate={selectedDate}
            selectedExhibition={selectedExhibition}
          />
          <div className={styles.hcenterdanger}></div>
        </div>
        <div className={`${styles.graphContainer} ${styles.row3}`}>
          <Header>구역별 체류 인원/평균 체류 시간 목록</Header>
          <StayCrowdTime_2nd
            selectedDate={selectedDate}
            selectedExhibition={selectedExhibition}
          />
          <div className={styles.hcenter}></div>
        </div>
        <div className={`${styles.graphContainer} ${styles.row4}`}></div>
        <div className={`${styles.graphContainer} ${styles.row5}`}>
          <Header>관람객 남녀, 연령대 통계</Header>
          <div className={styles.left}>
            <GenderAgePieChart_2nd
              totalSum={dataFromBar}
              setSelectedData={setSelectedData}
              selectedDate={selectedDate}
              selectedExhibition={selectedExhibition}
              selectedGenderData={selectedData}
            />
          </div>
          <div className={styles.right}>
            <div className={styles.shiftDown}>
              <div className={styles.txt}>
                {dataFromBar}명
                <GenderAgeBar_2nd
                  totalSum={dataFromBar}
                  data={selectedData}
                  className={styles.genderbar}
                  onData={handleDataFromBar}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThirdPage;
