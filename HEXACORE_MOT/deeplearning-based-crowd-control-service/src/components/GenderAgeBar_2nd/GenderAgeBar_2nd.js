import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./GenderAgeBar_2nd.module.css";

const GenderAgeBar = ({ data, onData, totalSum }) => {
  const svgRef = useRef(null); // SVG 요소 참조를 위한 useRef 사용
  const [isChartVisible, setIsChartVisible] = useState(false); // 차트 가시성을 관리하는 state

  useEffect(() => {
    // 스크롤 이벤트 핸들러 등록
    const handleScroll = () => {
      const chartTop = svgRef.current.getBoundingClientRect().top; // 차트의 상단 위치
      const isTopVisible = chartTop < window.innerHeight; // 차트가 화면에 보이는지 확인

      if (isTopVisible && !isChartVisible) {
        setIsChartVisible(true); // 차트가 보이면 state 업데이트
      }
    };

    window.addEventListener("scroll", handleScroll); // 스크롤 이벤트 리스너 추가

    return () => {
      window.removeEventListener("scroll", handleScroll); // 컴포넌트 언마운트 시 이벤트 리스너 제거
    };
  }, [isChartVisible]);

  useEffect(() => {
    if (isChartVisible) {
      // 차트가 보일 때만 실행

      const total = data.reduce((acc, cur) => acc + cur.value, 0); // 값의 총합 계산

      // 각 데이터 값을 100%로 조정
      const adjustedData = data.map((d) => ({
        ...d,
        value: (d.value / total) * 100,
      }));

      const svg = d3.select(svgRef.current).attr("width", 1000).attr("height", 340); // SVG 선택 및 크기 설정

      const margin = { top: 30, right: 0, bottom: 30, left: 0 }; // 마진 설정
      const width = svg.attr("width") - margin.left - margin.right; // 너비 계산
      const height = svg.attr("height") - margin.top - margin.bottom; // 높이 계산

      svg.selectAll("*").remove(); // 기존의 모든 요소 제거

      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`); // 그룹 요소 추가 및 변환

      const x = d3.scaleBand().domain(adjustedData.map((d) => d.age)).range([0, width]).padding(0.1); // X축 스케일 설정

      const y = d3.scaleLinear().domain([0, d3.max(adjustedData, (d) => d.value)]).nice().range([height, 0]); // Y축 스케일 설정

      g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0)) // X축 생성
        .selectAll("text")
        .attr("transform", "translate(0,10)")
        .attr("font-family", "Pretendard")
        .attr("font-size", "2rem")
        .style("text-anchor", "middle");

      g.append("g").attr("class", "y-axis").call(d3.axisLeft(y)); // Y축 생성

      const maxValue = d3.max(adjustedData, (d) => d.value); // 최대 값 찾기

      const colors = ["#55D1B1", "#3A9BBB", "#073B4C"]; // 색상 배열

      const bars = g.selectAll(".bar")
        .data(adjustedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.age))
        .attr("y", height) // 처음에 막대가 바닥에서 시작하도록 설정
        .attr("width", x.bandwidth())
        .attr("height", 0) // 애니메이션 효과를 위해 초기 높이를 0으로 설정
        .attr("fill", (d) => (d.value === maxValue ? "#EF476F" : colors[adjustedData.indexOf(d) % colors.length])); // 색상 설정

      bars.transition()
        .duration(2000) // 막대 높이에 대한 애니메이션 지속 시간
        .attr("y", (d) => y(d.value)) // 올바른 y 위치로 이동
        .attr("height", (d) => height - y(d.value)); // 최종 높이 설정

      g.selectAll(".label")
        .data(adjustedData)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (d) => x(d.age) + x.bandwidth() / 2)
        .attr("y", height) // 처음에 텍스트가 바닥에서 시작하도록 설정
        .attr("text-anchor", "middle")
        .attr("font-family", "Pretendard")
        .attr("font-size", "2rem")
        .transition()
        .duration(2000) // 텍스트 전환에 대한 애니메이션 지속 시간 (막대와 동일)
        .tween("text", function (d) {
          const i = d3.interpolateRound(0, d.value);
          return function (t) {
            this.textContent = i(t) + "%";
          };
        })
        .attr("y", (d) => y(d.value) - 10); // 각 막대 위에 최종 위치 설정

      onData(total); // 원래 값의 총합을 전달
    }
  }, [data, onData, isChartVisible, totalSum]);

  return <svg className={{ alignItems: "center", justifyContent: "center" }} ref={svgRef}></svg>; // SVG 요소 반환
};

export default GenderAgeBar;