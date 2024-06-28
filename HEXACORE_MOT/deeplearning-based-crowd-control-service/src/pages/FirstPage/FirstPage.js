import React, { useState, useEffect } from "react";

import styles from "./FirstPage.module.css";

import { ToastContainer, toast } from "react-toastify";
import WeeklyVisitorTrend from "../../components/WeeklyVisitorTrend/WeeklyVisitorTrend.js";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart.js";
import LinePlot from "../../components/LineChart/LineChart.js";
import Header from "../../components/Header/Header.js";
import axios from "axios";

const FirstPage = () => {
  const [d1Data, setD1Data] = useState([]);
  const [d2Data, setD2Data] = useState([]);
  const [d3Data, setD3Data] = useState([]);
  const [d4Data, setD4Data] = useState([]);
  const [dBottomData, setDBottomData] = useState(
    Array(4).fill({ y: 0, w: 0, m: 0 })
  );
  const [blineDataf, setBLineData] = useState([]);
  const [weekavg, setWeekAvg] = useState([]);


  const fetchData = async () => {
    // 세션에서 아이디 가져오기
    let userId;
    try {
      userId = sessionStorage.getItem("userID");
      console.log("fpUserId", userId);
      if (!userId) {
        console.error("세션에서 userID를 가져올 수 없습니다.");
        return;
      }
    } catch (error) {
      console.error("Error fetching userID from session:", error);
      return;
    }

    try {
      // 도넛차트데이터 요청
      const response = await axios.get(`http://localhost:4000/donutchart`, {
        params: { userId }, // userId 전달
        withCredentials: true,
      });

      // 도넛차트데이터 set
      if (response.status === 200) {
        console.log("도넛데이터", response.data);
        setD1Data(response.data[0].total_population);
        setD2Data(response.data[1].total_population);
        setD3Data(response.data[2].total_population);
        setD4Data(response.data[3].total_population);
      }
    } catch (error) {
      console.error("Error fetching donutchart data:", error);
    }

    try {
      // 도넛아래데이터 요청
      const sameResponse = await axios.get(`http://localhost:4000/sametime`, {
        params: { userId }, // 쿼리스트링으로 userId 전달
        withCredentials: true,
      });

      // 도넛아래데이터 set
      if (sameResponse.status === 200) {
        console.log("도넛아래데이터", sameResponse.data);
        const dBottomData = sameResponse.data.map((item) => ({
          y:  item?.yesterday_avg_population ? parseInt(item.yesterday_avg_population) : 0,
          w: item?.last_week_avg_population ? parseInt(item.last_week_avg_population) : 0,
          m: item?.last_month_avg_population ? parseInt(item.last_month_avg_population) : 0,
        }));

        console.log("dBottomDObject", dBottomData);

        setDBottomData(dBottomData);
      }
    } catch (error) {
      console.error("Error fetching sametime data:", error);
    }

    try {
      // 시간별인원(큰 라인그래프) 데이터 요청
      const btResponse = await axios.get(`http://localhost:4000/bytime`, {
        params: { userId }, // 쿼리스트링으로 userId 전달
        withCredentials: true,
      });

      // 시간별인원(큰 라인그래프) 데이터 set
      if (btResponse.status === 200) {
        console.log("시간별인원데이터", btResponse.data);
        const blineDatat = btResponse.data.map((item, index) => ({
          hour: 9 + index,
          today: parseInt(item.total_population) || 0,
        }));
        setBLineData(blineDatat.length
          ? blineDatat
          : Array.from({ length: 10 }, (_, i) => ({
              hour: 9 + i,
              today: 0,
            })));
      }
    } catch (error) {
      console.error("Error fetching bytime data:", error);
    }

    try {
      // 주평균 데이터 요청
      const weekResponse = await axios.get(`http://localhost:4000/weekavg`, {
        params: { userId }, // 쿼리스트링으로 userId 전달
        withCredentials: true,
      });

      // 주평균 데이터 set
      if (weekResponse.status === 200) {
        console.log("주간평균데이터", weekResponse.data);
        const weekAvgData = weekResponse.data.map((item) => ({
          last_month: parseInt(item.last_month_avg_population) || 0,
          last_week: parseInt(item.last_week_avg_population) || 0,
          this_week: parseInt(item.this_week_avg_population) || 0,
        }));
        const weekAvgDataObj = weekAvgData[0];

        console.log("주평균 객체", weekAvgDataObj);
        setWeekAvg(weekAvgDataObj);
      }
    } catch (error) {
      console.error("Error fetching weekavg data:", error);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
  }, []);
  

  useEffect(() => {
    if (d1Data > 50) {
      toast.error("밀집도를 확인하세요", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }, [d1Data]);

  return (
    <>
      <div className={styles.content}>
        <div id={styles.title}>
          <h2>요약 정보</h2>
        </div>
        <div>
          <div className={styles.Raw}>
            <div className={styles.gridcontent}>
              <Header style={{ width: "100%", paddingRight: "10%" }}>
                {" "}
                실시간 밀집도
              </Header>
              <div className={styles.griditem}>
                <DoughnutChart
                  doughnutdata={d1Data}
                  exhibition="제1전시관"
                  yesterday={dBottomData[0]?.y ?? 0}
                  week={dBottomData[0]?.w ?? 0}
                  month={dBottomData[0]?.m ?? 0}
                />
              </div>
              <div className={styles.griditem}>
                <DoughnutChart
                  doughnutdata={d2Data}
                  exhibition="제2전시관"
                  yesterday={dBottomData[1]?.y ?? 0}
                  week={dBottomData[1]?.w ?? 0}
                  month={dBottomData[1]?.m ?? 0}
                />
              </div>
              <div className={styles.griditem}>
                <DoughnutChart
                  doughnutdata={d3Data}
                  exhibition="제3전시관"
                  yesterday={dBottomData[2]?.y ?? 0}
                  week={dBottomData[2]?.w ?? 0}
                  month={dBottomData[2]?.m ?? 0}
                />
              </div>
              <div className={styles.griditem}>
                <DoughnutChart
                  doughnutdata={d4Data}
                  exhibition="제4전시관"
                  yesterday={dBottomData[3]?.y ?? 0}
                  week={dBottomData[3]?.w ?? 0}
                  month={dBottomData[3]?.m ?? 0}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.RawParent}>
          <div className={styles.Raw}>
            <div className={styles.half1}>
              <Header style={{ width: "100%" }}>일주일 추이</Header>
              <div className={styles.WeekOrNowCol}>
                <WeeklyVisitorTrend
                  width={230}
                  height={120}
                  color1="#10A400"
                  color2="#FF0000"
                  useAxis={false}
                  useDp={false}
                  useCurve={true}
                  weekavg={weekavg}
                />
              </div>
            </div>
            <div className={styles.half2}>
              <Header
                style={{
                  /*width: "calc(100% + 20px)",*/ width: "100%",
                  paddingRight: "10%",
                }}
              >
                일일 추이
              </Header >
              
              <LinePlot
                data={blineDataf}
                width={670}
                height={350}
                color="#3498DB"
                useAxis={true}
                useDp={true}
                useCurve={false}
              />
              
            </div>
          </div>
        </div>

        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </>
  );
};

export default FirstPage;
