import React, { useEffect, useRef, useState } from "react"; // React의 useEffect, useRef, useState 훅을 import
import axios from "axios"; // HTTP 요청을 위한 axios 라이브러리 import
import * as d3 from "d3"; // d3.js 라이브러리 import
import "./LineGraph_2nd.css"; // CSS 파일 import

const LineGraph = ({ selectedDate, selectedExhibition }) => {
  const svgRef = useRef(null); // SVG 엘리먼트를 참조하기 위한 ref
  const tooltipRef = useRef(null); // 툴팁 엘리먼트를 참조하기 위한 ref
  const [data, setData] = useState([]); // 데이터를 상태로 관리
  const [isFutureDate, setIsFutureDate] = useState(false); // 미래 날짜 여부를 상태로 관리

  useEffect(() => { // 컴포넌트가 마운트될 때 실행
    const fetchData = async () => { // 데이터를 가져오는 비동기 함수
      try {
        const userId = sessionStorage.getItem("userID"); // 세션에서 userID를 가져옴
        if (!userId) { // userID가 없을 경우 에러 로그 출력
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }
        const exhbId = selectedExhibition; // 선택된 전시회 ID
        const date = selectedDate; // 선택된 날짜
        const today = new Date(); // 오늘 날짜
        const selected = new Date(date); // 선택된 날짜를 Date 객체로 변환

        if (selected > today) { // 선택된 날짜가 미래인지 확인
          setIsFutureDate(true); // 미래 날짜인 경우 상태 업데이트
          return;
        } else {
          setIsFutureDate(false); // 미래 날짜가 아닌 경우 상태 업데이트
        }

        const response = await axios.get(`http://localhost:4000/visitor`, { // axios를 이용해 서버에서 데이터 가져오기
          params: { userId, exhbId, date }, // 요청에 필요한 파라미터 설정
          withCredentials: true, // 인증 정보 포함
        });

        if (response.status === 200) { // 응답 상태가 200(성공)일 경우
          setData(response.data); // 응답 데이터를 상태로 설정
        }
      } catch (error) { // 에러 발생 시
        console.error("Error fetching data:", error); // 에러 로그 출력
      }
    };

    fetchData(); // 데이터 가져오기 함수 호출
    const intervalId = setInterval(fetchData, 30000); // 1분마다 fetchData 함수 호출

    return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 인터벌 제거
  }, [selectedDate, selectedExhibition]); // 선택된 날짜와 전시회가 변경될 때마다 실행

  useEffect(() => { // 컴포넌트가 마운트될 때 실행
    const drawGraph = () => { // 그래프를 그리는 함수
      if (data.length === 0 || isFutureDate) return; // 데이터가 없거나 미래 날짜인 경우 그래프를 그리지 않음

      const svgWidth = window.innerWidth * 0.755; // SVG 너비 설정
      const svgHeight = window.innerHeight * 0.75; // SVG 높이 설정

      const margin = { top: 50, right: 100, bottom: 70, left: 65 }; // 그래프 여백 설정
      const width = svgWidth - margin.left - margin.right; // 실제 그래프 너비 계산
      const height = svgHeight - margin.top - margin.bottom; // 실제 그래프 높이 계산

      const svg = d3.select(svgRef.current); // svgRef를 이용해 SVG 엘리먼트 선택

      svg.selectAll("*").remove(); // 기존 그래프 삭제

      const g = svg // 새로운 그래프 그룹 생성
        .attr("width", width + margin.left + margin.right) // SVG 너비 설정
        .attr("height", height + margin.top + margin.bottom) // SVG 높이 설정
        .append("g") // 그룹 엘리먼트 추가
        .attr("transform", `translate(${margin.left}, ${margin.top})`); // 그래프 위치 설정

      const currentTime = new Date(); // 현재 시간
      const currentHour = currentTime.getHours(); // 현재 시간의 시
      const currentMinute = currentTime.getMinutes(); // 현재 시간의 분
      const selected = new Date(selectedDate); // 선택된 날짜를 Date 객체로 변환
      const isToday = selected.toDateString() === currentTime.toDateString(); // 선택한 날짜가 오늘인지 확인

      const maxHour = d3.max(data, (d) => new Date(d.hour).getHours)

      const x = d3 // x축 스케일 설정
        .scaleTime() // 시간 스케일 사용
        .range([0, width]) // 스케일 범위 설정
        .domain([
          new Date(new Date().getFullYear(), 0, 1, 9, 0), // 도메인 시작 (연도, 월, 일, 시, 분)
          new Date(new Date().getFullYear(), 0, 1, 18, 0), // 도메인 끝
        ]);

      const y = d3 // y축 스케일 설정
        .scaleLinear() // 선형 스케일 사용
        .range([height, 0]) // 스케일 범위 설정
        .domain([
          0, // 도메인 시작
          d3.max(data, (d) => // 도메인 끝, 데이터에서 최대값 계산
            d3.max([
              d.current_population ? +d.current_population : 0, // 현재 인구 수
              d.yesterday_population ? +d.yesterday_population : 0, // 어제 인구 수
              d.last_week_population ? +d.last_week_population : 0, // 지난주 인구 수
              d.last_month_population ? +d.last_month_population : 0, // 지난달 인구 수
            ])
          ) + 5, // 최대값에 5를 더해 여유를 줌
        ]);

      g.append("g") // x축 그룹 추가
        .attr("class", "x-axis") // 클래스명 설정
        .attr("transform", `translate(0, ${height})`) // x축 위치 설정
        .call(
          d3 // x축 호출
            .axisBottom(x) // 아래쪽 x축 사용
            .ticks(d3.timeHour.every(1)) // 1시간마다 틱 설정
            .tickFormat(d3.timeFormat("%H:%M")) // 시간 형식 설정
        )
        .attr("font-family", "Pretendard") // 폰트 설정
        .attr("font-size", "16px") // 폰트 크기 설정
        .attr("font-weight", "regular"); // 폰트 굵기 설정

      g.append("g") // y축 그룹 추가
        .attr("class", "y-axis") // 클래스명 설정
        .call(d3.axisLeft(y).ticks(8)) // 왼쪽 y축 호출, 틱 설정
        .selectAll("text") // y축의 모든 텍스트 선택
        .attr("font-family", "Pretendard") // 폰트 설정
        .attr("font-size", "16px") // 폰트 크기 설정
        .attr("font-weight", "regular"); // 폰트 굵기 설정

      g.append("text") // x축 레이블 추가
        .attr("class", "axis-label") // 클래스명 설정
        .attr("x", width / 2) // x축 레이블 위치 설정
        .attr("y", height + margin.bottom - 30) // y축 레이블 위치 설정
        .attr("text-anchor", "middle") // 텍스트 앵커 설정
        .attr("font-family", "Pretendard") // 폰트 설정
        .attr("font-size", "16px") // 폰트 크기 설정
        .attr("font-weight", "regular") // 폰트 굵기 설정
        .text("시간(시)"); // 레이블 텍스트 설정

      g.append("text") // y축 레이블 추가
        .attr("class", "axis-label") // 클래스명 설정
        .attr("x", -margin.left + 46) // x축 레이블 위치 설정
        .attr("y", -margin.top + 30) // y축 레이블 위치 설정
        .attr("text-anchor", "middle") // 텍스트 앵커 설정
        .attr("font-family", "Pretendard") // 폰트 설정
        .attr("font-size", "16px") // 폰트 크기 설정
        .attr("font-weight", "regular") // 폰트 굵기 설정
        .text("인원(명)"); // 레이블 텍스트 설정

      const line = d3 // 라인 생성 함수 설정
        .line() // 라인 함수 사용
        .x((d) => // x축 값 설정
          x(
            new Date(
              new Date().getFullYear(), // 현재 연도
              0, // 1월
              1, // 1일
              new Date(d.hour).getHours(), // 데이터의 시 값
              new Date(d.hour).getMinutes() // 데이터의 분 값
            )
          )
        )
        .y((d) => y(d.value)); // y축 값 설정

        const filteredDataToday = data.filter((d) => { // 오늘 데이터 필터링
        const dataHour = new Date(d.hour).getHours(); // 데이터의 시 값
        const dataMinute = new Date(d.hour).getMinutes(); // 데이터의 분 값
        return (
          d.current_population != null && // 현재 인구 수가 있는지 확인
          (!isToday || // 오늘이 아닌 경우
            dataHour < currentHour || // 현재 시간 이전인지 확인
            (dataHour === currentHour && dataMinute <= currentMinute)) // 현재 시간과 같은 경우 분 값이 현재 분 값 이하인지 확인
        );
      });

        g.append("path") // 오늘 데이터를 라인 그래프로 추가
        .datum( // 데이터 설정
          filteredDataToday.map((d) => ({
            hour: d.hour,  // 데이터의 시간
            value: d.current_population, // 데이터의 현재 인구 수
          }))
        )
        .attr("class", "current-line")
        .attr("fill", "none") // 채우기 없음
        .attr("stroke", "#EF476F") // 선 색상 설정
        .attr("stroke-width", 3) // 선 두께 설정
        .attr("d", line); // 라인 함수 호출

        if (isToday) { // 오늘 날짜인 경우 현재 시간 라인 추가
        g.append("line") // 라인 추가
          .attr("class", "current-time-line") // 클래스명 설정
          .attr("stroke", "blue") // 스트로크 색상 설정
  
          .attr("stroke-width", 2) // 스트로크 너비 설정
          .attr("stroke-dasharray", "4") // 스트로크 대시 배열 설정
          .attr("x1", x(new Date(new Date().getFullYear(), 0, 1, currentHour, currentMinute))) // x축 시작 위치 설정
          .attr("x2", x(new Date(new Date().getFullYear(), 0, 1, currentHour, currentMinute))) // x축 끝 위치 설정
          .attr("y1", 0) // y축 시작 위치 설정
          .attr("y2", height); // y축 끝 위치 설정
      }

      const filteredDataYesterday = data.filter( // 어제 데이터 필터링
        (d) => d.yesterday_population != null
      );

      g.append("path") // 어제 데이터를 라인 그래프로 추가
        .datum( // 데이터 설정
          filteredDataYesterday.map((d) => ({
            hour: d.hour, // 데이터의 시간
            value: d.yesterday_population !== null ? d.yesterday_population : 0, // 어제 인구 수 또는 0
          }))
        )
        .attr("fill", "none") // 채우기 없음
        .attr("stroke", "#F2D89C") // 선 색상 설정
        .attr("stroke-width", 1) // 선 두께 설정
        .attr("d", line) // 라인 함수 호출
        .on("mouseover", function(){
          d3.select(this).transition().duration(100).attr("opacity", 1);
        }) // 마우스 오버 이벤트
        .on("mouseout", function (){
          d3.select(this).transition().duration(100).attr("opacity", 0.6);
        });

      const filteredDataLastWeek = data.filter( // 지난주 데이터 필터링
        (d) => d.last_week_population != null
      );

      g.append("path") // 지난주 데이터를 라인 그래프로 추가
        .datum( // 데이터 설정
          filteredDataLastWeek.map((d) => ({
            hour: d.hour, // 데이터의 시간
            value: d.last_week_population !== null ? d.last_week_population : 0, // 지난주 인구 수 또는 0
          }))
        )
        .attr("fill", "none") // 채우기 없음
        .attr("stroke", "#3A9BBB") // 선 색상 설정
        .attr("stroke-width", 1) // 선 두께 설정
        .attr("opacity", 0.4)
        .attr("d", line) // 라인 함수 호출
        .on("mouseover", function(){
          d3.select(this).transition().duration(100).attr("opacity", 1);
        }) // 마우스 오버 이벤트
        .on("mouseout", function (){
          d3.select(this).transition().duration(100).attr("opacity", 0.4);
        });

      const filteredDataLastMonth = data.filter( // 지난달 데이터 필터링
        (d) => d.last_month_population != null
      );

      g.append("path") // 지난달 데이터를 라인 그래프로 추가
        .datum( // 데이터 설정
          filteredDataLastMonth.map((d) => ({
            hour: d.hour, // 데이터의 시간
            value: d.last_month_population !== null ? d.last_month_population : 0, // 지난달 인구 수 또는 0
          }))
        )
        .attr("fill", "none") // 채우기 없음
        .attr("stroke", "#073B4C") // 선 색상 설정
        .attr("stroke-width", 1) // 선 두께 설정
        .attr("opacity", 0.4)
        .attr("d", line) // 라인 함수 호출
        .on("mouseover", function(){
          d3.select(this).transition().duration(100).attr("opacity", 1);
        }) // 마우스 오버 이벤트
        .on("mouseout", function (){
          d3.select(this).transition().duration(100).attr("opacity", 0.4);
        });

      g.selectAll(".today-pivot") // 오늘 데이터 포인트 추가
        .data(filteredDataToday) // 오늘 데이터 바인딩
        .join(
          (enter) => // 새로운 데이터 포인트 추가
            enter
              .append("circle") // 원형 엘리먼트 추가
              .attr("class", "today-pivot") // 클래스명 설정
              .attr("r", 7) // 반지름 설정
              .attr("cx", (d) => // x축 값 설정
                x(
                  new Date(
                    new Date().getFullYear(), // 현재 연도
                    0, // 1월
                    1, // 1일
                    new Date(d.hour).getHours(), // 데이터의 시 값
                    new Date(d.hour).getMinutes() // 데이터의 분 값
                  )
                )
              )
              .attr("cy", (d) => y(d.current_population)) // y축 값 설정
              .attr("fill", "#EF476F") // 채우기 색상 설정
              .on("mouseover", function (event, d) { // 마우스 오버 이벤트
                d3.select(this).transition().duration(100).attr("r", 9); // 반지름 증가

                const hourValue = new Date(d.hour).getHours(); // 시 값
                const minuteValue = new Date(d.hour).getMinutes(); // 분 값

                tooltip
                  .html(
                    `<div>${hourValue}시 ${minuteValue}분</div><div> 오늘: ${
                      parseInt(d.current_population)
                    }명</div>` // 툴팁 내용 설정
                  )
                  .style("visibility", "visible") // 툴팁 가시성 설정
                  .style("top", `${event.pageY - 300}px`) // 툴팁 위치 설정
                  .style("left", `${event.pageX - 300}px`);
              })
              .on("mousemove", function (event) { // 마우스 이동 이벤트
                tooltip
                  .style("top", `${event.pageY - 300}px`) // 툴팁 위치 설정
                  .style("left", `${event.pageX - 300}px`);
              })
              .on("mouseout", function () { // 마우스 아웃 이벤트
                d3.select(this).transition().duration(100).attr("r", 7); // 반지름 원래대로

                tooltip.style("visibility", "hidden"); // 툴팁 가시성 설정
              }),
          (update) => update, // 업데이트 시 처리
          (exit) => exit.remove() // 제거 시 처리
        );

      g.selectAll(".yesterday-pivot") // 어제 데이터 포인트 추가
        .data(filteredDataYesterday) // 어제 데이터 바인딩
        .join(
          (enter) => // 새로운 데이터 포인트 추가
            enter
              .append("circle") // 원형 엘리먼트 추가
              .attr("class", "yesterday-pivot") // 클래스명 설정
              .attr("r", 5) // 반지름 설정
              .attr("cx", (d) => // x축 값 설정
                x(
                  new Date(
                    new Date().getFullYear(), // 현재 연도
                    0, // 1월
                    1, // 1일
                    new Date(d.hour).getHours(), // 데이터의 시 값
                    new Date(d.hour).getMinutes() // 데이터의 분 값
                  )
                )
              )
              .attr("cy", (d) => y(d.yesterday_population)) // y축 값 설정
              .attr("opacity", 0.6)
              .attr("fill", "#F2D89C") // 채우기 색상 설정
              .on("mouseover", function (event, d) { // 마우스 오버 이벤트
                d3.select(this).transition().duration(100).attr("opacity", 1); // opacity 1로

                const hourValue = new Date(d.hour).getHours(); // 시 값
                const minuteValue = new Date(d.hour).getMinutes(); // 분 값

                tooltip
                  .html(
                    `<div>${hourValue}시 ${minuteValue}분</div>
                     <div>어제: ${parseInt(d.yesterday_population)}명</div>` // 툴팁 내용 설정
                  )
                  .style("visibility", "visible") // 툴팁 가시성 설정
                  .style("top", `${event.pageY - 300}px`) // 툴팁 위치 설정
                  .style("left", `${event.pageX - 300}px`);
              })
              .on("mousemove", function (event) { // 마우스 이동 이벤트
                tooltip
                  .style("top", `${event.pageY - 300}px`) // 툴팁 위치 설정
                  .style("left", `${event.pageX - 300}px`);
              })
              .on("mouseout", function () { // 마우스 아웃 이벤트
                d3.select(this).transition().duration(100).attr("opacity", 0.6); // opacity 원래대로

                tooltip.style("visibility", "hidden"); // 툴팁 가시성 설정
              }),
          (update) => update, // 업데이트 시 처리
          (exit) => exit.remove() // 제거 시 처리
        );

      g.selectAll(".last-week-pivot") // 지난주 데이터 포인트 추가
        .data(filteredDataLastWeek) // 지난주 데이터 바인딩
        .join(
          (enter) => // 새로운 데이터 포인트 추가
            enter
              .append("circle") // 원형 엘리먼트 추가
              .attr("class", "last-week-pivot") // 클래스명 설정
              .attr("r", 5) // 반지름 설정
              .attr("cx", (d) => // x축 값 설정
                x(
                  new Date(
                    new Date().getFullYear(), // 현재 연도
                    0, // 1월
                    1, // 1일
                    new Date(d.hour).getHours(), // 데이터의 시 값
                    new Date(d.hour).getMinutes() // 데이터의 분 값
                  )
                )
              )
              .attr("cy", (d) => y(d.last_week_population)) // y축 값 설정
              .attr("opacity", 0.4)
              .attr("fill", "#3A9BBB") // 채우기 색상 설정
              .on("mouseover", function (event, d) { // 마우스 오버 이벤트
                d3.select(this).transition().duration(100).attr("opacity", 1); // opacity 1로

                const hourValue = new Date(d.hour).getHours(); // 시 값
                const minuteValue = new Date(d.hour).getMinutes(); // 분 값

                tooltip
                  .html(
                    `<div>${hourValue}시 ${minuteValue}분</div>
                     <div>지난주: ${parseInt(d.last_week_population)}명</div>` // 툴팁 내용 설정
                  )
                  .style("visibility", "visible") // 툴팁 가시성 설정
                  .style("top", `${event.pageY - 300}px`) // 툴팁 위치 설정
                  .style("left", `${event.pageX - 300}px`);
              })
              .on("mousemove", function (event) { // 마우스 이동 이벤트
                tooltip
                  .style("top", `${event.pageY - 300}px`) // 툴팁 위치 설정
                  .style("left", `${event.pageX - 300}px`);
              })
              .on("mouseout", function () { // 마우스 아웃 이벤트
                d3.select(this).transition().duration(100).attr("opacity", 0.4); // opacity 원래대로

                tooltip.style("visibility", "hidden"); // 툴팁 가시성 설정
              }),
          (update) => update, // 업데이트 시 처리
          (exit) => exit.remove() // 제거 시 처리
        );

      g.selectAll(".last-month-pivot") // 지난달 데이터 포인트 추가
        .data(filteredDataLastMonth) // 지난달 데이터 바인딩
        .join(
          (enter) => // 새로운 데이터 포인트 추가
            enter
              
              .append("circle") // 원형 엘리먼트 추가
              .attr("class", "last-month-pivot") // 클래스명 설정
              .attr("r", 5) // 반지름 설정
              .attr("cx", (d) => // x축 값 설정
                x(
                  new Date(
                    new Date().getFullYear(), // 현재 연도
                    0, // 1월
                    1, // 1일
                    new Date(d.hour).getHours(), // 데이터의 시 값
                    new Date(d.hour).getMinutes() // 데이터의 분 값
                  )
                )
              )
              .attr("cy", (d) => y(d.last_month_population)) // y축 값 설정
              .attr("opacity", 0.4)
              .attr("fill", "#073B4C") // 채우기 색상 설정
              .on("mouseover", function (event, d) { // 마우스 오버 이벤트
                d3.select(this).transition().duration(100).attr("opacity", 1); // opacity 1로

                const hourValue = new Date(d.hour).getHours(); // 시 값
                const minuteValue = new Date(d.hour).getMinutes(); // 분 값

                tooltip
                  .html(
                    `<div>${hourValue}시 ${minuteValue}분</div>
                     <div>지난달: ${parseInt(d.last_month_population)}명</div>` // 툴팁 내용 설정
                  )
                  .style("visibility", "visible") // 툴팁 가시성 설정
                  .style("top", `${event.pageY - 300}px`) // 툴팁 위치 설정
                  .style("left", `${event.pageX - 300}px`);
              })
              .on("mousemove", function (event) { // 마우스 이동 이벤트
                tooltip
                  .style("top", `${event.pageY - 300}px`) // 툴팁 위치 설정
                  .style("left", `${event.pageX - 300}px`);
              })
              .on("mouseout", function () { // 마우스 아웃 이벤트
                d3.select(this).transition().duration(100).attr("opacity", 0.4); // opacity 원래대로

                tooltip.style("visibility", "hidden"); // 툴팁 가시성 설정
              }),
          (update) => update, // 업데이트 시 처리
          (exit) => exit.remove() // 제거 시 처리
        );

      const tooltip = d3 // 툴팁 설정
        .select(tooltipRef.current) // tooltipRef를 이용해 툴팁 엘리먼트 선택
        .style("position", "absolute") // 툴팁 위치 설정
        .style("z-index", "10") // z-index 설정
        .style("visibility", "hidden") // 초기 가시성 설정
        .style("background-color", "white") // 배경 색상 설정
        .style("border", "1px solid black") // 테두리 설정
        .style("padding", "10px") // 패딩 설정
        .style("font-family", "Pretendard") // 폰트 설정
        .style("font-size", "16px") // 폰트 크기 설정
        .style("font-weight", "regular") // 폰트 굵기 설정
        .style("width", "120px") // 너비 설정
        .style("height", "auto") // 높이 설정
        .style("line-height", "1.5") // 줄 간격 설정
        .style("overflow", "auto"); // 오버플로우 설정

      const legend = svg // 범례 설정
        .append("g") // 범례 그룹 추가
        .attr("transform", `translate(${width - 210}, 15)`); // 위치 설정

      const legendData = [ // 범례 데이터 설정
        { color: "#EF476F", text: "오늘" }, // 오늘 데이터
        { color: "#F2D89C", text: "어제" }, // 어제 데이터
        { color: "#3A9BBB", text: "지난주" }, // 지난주 데이터
        { color: "#073B4C", text: "지난달" }, // 지난달 데이터
      ];

      legend // 범례 사각형 설정
        .selectAll("rect") // 범례 사각형 선택
        .data(legendData) // 범례 데이터 바인딩
        .enter() // 새로운 데이터 포인트 추가
        .append("rect") // 사각형 엘리먼트 추가
        .attr("x", (d, i) => i * 80) // x축 위치 설정
        .attr("y", 0) // y축 위치 설정
        .attr("width", 18) // 너비 설정
        .attr("height", 18) // 높이 설정
        .style("fill", (d) => d.color); // 채우기 색상 설정

      legend // 범례 텍스트 설정
        .selectAll("text") // 범례 텍스트 선택
        .data(legendData) // 범례 데이터 바인딩
        .enter() // 새로운 데이터 포인트 추가
        .append("text") // 텍스트 엘리먼트 추가
        .attr("x", (d, i) => i * 80 + 24) // x축 위치 설정
        .attr("y", 9) // y축 위치 설정
        .attr("dy", "0.35em") // y축 위치 보정
        .style("font-family", "Pretendard") // 폰트 설정
        .style("font-size", "16px") // 폰트 크기 설정
        .text((d) => d.text); // 텍스트 설정
    };

    drawGraph(); // 그래프 그리기 함수 호출
    const handleResize = () => { // 창 크기 변경 이벤트 처리 함수
      drawGraph(); // 그래프 다시 그리기
    };

    window.addEventListener("resize", handleResize); // 창 크기 변경 이벤트 리스너 추가

    return () => {
      window.removeEventListener("resize", handleResize); // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    };
  }, [data]); // 데이터가 변경될 때마다 실행

  return (
    <div style={{ position: "relative" }}> 
      <svg ref={svgRef}></svg> 
      <div ref={tooltipRef}></div> 
    </div>
  );
};

export default LineGraph;
