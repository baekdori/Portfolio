import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3"; // d3.js 라이브러리 임포트
import "./DangerPlaceBar_2nd.module.css"; // CSS 파일 임포트
import axios from "axios";

const BarGraph = ({ selectedDate, selectedExhibition }) => {
  const svgRef = useRef(null);
  let [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userID");
        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }
        const exhbId = selectedExhibition;
        const date = selectedDate;
        const response = await axios.get(`http://localhost:4000/crowded`, {
          params: { userId, exhbId, date }, // 쿼리스트링으로 userId 전달
          withCredentials: true,
        });
        if (response.status === 200 && response.data.length > 0) {
          setData(response.data);
          console.log(response.data);
        } else {
          console.log("DB에서 데이터를 가져오지 못했습니다. 랜덤 데이터로 대체합니다.");
          generateRandomData();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        generateRandomData();
      }
    };

    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate, selectedExhibition]);

  const generateRandomData = () => {
    const randomData = Array.from({ length: 5 }, (_, index) => ({
      zone_id: index + 1,
      zone_name: `Zone ${index + 1}`,
      total_population: Math.floor(Math.random() * 100) + 1,
    }));
    setData(randomData);
  };

  useEffect(() => {
    if (data.length > 0) {
      const margin = { top: 20, right: 150, bottom: 70, left: 80 };
      const width = 1500 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const maxPopulation = Math.max(...data.map((d) => d.total_population));
      const x = d3.scaleLinear().range([0, width]).domain([0, maxPopulation]);
      const y = d3.scaleBand().range([0, height]).padding(0.1);

      const svg = d3.select(svgRef.current);

      svg.selectAll("*").remove();
      const g = svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      y.domain(data.map((d) => d.zone_name.toUpperCase()));

      g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5))
        .attr("font-family", "Pretendard")
        .attr("font-size", "16px")
        .attr("font-weight", "regular");

      g.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom -35)
        .attr("text-anchor", "middle")
        .attr("font-family", "Pretendard")
        .attr("font-size", "16px")
        .attr("font-weight", "regular")
        .text("인원(명)");

      g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("font-family", "Pretendard")
        .attr("font-size", "16px")
        .attr("font-weight", "regular");

      g.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -margin.left + 40)
        .attr("y", margin.top + 10)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-family", "Pretendard")
        .attr("font-size", "1px")
        .attr("font-weight", "regular")
        .text("구역명");

      const bars = g
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", (d) => y(d.zone_name.toUpperCase()))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", 0)
        .style("fill", (d, i) => {
          const sortedData = data
            .slice()
            .sort((a, b) => b.total_population - a.total_population);
          const index = sortedData.findIndex(
            (item) => item.zone_name === d.zone_name
          );
          const colors = ["#EF476F", "#F2D89C", "#55D1B1", "#3A9BBB", "#073B4C"];
          return colors[index];
        });

      bars.transition().duration(1000).attr("width", (d) => x(d.total_population));

      const text = g
        .selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (d) => x(d.total_population) + 5)
        .attr("y", (d) => y(d.zone_name.toUpperCase()) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(0)
        .attr("font-family", "Pretendard")
        .attr("font-size", "18px")
        .attr("font-weight", "bold");
      text
        .transition()
        .duration(1000)
        .tween("text", function (d) {
          const i = d3.interpolateRound(0, d.total_population);
          return function (t) {
            this.textContent = i(t);
          };
        });
    }
  }, [data]);

  return (
    <div className="bar-graph-container">
      <svg ref={svgRef} className="bar-graph$"></svg>
    </div>
  );
};

export default BarGraph;
