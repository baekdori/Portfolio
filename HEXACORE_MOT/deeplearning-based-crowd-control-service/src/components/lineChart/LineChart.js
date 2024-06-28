import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const LinePlot = ({
  data = [],
  width,
  height,
  color,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 50,
  marginLeft = 40,
  useAxis,
  useDp,
  useCurve,
}) => {
  const svgRef = useRef(null);

  useEffect(() => {

    if (!data || data.length === 0) {
      console.error("데이터는 필수 항목이며 비워둘 수 없습니다.");
      return;
    }

    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll("*").remove();

    const x = d3
      .scaleTime()
      .domain([new Date(2000, 0, 1, 9, 0), new Date(2000, 0, 1, 18, 0)])
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.today)])
      .nice()
      .range([height - marginBottom, marginTop]);

    const line = d3
      .line()
      .x((d) => x(new Date(2000, 0, 1, d.hour, 0)))
      .y((d) => y(d.value));

    if (useCurve) {
      line.curve(d3.curveCardinal);
    }

    if (useAxis) {
      // Add x-axis
      svgElement
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("fill", "#4b5563")
        .style("font-size", "12px");

      // Add y-axis
      svgElement
        .append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("fill", "#4b5563")
        .style("font-size", "12px");
    }

    // Add line
    svgElement
      .append("path")
      .datum(data.map((d) => ({ hour: d.hour, value: d.today })))
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line);

    if (useDp) {
      // Add data points
      svgElement
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(new Date(2000, 0, 1, d.hour, 0)))
        .attr("cy", (d) => y(d.today))
        .attr("r", 4)
        .attr("fill", "#3498DB")
        .attr("stroke", "#3498DB")
        .attr("stroke-width", 6)
        .on("mouseover", (event, d) => {
          const tooltip = d3.select("#tooltip");
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(
              `<div style="font-family: Pretendard; font-size: 16px; font-weight: regular;">현재 시간: ${d.hour}시<br>현재 인원: ${d.today}명</div>`
            )
            .style("left", `${event.pageX}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
          d3.select("#tooltip").transition().duration(500).style("opacity", 0);
        });
    }
  }, [
    data,
    height,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    width,
    color,
    useAxis,
    useDp,
    useCurve,
  ]);

  return (
    <>
      {/* 툴팁 요소 */}
      <div
    id="tooltip"
    style={{
      opacity: 0,
      position: "absolute",
      backgroundColor: "white",
      border: "1px solid black",
      padding: "10px",
      fontFamily: "Pretendard",
      fontSize: "14px",
      fontWeight: "regular",
      width: "140px",
      height: "60px",
      lineHeight: "1.5",
      overflow: "auto",
    }}
></div>

      {/* SVG 요소 */}
      <svg width={width} height={height} /*viewBox={`0 0 ${width} ${height}`}*/  ref={svgRef}></svg>
    </>
  );
};

export default LinePlot;