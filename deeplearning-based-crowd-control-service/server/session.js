const session = require('express-session');

module.exports = session({
  secret: 'Hexacore6!!', // 세션을 암호화하는 데 사용할 키
  resave: false,             // 세션을 강제로 저장할지 여부
  saveUninitialized: false   // 초기화되지 않은 세션을 저장소에 저장할지 여부
});
