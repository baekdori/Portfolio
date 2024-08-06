import React, { useEffect, useState } from "react";
import { FiPieChart, FiGrid } from "react-icons/fi";
import { IoStatsChart } from "react-icons/io5";
import { MdOutlineEditNote } from "react-icons/md";
import styles from "./Sidebar.module.css";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = (props) => {
  const location = useLocation(); // useLocation을 컴포넌트 내부에서 호출합니다.
  const [activePath, setActivePath] = useState("");

  const nav = useNavigate();

  useEffect(() => {
    // 현재 경로를 초기 활성화 경로로 설정합니다.
    const path = location.pathname.slice(1) || "index";
    setActivePath(path);
  }, [location.pathname]);

  const handleMenuClick = (path) => {
    setActivePath(path);
    nav(`/${path}`, { state: { userId: sessionStorage.getItem("userID") } });
  };

  const isLogged = location.state?.userId;

  const handleLogout = () => {
    sessionStorage.clear();
    nav("/", { state: null });
  };

  const getIconColor = (path) => {
    return activePath === path ? "black" : "white";
  };

  return (
    <div className={styles.sidebar}>
      <button
        className={`${styles.box} ${activePath === "index" ? styles.active : ""}`}
        onClick={() => handleMenuClick("index")}
      >
        <FiPieChart size={50} color={getIconColor("index")} className={styles.icon} />
        <span className={styles.text}>요약 정보</span>
      </button>

      <button
        className={`${styles.box} ${activePath === "inside" ? styles.active : ""}`}
        onClick={() => handleMenuClick("inside")}
      >
        <FiGrid size={50} color={getIconColor("inside")} className={styles.icon} />
        <span className={styles.text}>혼잡도 현황</span>
      </button>

      <button
        className={`${styles.box} ${activePath === "detail" ? styles.active : ""}`}
        onClick={() => handleMenuClick("detail")}
      >
        <IoStatsChart size={50} color={getIconColor("detail")} className={styles.icon} />
        <span className={styles.text}>분석 정보</span>
      </button>

      <button
        className={`${styles.box} ${activePath === "future" ? styles.active : ""}`}
        onClick={() => handleMenuClick("future")}
      >
        <MdOutlineEditNote size={50} color={getIconColor("future")} className={styles.icon} />
        <span className={styles.text}>예측 정보</span>
      </button>

      {isLogged == null ? (
        <div className={styles.box}>
          <button
            className={styles.box}
            type="button"
            onClick={() => nav("/login")}
          >
            로그인
          </button>
        </div>
      ) : (
        <div className={styles.box}>
          <button
            className={styles.btn}
            type="button"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
