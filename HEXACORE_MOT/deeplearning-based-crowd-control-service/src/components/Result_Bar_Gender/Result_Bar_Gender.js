import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import './Result_Bar_Gender.css';

const Result_Bar_Gender = ({ setGenderResult }) => {
  const d3Container = useRef(null);
  const [data, setData] = useState({ man_cnt: 0, woman_cnt: 0, man_pct: 0, woman_pct: 0 });
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userID");
        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }
        const exhbId = 'exhb1';

        const response = await axios.get(`http://localhost:4000/bygender`, {
          params: { userId, exhbId, date:today },
          withCredentials: true,
        });
        console.log("성별데이터 마지막페이지", response.data);
        if (response.status === 200) {
          const man_cnt = parseInt(response.data[0].man_cnt_sum, 10) || 0;
          console.log("man_cnt",man_cnt);
          const woman_cnt = parseInt(response.data[0].woman_cnt_sum, 10) || 0;
          const total = man_cnt + woman_cnt;
          const man_pct = Math.round((man_cnt / total) * 100);
          const woman_pct = Math.round((woman_cnt / total) * 100);

          setData({ man_cnt, woman_cnt, man_pct, woman_pct });

          // Pass gender result and percentages
          if (man_cnt > woman_cnt) {
            setGenderResult({ gender: 'M', man_pct, woman_pct });
          } else {
            setGenderResult({ gender: 'F', man_pct, woman_pct });
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [setGenderResult]);

  useEffect(() => {
    if (data) {
      const width = 720;
      const height = 150;
      const barHeight = 30;

      const svg = d3.select(d3Container.current)
        .attr('width', width)
        .attr('height', height);

      svg.selectAll('*').remove();


      const man_colors = ['#118AB2', '#256980', '#2A4852'];
      const woman_colors = ['#EF476F', '#C76179', '#995767'];

      const drawBars = (data, colors, startX, direction) => {
        let x = startX;
        data.forEach((d, i) => {
          svg.append('rect')
            .attr('x', direction === 'left' ? x - d.width : x)
            .attr('y', height / 2 - barHeight / 2)
            .attr('width', d.width)
            .attr('height', barHeight)
            .attr('fill', colors[i]);

          x += direction === 'left' ? -d.width : d.width;
        });

        svg.append('text')
          .attr('x', direction === 'left' ? x - 20 : x + 10)
          .attr('y', height / 2)
          .attr('dy', '.35em')
          .attr('text-anchor', direction === 'left' ? 'start' : 'start')
          .text(direction === 'left' ? 'M' : 'F')
          .attr('font-size', '14px')
          .attr('fill', '#000');
      };

      const man_pct = Math.round((data.man_cnt / (data.man_cnt + data.woman_cnt)) * 100);
      const woman_pct = Math.round((data.woman_cnt / (data.man_cnt + data.woman_cnt)) * 100);

      const man_data = [
        { label: 'Man', value: data.man_cnt, percentage: Math.min(man_pct, 25), width: Math.min(man_pct, 25) * 3.6 },
        { label: 'Man', value: data.man_cnt, percentage: Math.min(Math.max(man_pct - 25, 0), 25), width: Math.min(Math.max(man_pct - 25, 0), 25) * 3.6 },
        { label: 'Man', value: data.man_cnt, percentage: Math.min(Math.max(man_pct - 50, 0), 25), width: Math.min(Math.max(man_pct - 50, 0), 25) * 3.6 },
      ];

      const woman_data = [
        { label: 'Woman', value: data.woman_cnt, percentage: Math.min(woman_pct, 25), width: Math.min(woman_pct, 25) * 3.6 },
        { label: 'Woman', value: data.woman_cnt, percentage: Math.min(Math.max(woman_pct - 25, 0), 25), width: Math.min(Math.max(woman_pct - 25, 0), 25) * 3.6 },
        { label: 'Woman', value: data.woman_cnt, percentage: Math.min(Math.max(woman_pct - 50, 0), 25), width: Math.min(Math.max(woman_pct - 50, 0), 25) * 3.6 },
      ];

      if (man_pct > woman_pct) {
        drawBars(man_data, man_colors, width / 2, 'left');
        drawBars(woman_data, woman_colors, width / 2, 'right');
      } else {
        drawBars(woman_data, woman_colors, width / 2, 'right');
        drawBars(man_data, man_colors, width / 2, 'left');
      }

      // Add x-axis ticks
      const ticks = [0, 25, 50, 75, 100];
      const tickLabels = ['100%', '50%', '0%', '50%', '100%'];
      const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);
      const xAxis = d3.axisBottom(xScale)
        .tickValues(ticks)
        .tickFormat((d, i) => tickLabels[i]);

      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height / 1.6})`)
        .call(xAxis)
        .selectAll('text')
        .attr('dy', '1em');

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height /5)
        .attr("text-anchor", "middle")
        .attr("font-family", "Pretendard")
        .attr("font-size", "16px")
        .text("성별 요약");

      return ;
    }
  }, [data]);

  return (
    <div className="Result_Bar_Gender">
      <svg
        className="d3-component"
        ref={d3Container}
      />
    </div>
  );
}

export default Result_Bar_Gender;