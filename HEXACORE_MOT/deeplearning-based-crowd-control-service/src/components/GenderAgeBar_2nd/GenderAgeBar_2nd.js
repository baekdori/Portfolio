import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./GenderAgeBar_2nd.module.css";
import { FiAlignCenter } from "react-icons/fi";

const GenderAgeBar = ({ data, onData, totalSum }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", 600) // 너비 조정
      .attr("height", 400); // 높이 조정

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = svg.attr("width") - margin.left - margin.right;
    const height = svg.attr("height") - margin.top - margin.bottom;

    svg.selectAll("*").remove(); // 이전 그래프 제거

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.age))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([height, 0]);

    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll("text")
      .attr("transform", "translate(0,10)")
      .attr("font-family", "Pretendard")
      .attr("font-size", "2rem")
      .style("text-anchor", "middle");

    g.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.age))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d, i) => d3.schemeCategory10[i % 10]);

    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.age) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .attr("font-family", "Pretendard")
      .attr("font-size", "2rem")
      .text((d) => Math.ceil((d.value / totalSum) * 100) + "%");

    onData(data.reduce((acc, cur) => acc + cur.value, 0));
  }, [data, onData]);

  return (
    <svg
      className={{ alignItems: "center", justifyContent: "center" }}
      ref={svgRef}
    ></svg>
  );
};

export default GenderAgeBar;
