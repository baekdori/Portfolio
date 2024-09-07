import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

const GenderAgePieChart = ({
  setSelectedData,
  selectedDate,
  selectedExhibition,
}) => {
  const svgRef = useRef(null); // svg 요소의 참조를 저장하기 위한 useRef 훅 사용
  const [data, setData] = useState(null); // 성별 데이터를 저장하기 위한 상태 훅
  const [ageData, setAgeData] = useState(null); // 나이 데이터를 저장하기 위한 상태 훅
  const [selectedGender, setSelectedGender] = useState("male"); // 선택된 성별을 저장하기 위한 상태 훅
  const [pieChartRendered, setPieChartRendered] = useState(false); // 파이 차트가 렌더링되었는지 여부를 저장하는 상태 훅
  const [isChartVisible, setIsChartVisible] = useState(false); // 차트가 화면에 보이는지 여부를 저장하는 상태 훅

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userID"); // 세션 스토리지에서 userID 가져오기
        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다."); // userID가 없을 경우 에러 메시지 출력
          return;
        }

        const exhbId = selectedExhibition; // 선택된 전시 ID
        const date = selectedDate; // 선택된 날짜

        // 서버로부터 성별 데이터 요청
        const response = await axios.get("http://localhost:4000/bygender", {
          params: { userId, exhbId, date },
          withCredentials: true,
        });
        // 서버로부터 나이 데이터 요청
        const response2 = await axios.get("http://localhost:4000/byage", {
          params: { userId, exhbId, date },
          withCredentials: true,
        });
        // 서버로부터 응답이 성공적일 경우 데이터 상태 업데이트
        if (response.status === 200) {
          setData(response.data);
        }
        if (response2.status === 200) {
          setAgeData(response2.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error); // 데이터 요청 중 에러가 발생할 경우 에러 메시지 출력
      }
    };

    fetchData(); // 데이터 요청 함수 호출
  }, [selectedDate, selectedExhibition]); // 선택된 날짜와 전시 ID가 변경될 때마다 실행

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset; // 현재 스크롤 위치
      const chartTop = svgRef.current.getBoundingClientRect().top; // 차트의 상단 위치
      const isTopVisible = chartTop < window.innerHeight; // 차트가 화면에 보이는지 여부

      if (isTopVisible && !isChartVisible) {
        setIsChartVisible(true); // 차트가 화면에 보일 경우 상태 업데이트
      }
    };

    window.addEventListener("scroll", handleScroll); // 스크롤 이벤트 리스너 추가
    
    return () => {
      window.removeEventListener("scroll", handleScroll); // 컴포넌트 언마운트 시 이벤트 리스너 제거
    };
  }, [isChartVisible]); // 차트가 화면에 보이는지 여부 상태가 변경될 때마다 실행

  useEffect(() => {
    if (data && ageData && !pieChartRendered && isChartVisible) {
      // 데이터가 존재하고 파이 차트가 렌더링되지 않았으며 차트가 화면에 보일 경우 실행

      // 성별 데이터를 숫자로 변환
      const man_cnt = parseInt(data[0]?.["man_cnt_sum"] || 0, 10);
      const woman_cnt = parseInt(data[0]?.["woman_cnt_sum"] || 0, 10);

      // 남성 나이대별 데이터를 숫자로 변환
      const child_man = parseInt(ageData[0]?.sum_child_man || 0, 10);
      const teen_man = parseInt(ageData[0]?.sum_teen_man || 0, 10);
      const youth_man = parseInt(ageData[0]?.sum_youth_man || 0, 10);
      const middle_man = parseInt(ageData[0]?.sum_middle_man || 0, 10);
      const old_man = parseInt(ageData[0]?.sum_old_man || 0, 10);

      // 여성 나이대별 데이터를 숫자로 변환
      const child_woman = parseInt(ageData[0]?.sum_child_woman || 0, 10);
      const teen_woman = parseInt(ageData[0]?.sum_teen_woman || 0, 10);
      const youth_woman = parseInt(ageData[0]?.sum_youth_woman || 0, 10);
      const middle_woman = parseInt(ageData[0]?.sum_middle_woman || 0, 10);
      const old_woman = parseInt(ageData[0]?.sum_old_woman || 0, 10);

      console.log(ageData);
      
      // 바 차트를 업데이트하는 함수 정의
      const updateBarChart = (gender) => {
        if (gender === "male") {
          setSelectedData([
            { age: "어린이", value: child_man },
            { age: "청소년", value: teen_man },
            { age: "청년", value : youth_man},
            { age: "중년", value: middle_man },
            { age: "노인", value: old_man },
          ]);
        } else {
          setSelectedData([
            { age: "어린이", value: child_woman },
            { age: "청소년", value: teen_woman },
            { age: "청년", value: youth_woman },
            { age: "중년", value: middle_woman },
            { age: "노인", value: old_woman },
          ]);
        }
      };

      const svg = d3
        .select(svgRef.current)
        .attr("width", 350)
        .attr("height", 350); // svg 요소의 너비와 높이 설정

      const g = svg
        .append("g")
        .attr("transform", `translate(${svg.attr("width") / 2}, ${svg.attr("height") / 2})`); // 그룹 요소를 추가하고 중앙으로 이동

      // 파이 차트 중앙의 텍스트 라벨 추가
      g.append("text")
        .attr("class", "center-label")
        .attr("text-anchor", "middle")
        .attr("font-family", "Pretendard")
        .attr("font-size", "2rem")
        .text("성별을 선택하세요")
        .attr("y", -170); // 파이 차트의 중앙에서 상대적인 위치 조정

      const pie = d3.pie().value((d) => d.value); // 파이 차트 레이아웃 생성
      const chartData = [
        { label: "남성", value: man_cnt, gender: "male" },
        { label: "여성", value: woman_cnt, gender: "female" },
      ]; // 차트 데이터 설정

      const arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(Math.min(svg.attr("width"), svg.attr("height")) / 2 - 30); // 파이 차트의 아크 생성

      const arcs = g.selectAll(".arc").data(pie(chartData), (d) => d.data.gender); // 아크 데이터 바인딩

      arcs.exit().remove(); // 기존 아크 제거

      const newArcs = arcs.enter().append("g").attr("class", "arc"); // 새로운 아크 그룹 추가

      newArcs
        .append("path")
        .attr("fill", (d, i) => (i === 0 ? "#118AB2" : "#EF476F")) // 아크 색상 설정
        .attr("d", arc)
        .attr("opacity", (d) => (selectedGender === d.data.gender ? 1 : 0.3)) // 선택된 성별에 따른 초기 투명도 설정
        .on("mouseover", function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("stroke", "black")
            .attr("stroke-width", 2); // 마우스 오버 시 경계선 추가
        })
        .on("mouseout", function () {
          d3.select(this).transition().duration(200).attr("stroke", "none"); // 마우스 아웃 시 경계선 제거
        })
        .on("click", function (event, d) {
          setSelectedGender(d.data.gender); // 클릭 시 선택된 성별 업데이트
          updateBarChart(d.data.gender); // 클릭 시 바 차트 업데이트
          newArcs.selectAll("path").attr("opacity", (innerD) => (d.data.gender === innerD.data.gender ? 1 : 0.3)); // 클릭 시 선택된 성별에 따른 투명도 설정
        })
        .transition()
        .duration(3000)
        .attrTween("d", function (d) {
          const i = d3.interpolate(d.startAngle, d.endAngle); // 파이 차트의 각도를 애니메이션으로 보이도록 설정
          return function (t) {
            d.endAngle = i(t);
            return arc(d);
          };
        });

      newArcs
        .append("text")
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("font-family", "Pretendard")
        .attr("font-size", "16px")
        .text((d) => d.data.label); // 파이 차트 아크의 중앙에 라벨 추가

      newArcs
        .append("text")
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("dy", "1.5em")
        .attr("text-anchor", "middle")
        .attr("font-family", "Pretendard")
        .attr("font-size", "16px")
        .text(0)
        .transition()
        .duration(4000)
        .tween("text", function (d) {
          const i = d3.interpolateRound(0, d.data.value); // 파이 차트 값 애니메이션
          return function (t) {
            this.textContent = i(t);
          };
        });

      setPieChartRendered(true); // 파이 차트가 렌더링되었음을 상태로 저장
      setSelectedGender("male"); // 파이 차트 렌더링 시 초기 선택된 성별을 "male"로 설정
      updateBarChart("male"); // 초기 바 차트를 남성 데이터로 업데이트
    }
  }, [
    data,
    ageData,
    selectedGender,
    selectedDate,
    selectedExhibition,
    setSelectedData,
    pieChartRendered,
    isChartVisible,
  ]); // 종속성 배열이 변경될 때마다 실행

  return (
    <div style={{ height: "300px" }}> {/* 스크롤을 시뮬레이트하기 위한 플레이스홀더 높이 설정 */}
      <svg ref={svgRef}></svg> {/* 파이 차트를 그리기 위한 SVG 요소 */}
    </div>
  );
};

export default GenderAgePieChart; // 컴포넌트를 내보내기
