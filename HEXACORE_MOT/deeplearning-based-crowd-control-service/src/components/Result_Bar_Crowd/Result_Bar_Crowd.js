import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './Result_Bar_Crowd.css';

const Result_Bar_Crowd = ({ setCrowdResult }) => {
  const d3Container = useRef(null);
  const [crowdResult, setCrowdResultState] = useState(null);

  useEffect(() => {
    const getRandomPercentageChange = () => {
      const min = 5;
      const max = 15;
      const randomChange = Math.random() * (max - min) + min;
      return Math.random() < 0.5 ? -randomChange : randomChange;
    };

    const percentChange = getRandomPercentageChange();
    const width = 720;
    const height = 150;
    const barHeight = 30;

    const svg = d3.select(d3Container.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const color = percentChange < 0 ? '#EF476F' : '#118AB2';
    const label = percentChange < 0 ? 'H' : 'L';
    const value = Math.abs(percentChange);

    // crowdResult 상태 설정
    setCrowdResultState({ label, value });
    setCrowdResult({ label, value });

    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);

    svg.append('rect')
      .attr('x', percentChange < 0 ? width / 2 : width / 2 - xScale(value))
      .attr('y', height / 2 - barHeight / 2)
      .attr('width', xScale(value))
      .attr('height', barHeight)
      .attr('fill', color);

    svg.append('text')
      .attr('x', percentChange < 0 ? width / 2 - xScale(value) + 340 : width / 2 + xScale(value) - 340)
      .attr('y', height / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', percentChange < 0 ? 'end' : 'start')
      .text(label)
      .attr('font-size', '14px')
      .attr('fill', '#000');

    svg.append('text')
      .attr('x', percentChange < 0 ? width / 2 - xScale(value) + 350 : width / 2 + xScale(value) - 350)
      .attr('y', height / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', percentChange < 0 ? 'start' : 'end')
      .text(`${value.toFixed(2)}%`)
      .attr('font-size', '14px')
      .attr('fill', '#000');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 5)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Pretendard')
      .attr('font-size', '16px')
      .text("지난 1달 대비 1주일 관광객 증감 비율");

    // Add x-axis ticks
    const ticks = [0, 25, 50, 75, 100];
    const tickLabels = ['100%', '50%', '0%', '50%', '100%'];

    const xAxis = d3.axisBottom(xScale)
      .tickValues(ticks)
      .tickFormat((d, i) => tickLabels[i]);

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height / 1.6})`)
      .call(xAxis)
      .selectAll('text')
      .attr('dy', '1em');

    return () => {};
  }, [setCrowdResult]);

  return (
    <div className="Result_Bar_Crowd">
      <svg
        className="d3-component"
        ref={d3Container}
      />
    </div>
  );
};

export default Result_Bar_Crowd;
