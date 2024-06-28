import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./RiskList_2nd.css";

const RiskList = () => {
  const [riskData, setRiskData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/danger");
        setRiskData(response.data);
      } catch (error) {
        console.error("Error fetching risk data :", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="risk-list-container">
      <div className="header-bar">
        <span>작품명</span>
        <span>구역명</span>
        <span>건수(건)</span>
      </div>
      <div className="risk-list">
        {riskData.map((data, index) => (
          <div key={index} className="risk-item">
            <span>{data.artwork}</span>
            <span>{data.area}</span>
            <span>{data.count}</span>
          </div>
        ))}
      </div>
        <div className="vertical-line left" />
        <div className="vertical-line right" />
    </div>
  );
};

export default RiskList;
