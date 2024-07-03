import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./GenderAgeBar_2nd.module.css";

const GenderAgeBar = ({ data, onData, totalSum }) => {
  const svgRef = useRef(null);
  const [isChartVisible, setIsChartVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const chartTop = svgRef.current.getBoundingClientRect().top;
      const isTopVisible = chartTop < window.innerHeight;

      if (isTopVisible && !isChartVisible) {
        setIsChartVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isChartVisible]);

  useEffect(() => {
    if (isChartVisible) {
      const svg = d3.select(svgRef.current).attr("width", 1000).attr("height", 340);

      const margin = { top: 30, right: 0, bottom: 30, left: 0 };
      const width = svg.attr("width") - margin.left - margin.right;
      const height = svg.attr("height") - margin.top - margin.bottom;

      svg.selectAll("*").remove();

      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand().domain(data.map((d) => d.age)).range([0, width]).padding(0.1);

      const y = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value)]).nice().range([height, 0]);

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

      const bars = g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.age))
        .attr("y", height) // Start from the bottom
        .attr("width", x.bandwidth())
        .attr("height", 0) // Initial height of 0 for animation effect
        .attr("fill", (d, i) => d3.schemeCategory10[i % 10]);

      bars.transition()
        .duration(3000) // Animation duration for bar height
        .attr("y", (d) => y(d.value)) // Move to correct y position
        .attr("height", (d) => height - y(d.value)); // Final height

      g.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (d) => x(d.age) + x.bandwidth() / 2)
        .attr("y", height) // Start from the bottom
        .attr("text-anchor", "middle")
        .attr("font-family", "Pretendard")
        .attr("font-size", "2rem")
        .transition()
        .duration(3000) // Animation duration for text transition (same as bars)
        .tween("text", function(d) {
          const i = d3.interpolateRound(0, d.value);
          return function(t) {
            this.textContent = i(t) + "%";
          };
        })
        .attr("y", (d) => y(d.value) - 10); // Final position above each bar

      onData(data.reduce((acc, cur) => acc + cur.value, 0));
    }
  }, [data, onData, isChartVisible, totalSum]);

  return <svg className={{ alignItems: "center", justifyContent: "center" }} ref={svgRef}></svg>;
};

export default GenderAgeBar;
