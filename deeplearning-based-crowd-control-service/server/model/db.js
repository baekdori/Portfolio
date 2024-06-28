/** DB 연결 코드 */
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'project-db-campus.smhrd.com',
  user: 'campus_23K_AI18_p3_1',
  port: '3307',
  password: 'smhrd1',
  database: 'campus_23K_AI18_p3_1'
});

connection.connect((err) => {
  if (err) {
    console.error('연결 실패: ', err.stack);
    return;
  }
  console.log('연결 성공');
});

module.exports = connection;
