import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './GenderAgePieChart_2nd.module.css';

const GenderAgePieChart = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // DB에서 데이터 가져오는 코드 (주석 처리)
        // const response = await fetch('/api/gender-data');
        // const data = await response.json();
        // const { male, female } = data;

        // 남성 연령대별 값 랜덤 생성 (합계가 40~45% 되도록)
        const mKids = Math.floor(Math.random() * 51);
        const mTeen = Math.floor(Math.random() * 51);
        const mAdult = Math.floor(Math.random() * 51);
        const mMid = Math.floor(Math.random() * 51);
        const mEld = Math.floor(Math.random() * 51);
        const mTotal = mKids + mTeen + mAdult + mMid + mEld;
        const mPercent = Math.floor(Math.random() * 6) + 40;
        const male = (mTotal / 100) * (mPercent * 10);

        // 여성 연령대별 값 랜덤 생성 (합계가 55~60% 되도록)
        const fKids = Math.floor(Math.random() * 51);
        const fTeen = Math.floor(Math.random() * 51);
        const fAdult = Math.floor(Math.random() * 51);
        const fMid = Math.floor(Math.random() * 51);
        const fEld = Math.floor(Math.random() * 51);
        const fTotal = fKids + fTeen + fAdult + fMid + fEld;
        const fPercent = 100 - mPercent;
        const female = (fTotal / 100) * (fPercent * 10);
        
        // 양측 총합
        const total = male + female;

        const width = 675;
        const height = 675;
        const radius = width / 2;
        
        // 그래프 범위
        const svg = d3
          .select(svgRef.current)
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const pie = d3.pie().value(d => d.value); // pie 레이아웃을 통해 데이터를 파이 조각으로 변환
        const data = [
          { label: '남성', value: male },
          { label: '여성', value: female },
        ];

        const arc = d3 // 파이 조각의 형상 결정
          .arc()
          .innerRadius(radius * 0)
          .outerRadius(radius * 0.8);

        const arcs = svg // 각 조각의 요소 결정
          .selectAll('arc')
          .data(pie(data))
          .enter()
          .append('g')
          .attr('class', 'arc');

        arcs // 파이 조각 색상 및 애니메이션 지정
          .append('path')
          .attr('fill', (d, i) => (i === 0 ? '#118AB2' : '#EF476F'))
          .attr('d', d => arc(d))
          .on('mouseover', function(d,i){ // 커서 올렸을 때 테두리 진해지기 추가
            d3.select(this)
            .transition()
            .duration(200)
            .attr('stroke', 'black')
            .attr('stroke-width', 2);
          })
          .on('mouseout', function(d, i){ // 커서 치웠을 때 테두리 초기화
            d3.select(this)
            .transition()
            .duration(200)
            .attr('stroke', 'none')
          })
          // .on('click', function(d, i){ 클릭하면 막대그래프로 데이터 전달
          //   if(i === 0){
          //     setMaleData(d.data.values);
          //   }
          // })
          .transition() // 애니메이션 추가
          .duration(1000) // 애니메이션 지속 시간 1초
          .attrTween('d', function(d) {
            const i = d3.interpolate(d.startAngle, d.endAngle);
            return function(t) {
              d.endAngle = i(t);
              return arc(d);
            };
          });

        const genderTexts = arcs // 각 조각의 성별과 숫자값 설정
          .append('text')
          .attr('transform', d => `translate(${arc.centroid(d)})`)
          .attr('dy', '0.35em')
          .attr('text-anchor', 'middle')
          .attr('font-family', 'Pretendard')
          .attr('font-size', '40px')
          .attr('font-weight', 'bold')
          .attr('fill', 'white')

        genderTexts // 레이블
          .append('tspan')
          .attr('x', 0)
          .attr('y', -10)
          .text(d => d.data.label);

        genderTexts
          .append('tspan')
          .attr('x', 0)
          .attr('y', 60)
          .text(0) // 초기 값 0으로 설정
          .transition() // 애니메이션 추가
          .duration(1000) // 애니메이션 지속 시간 1초
          .tween('text', function(d) {
    
        const i = d3.interpolateRound(0, d.data.value); // 0에서 실제 값까지 보간
          return function(t) {
        this.textContent = i(t); // 숫자 업데이트
        };
        });

        svg // 차트 제목
          .append('text')
          .attr('x', 0)
          .attr('y', -radius * 0.9)
          .attr('text-anchor', 'middle')
          .attr('font-family', 'Pretendard')
          .attr('font-size', '20px')
          .text('성별 분포');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="pie-chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GenderAgePieChart;