import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./WeeklyVisitorTrend.module.css";
import SmallLinePlot from "../SmallLineChart/SmallLineChart";

const WeeklyVisitorTrend = ({
  width,
  height,
  color1,
  color2,
  useAxis,
  useDp,
  useCurve,
  weekavg,
}) => {
  console.log("주평균 전달데이터", weekavg)

  const getDefaultData = (daysAgoStart) => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => ({
      day: new Date(today.getFullYear(), today.getMonth(), today.getDate() - (daysAgoStart - i)),
      avg_population: 0,
    }));
  };

  const defaultParsedData1 = getDefaultData(6);
  const defaultParsedData2 = getDefaultData(13);


  const [parsedData1, setParseData1] = useState(defaultParsedData1);
  const [parsedData2, setParseData2] = useState(defaultParsedData2);
  const [icon1, setIcon1] = useState([null]);
  const [icon2, setIcon2] = useState([null]);
  const [twvisitor, setTwvisitor] = useState(weekavg.this_week);
  const [lwvisitor, setLwvisitor] = useState(weekavg.last_week);
  const [llwvisitor, setLlwvisitor] = useState(weekavg.last_month);

  console.log("icon1", icon1)

  // icon선언
  const upIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#EC5454"
      class="bi bi-triangle-fill"
      viewBox="0 0 16 16"
      style={{ marginLeft: "2rem" }}
    >
      <path
        fill-rule="evenodd"
        d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z"
      />
    </svg>
  );

  const downIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#3498DB"
      class="bi bi-triangle-fill"
      viewBox="0 0 16 16"
      style={{ marginLeft: "2rem", transform: "rotate(60deg)" }}
    >
      <path
        fill-rule="evenodd"
        d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z"
      />
    </svg>
  );

  let dashIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      fill="#5F9F41"
      class="bi bi-dash"
      viewBox="0 0 16 16"
      style={{ marginLeft: "2rem" }}
    >
      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
    </svg>
  );

  useEffect(() => {

    const setWeekAvg = () => {
      setTwvisitor(weekavg.this_week);
      setLwvisitor(weekavg.last_week);
      setLlwvisitor(weekavg.last_month);

    };

    setWeekAvg();


  }, [weekavg]);




  // 값에 따라 icon 설정
  useEffect(() => {

    const setIcon = () => {
      if (twvisitor > lwvisitor) {
        setIcon1(upIcon);
      } else if (twvisitor < lwvisitor) {
        setIcon1(downIcon);
      } else {
        setIcon1(dashIcon);
      }

      if (lwvisitor > llwvisitor) {
        setIcon2(upIcon);
      } else if (lwvisitor < llwvisitor) {
        setIcon2(downIcon);
      } else {
        setIcon2(dashIcon);
      }

    };
    setIcon();


  }, [twvisitor, lwvisitor, llwvisitor]);



  console.log("twvisitor", twvisitor, typeof (twvisitor));
  console.log("lwvisitor", lwvisitor, typeof (lwvisitor));





  const fetchData = async () => {
    try {
      const userId = sessionStorage.getItem("userID");

      if (!userId) {
        console.error("세션에서 userID를 가져올 수 없습니다.");
        return;
      }
      //이번주 일주일간 방문인원 데이터 요청
      const response = await axios.get(`http://localhost:4000/thisweek`, {
        params: { userId }, // 쿼리스트링으로 userId 전달
        withCredentials: true,
      });

      console.log("이번주 추이", response.data);

      //저번주 일주일간 방문인원 데이터 요청
      const response2 = await axios.get(`http://localhost:4000/lastweek`, {
        params: { userId }, // 쿼리스트링으로 userId 전달
        withCredentials: true,
      });

      console.log("저번주 추이", response2.data);
      
        

      // 이번주 일주일간 날짜와 방문인원 설정
      let parsedData1 = response.data.map(d => ({
        day: new Date(d.day),
        avg_population: +d.avg_population
      }));
             

      // 저번주 일주일간 날짜와 방문인원 설정
      let parsedData2 = response2.data.map(d => ({
        day: new Date(d.day),
        avg_population: +d.avg_population
      }));
        

      // 데이터가 비어있으면 기본값 설정
      if (parsedData1.length === 0) {
        parsedData1 = defaultParsedData1;
      }
      if (parsedData2.length === 0) {
        parsedData2 = defaultParsedData2;
      }

      setParseData1(parsedData1);
      setParseData2(parsedData2);


    } catch (error) {
      console.error("Error fetching data:", error);
      setParseData1(parsedData1);
      setParseData2(parsedData2);
    }

  };

  useEffect(() => {

    fetchData();

    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);

  }, []);






  return (
    <div className={styles.VisitorTrend}>
      <table className={styles.visitor}>
        <tr>
          <td className={styles.td}>
            <SmallLinePlot
              data={parsedData1}
              width={width}
              height={height}
              color={color1}
              useAxis={useAxis}
              useDp={useDp}
              useCurve={useCurve}
              legendText="이번주 추이"
            />
          </td>
          <td className={styles.td}>
            <div className={styles.infoCol}>
              <div className={styles.numOrGuideRaw}>
                <div className={styles.numCol}>
                  <p className={styles.num}>{twvisitor}</p>

                  <div className={styles.arrawCol}>{icon1}</div>
                </div>
              </div>
              <div className={styles.numOrGuideRaw}>
                <div className={styles.guide}>
                  <p className={styles.rguide}>이번주 방문자</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <div className={styles.borderLine} />
        <tr>
          <td className={styles.td}>
            <SmallLinePlot
              data={parsedData2}
              width={width}
              height={height}
              color={color2}
              useAxis={useAxis}
              useDp={useDp}
              useCurve={useCurve}
              legendText="저번주 추이"
            />
          </td>
          <td className={styles.td}>
            <div className={styles.infoCol}>
              <div className={styles.numOrGuideRaw}>
                <div className={styles.numCol}>
                  <p className={styles.num}>{lwvisitor}</p>
                </div>
                <div className={styles.arrawCol}>{icon2}</div>
              </div>
              <div className={styles.numOrGuideRaw}>
                <div className={styles.guide}>
                  <p className={styles.rguide}>지난주 방문자</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default WeeklyVisitorTrend;
