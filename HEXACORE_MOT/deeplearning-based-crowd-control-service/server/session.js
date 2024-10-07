// session.js
const session = require('express-session');

module.exports = session({
  secret: 'Hexacore6!!', // 세션을 암호화하는 데 사용할 키
  resave: false,             // 세션을 강제로 저장할지 여부
  saveUninitialized: false,   // 초기화되지 않은 세션을 저장소에 저장할지 여부
  rolling : true, // 요청이 발생하면 세션 쿠키 만료 시간을 갱신
  cookie : {
    maxAge : null, // 세션 쿠기가 브라우저 창이 닫히면 만료
    secure: false,        // 개발 환경에서는 false로 설정 (HTTPS가 아니기 때문에)
    httpOnly: true        // 클라이언트 자바스크립트에서 쿠키 접근 불가
  }
});
