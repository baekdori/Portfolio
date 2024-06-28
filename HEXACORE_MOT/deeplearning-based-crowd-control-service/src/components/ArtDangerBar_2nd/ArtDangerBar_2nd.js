import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './ArtDangerBar.module.css';

const BarGraph = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // MySQL DB에서 JSON 데이터 가져오기
        const response = await fetch('/api/congestion-data');
        const data = //await response.json();
        [
          { artName: '작품 A', dangerCount: Math.floor(Math.random() * 120) },
          { artName: '작품 B', dangerCount: Math.floor(Math.random() * 120) },
          { artName: '작품 C', dangerCount: Math.floor(Math.random() * 120) },
          { artName: '작품 D', dangerCount: Math.floor(Math.random() * 120) },
          { artName: '작품 E', dangerCount: Math.floor(Math.random() * 120) },
        ];

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 816 - margin.left - margin.right;
        const height = 330 - margin.top - margin.bottom;

        const x = d3.scaleLinear().range([0, width]).domain([0, 120]);
        const y = d3.scaleBand().range([0, height]).padding(0.1);

        const svg = d3
          .select(svgRef.current)
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

        y.domain(data.map(d => d.artName));

        svg
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(x).ticks(5));

        svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(y));

        svg
          .selectAll('.bar')
          .data(data)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('y', d => y(d.artName))
          .attr('height', y.bandwidth())
          .attr('x', 0)
          .attr('width', d => x(d.dangerCount))
          .style('fill', (d, i) => {
            const colors = ['#9DD7D7', '#6DC3C3', '#3CAFAF', '#0B9B9B', '#097C7C'];
            return colors[i];
          });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bar-graph-container">
    <div className="bar-graph-title-container">
      <div className="bar-graph-title">작품별 위험 상황 발생 상위 5개 막대그래프</div>
      </div>
      <svg ref={svgRef} className="bar-graph"></svg>
    </div>
  );
};

export default BarGraph;