import React, { act, useEffect, useRef, useState } from "react";
import { FiPieChart, FiGrid } from "react-icons/fi";
import { IoStatsChart } from "react-icons/io5";
import styles from "./Sidebar.module.css";
import { MdOutlineEditNote } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { color } from "d3";

const Sidebar = (props) => {
  // console.log(
  //   "sessionStorage.getItem('userID')",
  //   sessionStorage.getItem("userID")
  // ); // user1

  const nav = useNavigate();
  const location = useLocation();

  // 메뉴 리스트

  const handleMenuCk = (props) => {
    console.log("menu ck", props);
    nav(`/${props}`, { state: { userId: sessionStorage.getItem("userID") } });
  };

  // console.log("location.state.userId", sessionStorage.getItem("userID"));
  let isLogged = location.state == null ? null : location.state.userId;

  const handleLogout = () => {
    console.log("Logout ck");
    sessionStorage.clear();

    isLogged = null;
    console.log(
      "sessionStorage.getItem('userID')",
      sessionStorage.getItem("user_id")
    ); //null
    nav("/", { state: null });
  };

  return (
    <>
      <div className={styles.sidebar}>
        <button
          className={styles.box}
          menu="요약정보"
          onClick={() => {
            handleMenuCk("index");
          }}
        >
          <FiPieChart color="white" size={50} className={styles.icon} />
          <span className={styles.text}>요약 정보</span>
        </button>
        <button
          className={styles.box}
          onClick={() => {
            handleMenuCk("inside");
          }}
        >
          <FiGrid color="white" size={50} className={styles.icon} />
          <span className={styles.text}>혼잡도 현황</span>
        </button>
        <button
          className={styles.box}
          onClick={() => {
            handleMenuCk("detail");
          }}
        >
          <IoStatsChart color="white" size={50} className={styles.icon} />
          <span className={styles.text}>분석 정보</span>
        </button>
        <button
          className={styles.box}
          onClick={() => {
            handleMenuCk("future");
          }}
        >
          <MdOutlineEditNote color="white" size={50} className={styles.icon} />
          <span className={styles.text}>예측 정보</span>
        </button>

        {sessionStorage.getItem("userID") == null ? (
          <div className={styles.box}>
            <button
              className={styles.box}
              type="button"
              onClick={() => {
                nav("/login");
              }}
            >
              로그인
            </button>
          </div>
        ) : (
          <div className={styles.box}>
            <button
              className={styles.btn}
              type="button"
              onClick={() => {
                handleLogout();
              }}
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
