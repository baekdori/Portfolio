import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import styles from "./DougnutChart.module.css";

const DoughnutChart = ({ doughnutdata, exhibition, yesterday, week, month }) => {
  const getColor = (value) => {
    if (value <= 25) return "#10A400"; 
    if (value <= 50) return "#FFC300"; 
    if (value <= 75) return "#FF6B00"; 
    return "#FF0000"; 
  };

  const handleNaN = (value) => {
    return isNaN(value) ? 0 : value;
  };
  
 
  const [chartData, setChartData] = useState({
    
  
    series: [0],
    options: {
      chart: {
        height: 350,
        type: "radialBar",
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "60%",
          },
          dataLabels: {
            name: {
              show: true,
            },
            value: {
              show: true,
              fontSize: "30px",
              formatter: function (val) {
                return val + "%";
              },
            },
            total: {
              show: true,
              label: exhibition,
              fontSize: "20px",
            },
          },
        },
      },
      labels: ["Cricket"],
      states: {
        active: {
          filter: {
            type: 'none' /* none, lighten, darken */
          }
        },
        hover: {
          filter: {
              type: 'none',
          }
      },
      },
    },
  });

  useEffect(() => {
    if (doughnutdata !== undefined && doughnutdata !== null) {
    // doughnutdata prop이 변경될 때마다 실행됨
    const percent = isNaN(parseInt(doughnutdata)) ? 0 : parseInt(doughnutdata);
    const color = getColor(percent);

    setChartData(prevState => ({
      ...prevState,
      series: [percent],
       // persent 값을 series에 반영
       options: {
        ...prevState.options,
        colors: [color],
      },
    }));
  }else {
    setChartData((prevState) => ({
      series: [0],
      options: {
        ...prevState.options,
        colors: ["#808080"], // Default color (gray)
      },
    }));
  }
  }, [doughnutdata]); // doughnutdata prop을 의존성 배열에 추가




  return (
    <div>
      <div id="dchart1">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="radialBar"
          height={299}
        />
      </div>
      <div id="html-dist1"></div>
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