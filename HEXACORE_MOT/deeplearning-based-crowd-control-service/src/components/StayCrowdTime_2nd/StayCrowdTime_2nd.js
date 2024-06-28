import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StayCrowdTime_2nd.css";

const Table = ({ selectedDate, selectedExhibition }) => {
  const [crowdTimeData, setCrowdTimeData] = useState([]); // 초기 상태를 빈 배열로 설정
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  useEffect(() => {
    console.log("FetchData 호출");

    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userID");
        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }

        // const exhbId = "exhb1"; // 임시로 설정
        const exhbId = selectedExhibition;
        console.log(selectedExhibition, "crowded exhb 확인");
        const date = selectedDate;

        const response = await axios.get(`http://localhost:4000/bywork`, {
          params: { userId, exhbId, date },
          withCredentials: true,
        });

        if (response.status === 200) {
          const latestData = response.data.reduce((acc, curr) => {
            if (
              !acc[curr.zone_name] ||
              new Date(acc[curr.zone_name].time) < new Date(curr.time)
            ) {
              acc[curr.zone_name] = curr;
            }
            return acc;
          }, {});

          setCrowdTimeData(Object.values(latestData));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // 컴포넌트 마운트 시 초기 데이터 fetch

    // const intervalId = setInterval(fetchData, 10000); // 10초마다 데이터 fetch

    // return () => {
    //   clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
    // };
  }, [selectedDate, selectedExhibition]); // selectedDate가 변경될 때마다 새로운 인터벌 설정

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = sortColumn
    ? [...crowdTimeData].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : crowdTimeData;

  return (
    <table className="stay-crowd-table">
      <thead>
        <tr>
          <th>구역명</th>
          <th onClick={() => handleSort("population")}>인원</th>
          <th onClick={() => handleSort("staying_time")}>시간</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.length > 0 &&
          sortedData.map((data, index) => (
            <tr key={index} className="stay-item">
              <td className="tbdytxt">{data.zone_name.toUpperCase()}</td>
              <td className="tbdytxt">{data.population}명</td>
              <td className="tbdytxt">{Math.ceil(data.staying_time / 60)}분</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default Table;
