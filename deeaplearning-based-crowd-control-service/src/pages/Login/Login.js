import styles from "./Login.module.css";
import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import { useNavigate } from "react-router";

// 로그인 기능
const Login = () => {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [loginCheck, setLoginCheck] = useState(false); // 로그인 상태 체크

  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/user/login", {
        userID: userId,
        userPW: userPw,
      });

      console.log("Login response:", response);

      if (response.status === 200) {
        setLoginCheck(false);
        // 토큰을 로컬에 저장
        sessionStorage.setItem("userID", response.data[0].user_id);
        console.log(response.status);
        console.log("로그인 성공, userID : " + response.data[0].user_id);
        nav("/");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("아이디 또는 비밀번호를 확인해주세요.");
      } else {
        console.error("로그인 중 오류가 발생했습니다.", error);
        alert("로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <>
      <div className={styles.content}>
        <div className={styles.leftside}>DASHBOARD.com</div>

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin}>
          <div>
            <span className={styles.tit}>로그인</span>
            <label htmlFor="userId">아이디</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="userPw">비밀번호</label>
            <input
              type="password"
              id="userPw"
              value={userPw}
              onChange={(e) => setUserPw(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.btn}>
            Login
          </button>
          <span className={styles.notify}>
            계정에 대한 문의 또는 가입을 원하시나요?
          </span>
        </form>
      </div>
    </>
  );
};

export default Login;
