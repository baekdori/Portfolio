import React, { useEffect, useRef } from "react"; // React의 useEffect, useRef 훅을 불러옴
import * as d3 from "d3"; // d3.js 라이브러리 전체를 불러옴
import styles from "./DougnutChart.module.css"; // CSS 모듈을 불러옴

// DoughnutChart 컴포넌트 정의, doughnutdata, exhibition, yesterday, week, month 데이터를 props로 받음
const DoughnutChart = ({ doughnutdata, exhibition, yesterday, week, month }) => {
  const svgRef = useRef(); // svg 엘리먼트를 참조하기 위한 useRef 훅 사용
  const containerRef = useRef(); // 컨테이너 요소를 참조하기 위한 useRef 훅 사용

  // 값에 따라 색상을 반환하는 함수, 퍼센트에 따라 4가지 색상 중 하나를 반환
  const getColor = (value) => {
    if (value <= 25) return "#10A400"; // 25% 이하일 때 녹색
    if (value <= 50) return "#FFC300"; // 50% 이하일 때 노란색
    if (value <= 75) return "#FF6B00"; // 75% 이하일 때 주황색
    return "#FF0000"; // 그 이상은 빨간색
  };

  // 값이 NaN이면 0을 반환하고, 그렇지 않으면 해당 값을 그대로 반환하는 함수
  const handleNaN = (value) => {
    return isNaN(value) ? 0 : value; // NaN일 경우 0, 아니면 해당 값을 반환
  };

  // 차트를 그리는 함수
  const drawChart = () => {
    const containerWidth = containerRef.current.offsetWidth; // 부모 컨테이너의 너비를 가져옴
    const width = containerWidth; // 부모 너비를 차트 너비로 설정
    const height = containerWidth; // 차트의 높이를 너비와 동일하게 설정
    const thickness = 50;
    const radius = Math.min(width, height) / 2;

    const percent = isNaN(parseInt(doughnutdata)) ? 0 : parseInt(doughnutdata);
    const color = getColor(percent);

    // 기존에 그려진 차트 삭제
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const arc = d3
      .arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius);

    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);

    const data = [
      { label: "Current", value: percent },
      { label: "Remaining", value: 100 - percent },
    ];

    svg
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => (i === 0 ? color : "#e6e6e6"))
      .transition()
      .duration(2000)
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(i(t));
        };
      });

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "30px")
      .text(`${percent}%`);

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "2.5em")
      .attr("font-size", "20px")
      .text(exhibition);
  };

  // 컴포넌트가 마운트될 때 차트를 그리고, 브라우저 창 크기가 변경될 때 차트를 다시 그리도록 설정
  useEffect(() => {
    drawChart();

    const handleResize = () => {
      drawChart(); // 화면 크기 변경 시 차트를 다시 그림
    };

    window.addEventListener("resize", handleResize); // resize 이벤트 리스너 추가
    return () => {
      window.removeEventListener("resize", handleResize); // 이벤트 리스너 정리
    };
  }, [doughnutdata, exhibition]);

  return (
    <div ref={containerRef} className={styles.chartContainer}>
      <svg ref={svgRef}></svg>
      <div className={styles.doughnutBottom}>
        <p>
          어제 동시간대 인원 <b>{handleNaN(yesterday)}명</b>
        </p>
        <p>
          1주일 동시간대 평균 <b>{handleNaN(week)}명</b>
        </p>
        <p>
          1개월 동시간대 평균 <b>{handleNaN(month)}명</b>
        </p>
      </div>
    </div>
  );
};

export default DoughnutChart;
