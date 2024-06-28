import React, { useState } from "react";
import "./DatePick.css";

const DatePicker = ({ selectedDate, onDateChange }) => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  // 월별 날짜 수 계산
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (date) => {
    console.log("final date", date);
    onDateChange(date);
    setCalendarVisible(false);
  };

  // 현재 날짜 가져오기
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  };

  // 날짜 형식 변환
  const formatDate = (date) => {
    if (!date) return ""; // date가 undefined일 경우 빈 문자열 반환
    const [year, month, day] = date.split("-");
    return `${year}-${month.padStart(2, "0")}-${
      day ? day.padStart(2, "0") : ""
    }`;
  };

  // 월 변경 핸들러
  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  return (
    <div className="date-picker">
      <input
        type="text"
        className="datepick"
        value={selectedDate || formatDate(getCurrentDate())}
        onFocus={() => setCalendarVisible(true)}
        readOnly
      />

      {calendarVisible && (
        <div className="calendar">
          <div className="header">
            <button
              className="nav-button"
              onClick={() => handleMonthChange("prev")}
            >
              &lt;
            </button>
            {currentYear}-{String(currentMonth).padStart(2, "0")}
            <button
              className="nav-button"
              onClick={() => handleMonthChange("next")}
            >
              &gt;
            </button>
            <button
              className="close-button"
              onClick={() => setCalendarVisible(false)}
            >
              X
            </button>
          </div>
          <div className="days">
            {[...Array(daysInMonth).keys()].map((day) => (
              <div
                key={day + 1}
                className="day"
                onClick={() =>
                  handleDateSelect(
                    `${currentYear}-${String(currentMonth).padStart(
                      2,
                      "0"
                    )}-${String(day + 1).padStart(2, "0")}`
                  )
                }
              >
                {day + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
