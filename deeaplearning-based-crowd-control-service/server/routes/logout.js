const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    // 세션 삭제
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          console.error("세션 삭제 중 에러 발생:", err);
          return res.status(500).send("Internal Server Error");
        }
        // 세션 쿠키 삭제
        res.clearCookie('connect.sid', { path: '/' });
        console.log("로그아웃");
        res.redirect("http://localhost:3000/login");
      });
    } else {
      res.send("<h1>이미 로그아웃 상태이거나 세션이 존재하지 않습니다.</h1>");
    }
  });

  module.exports = router;
