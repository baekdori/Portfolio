import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './Result_Bar_Age.css';
import axios from 'axios';

const Result_Bar_Age = ({ setAgeResult }) => {
  const d3Container = useRef(null);
  const today = new Date().toISOString().split('T')[0];
  const [ageData, setAgeData] = useState({
    manChildTotal: 0,
    womanChildTotal: 0,
    manMiddleTotal: 0,
    womanMiddleTotal: 0,
    manOldTotal: 0,
    womanOldTotal: 0,
    totalYounger: 0,
    totalOlder: 0,
  });


  // const generateRandomPercentages = (total) => {
  //   const randomValues = Array.from({ length: 3 }, () => Math.random());
  //   const sum = randomValues.reduce((acc, val) => acc + val, 0);
  //   return randomValues.map(val => (val / sum) * total);
  // };
  
  // 전달용 임시데이터 초기값 설정
  let newAgeData = {
    manChildTotal: 0,
    womanChildTotal: 0,
    manMiddleTotal: 0,
    womanMiddleTotal: 0,
    manOldTotal: 0,
    womanOldTotal: 0,
    totalYounger: 0,
    totalOlder: 0,
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        // const total_man = Math.floor(Math.random() * 101);
        // const total_woman = 100 - total_man;
        // const [child_man, middle_man, old_man] = generateRandomPercentages(total_man);
        // const [child_woman, middle_woman, old_woman] = generateRandomPercentages(total_woman);

        //데이터 전송에 필요한 아이디 선언
        const userId = sessionStorage.getItem("userID");
        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          
        }



        // 데이터 요청
        
        const response = await axios.get(`http://localhost:4000/byage`, {
          params: { userId, exhbId:'exhb1', date: today },
          withCredentials: true,
        });

          
          // 가져온데이터 ageData에 추가
          newAgeData.manChildTotal = parseInt(response.data[0].sum_child_man) || 0;
          newAgeData.womanChildTotal = parseInt(response.data[0].sum_child_woman) || 0;
          newAgeData.manMiddleTotal = parseInt(response.data[0].sum_middle_man) || 0;
          newAgeData.womanMiddleTotal = parseInt(response.data[0].sum_middle_woman) || 0;
          newAgeData.manOldTotal = parseInt(response.data[0].sum_old_man) || 0;
          newAgeData.womanOldTotal = parseInt(response.data[0].sum_old_woman) || 0;

        // 연령별 총계
        newAgeData.totalYounger = newAgeData.manChildTotal + newAgeData.womanChildTotal;
        newAgeData.totalOlder = newAgeData.manMiddleTotal + newAgeData.womanMiddleTotal + newAgeData.manOldTotal + newAgeData.womanOldTotal;

        // total연령에 따라 ageGroup에 값을 담음
        const ageGroup = newAgeData.totalYounger > newAgeData.totalOlder
          ? 'Y'
          : newAgeData.totalYounger < newAgeData.totalOlder
            ? 'O'
            : 'E';

        // ageData설정(그래프에 사용)
        setAgeData(newAgeData);

        // ageGroup전송(분석결과 text에 사용)
        setAgeResult({ ageGroup, youngerTotal: newAgeData.totalYounger, olderTotal: newAgeData.totalOlder });


       
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [setAgeData, setAgeResult]);


  useEffect(() => {
    if (ageData) {
      console.log("fffageData", ageData);
      const width = 720;
      const height = 150;
      const barHeight = 30;

      const svg = d3.select(d3Container.current)
        .attr('width', width)
        .attr('height', height);

      svg.selectAll('*').remove();

      

      const young_colors = ['#118AB2', '#256980'];
      const old_colors = ['#EF476F','#C76179'];

      const drawBars = (ageData, colors, startX, direction) => {
        let x = startX;
        ageData.forEach((d, i) => {
          // Skip drawing bars for youth category
          if (d.label.includes('Youth')) return;

          const percentage = d.value;

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
          .text(direction === 'left' ? 'Y' : 'O')
          .attr('font-size', '14px')
          .attr('fill', '#000');
      };

      const man_total = ageData.manChildTotal + ageData.manMiddleTotal + ageData.manOldTotal;
      const woman_total = ageData.womanChildTotal + ageData.womanMiddleTotal + ageData.womanOldTotal;
      const total = man_total + woman_total;
      const old_man = ageData.manMiddleTotal + ageData.manOldTotal;
      const old_woman = ageData.womanMiddleTotal + ageData.womanOldTotal;

      const young_data_percentage = [    
        { label: 'Child Man', value: parseInt((ageData.manChildTotal/total)*100).toFixed(2), width: ((ageData.manChildTotal / total) * width/2 ) },
        { label: 'Child Woman', value:parseInt((ageData.womanChildTotal/total)*100).toFixed(2), width: ((ageData.womanChildTotal/total)* width/2 )}
        
      ];
      
      const old_data_percentage = [
        { label: 'Old Man', value: parseInt((old_man/total)*100).toFixed(2), width: ((old_man /total)* width/2)},
        { label: 'Old Woman', value: parseInt((old_woman/total)*100).toFixed(2), width: ((old_woman/total)* width/2 ) },
        
      ];

      drawBars(young_data_percentage, young_colors, width/2, 'left');
      drawBars(old_data_percentage, old_colors, width/2, 'right');

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
  
        svg.append("text")
          .attr("x", width / 2)
          .attr("y", height / 5)
          .attr("text-anchor", "middle")
          .attr("font-family", "Pretendard")
          .attr("font-size", "16px")
          .text("연령대 요약");
  
        return ;
      }
    }, [ageData, setAgeResult]);
  
    return (
      <div className="Result_Bar_Age">
        <svg
          className="d3-component"
          ref={d3Container}
        />
      </div>
    );
  };
  
  export default Result_Bar_Age;
  