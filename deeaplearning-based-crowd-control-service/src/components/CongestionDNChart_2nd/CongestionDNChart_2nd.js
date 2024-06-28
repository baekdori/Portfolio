import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styles from './DonutChart.module.css';

const DonutChart = () => {
    const svgRef = useRef(null);
    const chartWidth = 312;
    const chartHeight = 312;
    const centerX = chartWidth / 2.3; // 차트 중심 X 좌표
    const centerY = chartHeight / 2; // 차트 중심 Y 좌표
    const outerRadius = chartWidth / 2 -24;
    const innerRadius = outerRadius -24;

    useEffect (() =>{
        const fetchData = async () => {
            try{
                // const response = await fetch('/api/congestion-data');
                // const data = await response.json();
                // const congestionRatio = data.congestionRatio;
                const congestionRatio = Math.floor(Math.random() * 101);
                const arcStartAngle = () => 0; 
                const arcEndAngle = (d) => (Math.PI * 2 * (congestionRatio / 100));

                const svg = d3
                    .select(svgRef.current)
                    .attr('width', 600)
                    .attr('height', chartHeight)
                    .append('g')
                    .attr('transform', `translate(${centerX}, ${centerY})`);

                const pie = d3
                    .pie()
                    .sort(null)
                    .value(d => d.value);

                const arc = d3
                    .arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius)
                    .startAngle(arcStartAngle)
                    .endAngle(arcEndAngle);

                const colorScale = d3
                    .scaleLinear()
                    .domain([0, 25, 50, 75, 100])
                    .range(['#42FF00', '#FFD400', '#FF7A00', '#FF0000', '#FF0000']);

                const arcs = pie([
                    { value: congestionRatio <= 25 ? congestionRatio : 25 },
                    { value: congestionRatio > 25 && congestionRatio <= 50 ? congestionRatio - 25 : 0 },
                    { value: congestionRatio > 50 && congestionRatio <= 75 ? congestionRatio - 50 : 0 },
                    { value: congestionRatio > 75 ? congestionRatio - 75 : 0 },
                ]);

                svg
                    .selectAll('path')
                    .data(arcs)
                    .enter()
                    .append('path')
                    .attr('d', arc)
                    .attr('fill', colorScale(congestionRatio));

                svg
                    .append('circle')
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', 125)
                    .attr('fill', '#CDD7E4');

                svg
                    .append('circle')
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', 125)
                    .attr('fill', 'white')

                svg
                    .append('circle')
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', 113)
                    .attr('fill', colorScale(congestionRatio));

                svg
                    .append('text')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('text-anchor', 'middle')
                    .attr('alignment-baseline', 'middle')
                    .attr('font-family', 'Pretendard')
                    .attr('font-weight', 'bold')
                    .attr('font-size', '66px')
                    .text(`${congestionRatio}%`);

                svg
                    .append('text')
                    .attr('x',170)
                    .attr('y', 0)
                    .attr('text-anchor', 'start')
                    .attr('alignment-baseline', 'middle')
                    .attr('font-family', 'Pretendard')
                    .attr('font-size', '20px')
                    .text('현재 관측된 관람객 수 : ') // 관측된 관람객 수 값 받아서 출력;

            } catch (error){
                console.error('Error fetching data : ', error);
            }
        };
        fetchData();
    },[]);

     return (
        <div className={styles.chartContainer}>
            <div className={styles.chartTitle}>
                <div className={styles.titleText}>평균 혼잡도</div>
                <svg ref={svgRef} className={styles.chart} style={{ marginLeft: -150 }}></svg>
            </div>
        </div>
    );
};

export default DonutChart;
