import React from "react";
import { FiPieChart, FiGrid } from "react-icons/fi";
import { IoStatsChart } from "react-icons/io5";
import styles from "./Sidebar.module.css";
import { MdOutlineEditNote } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { NavLink, Routes, useNavigate } from "react-router-dom";

const Sidebar = (props) => {
  const nav = useNavigate();
  const handleMenuCk = (props) => {
    console.log("menu ck", props);
    nav(`/${props}`);
  };

  // 메뉴 리스트

  return (
    <>
      <div className={styles.sidebar}>
        <button
          className={styles.box}
          menu="오늘의개요"
          onClick={() => {
            handleMenuCk("index");
          }}
        >
          <FiPieChart color="white" size={50} className={styles.icon} />
          <span className={styles.text}>오늘의 개요</span>
        </button>

        <button
          className={styles.box}
          onClick={() => {
            handleMenuCk("inside");
          }}
        >
          <FiGrid color="white" size={50} className={styles.icon} />
          <span className={styles.text}>실내혼잡도 확인</span>
        </button>

        <button
          className={styles.box}
          onClick={() => {
            handleMenuCk("detail");
          }}
        >
          <IoStatsChart color="white" size={50} className={styles.icon} />
          <span className={styles.text}>상세정보 확인</span>
        </button>

        <button
          className={styles.box}
          onClick={() => {
            handleMenuCk("future");
          }}
        >
          <MdOutlineEditNote color="white" size={50} className={styles.icon} />
          <span className={styles.text}>분석 보기</span>
        </button>

        <button
          className={styles.box}
          onClick={() => {
            handleMenuCk("notification");
          }}
        >
          <IoMdNotificationsOutline
            color="white"
            size={50}
            className={styles.icon}
          />
          <span className={styles.text}>알림 설정</span>
        </button>

        <button
          className={styles.box}
          onClick={() => {
            handleMenuCk("profile");
          }}
        >
          <div className={styles.profile}>
            <img
              alt="profile"
              src="https://i.namu.wiki/i/HmmZ7T3vGlrBfU-jcL3GqrdsHJ0Amjkoj_Og5U4Q-j8odCmpqdFOi2mUT66Tmz6-UX-ashFao-jst3jiCxBSow.webp"
              className={styles.photo}
            />
          </div>
        </button>

        <div className={styles.box}>
          <button
            className={styles.btn}
            type="button"
            onClick={() => {
              handleMenuCk("login");
            }}
          >
            로그인
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
