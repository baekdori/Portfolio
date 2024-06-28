import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './DangerPlaceBar_2nd.module.css';

const BarGraph = () => {
  const svgRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [
          { areaName: '구역 A', dangerCount: Math.floor(Math.random() * 30) },
          { areaName: '구역 B', dangerCount: Math.floor(Math.random() * 30) },
          { areaName: '구역 C', dangerCount: Math.floor(Math.random() * 30) },
          { areaName: '구역 D', dangerCount: Math.floor(Math.random() * 30) },
          { areaName: '구역 E', dangerCount: Math.floor(Math.random() * 30) },
        ];

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 1650 - margin.left - margin.right;
        const height = 330 - margin.top - margin.bottom;

        const x = d3.scaleLinear().range([0, width]).domain([0, 35]);
        const y = d3.scaleBand().range([0, height]).padding(0.1);

        const svg = d3
          .select(svgRef.current)
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

        y.domain(data.map(d => d.areaName));

        svg
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(x).ticks(5))
          .attr('font-family', 'Pretendard')
          .attr('font-size', '16px')
          .attr('font-weight', 'regular');

        svg
          .append('g')
          .attr('class', 'y-axis')
          .call(d3.axisLeft(y))
          .selectAll('text')
          .attr('font-family', 'Pretendard')
          .attr('font-size', '16px')
          .attr('font-weight', 'regular');

        // 막대 그래프 애니메이션
        const bars = svg
          .selectAll('.bar')
          .data(data)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('y', d => y(d.areaName))
          .attr('height', y.bandwidth())
          .attr('x', 0)
          .attr('width', 0) // 초기 너비 0으로 설정
          .style('fill', (d, i) => {
            const colors = ['#073B4C', '#118AB2', '#06D6A0', '#FFD166', '#EF476F'];
            return colors[i];
          });

        // 막대 그래프 애니메이션
        bars
          .transition()
          .duration(1000) // 애니메이션 지속 시간 1초
          .attr('width', d => x(d.dangerCount)); // 막대 너비 증가 애니메이션

        // 숫자 애니메이션
        const text = svg
          .selectAll('.label')
          .data(data)
          .enter()
          .append('text')
          .attr('class', 'label')
          .attr('x', d => x(d.dangerCount) + 5) // 막대 오른쪽에 숫자 위치
          .attr('y', d => y(d.areaName) + y.bandwidth() / 2) // 막대 가운데에 숫자 위치
          .attr('dy', '0.35em') // 텍스트 수직 정렬
          .text(0)
          .attr('font-family', 'Pretendard')
          .attr('font-size', '20px')
          .attr('font-weight', 'bold')
          ; // 초기 숫자 0으로 설정

        text
          .transition()
          .duration(1000) // 애니메이션 지속 시간 1초
          .tween('text', function(d) {
            const i = d3.interpolateRound(0, d.dangerCount); // 숫자 보간 함수
            return function(t) {
              this.textContent = i(t); // 숫자 업데이트
            };
          });


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bar-graph-container">
      <svg ref={svgRef} className="bar-graph"></svg>
    </div>
  );
};

export default BarGraph;