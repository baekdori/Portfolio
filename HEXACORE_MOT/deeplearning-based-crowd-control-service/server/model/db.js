/** DB 연결 코드 */
const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'project-db-cgi.smhrd.com',
  /* db 호스트명 수정 */
  user: 'campus_23K_AI18_p3_1',
  port: '3307',
  password: 'smhrd1',
  database: 'campus_23K_AI18_p3_1'
});

// 풀에서 바로 쿼리를 실행할 수 있습니다.
pool.query('SELECT 1 + 1 AS solution', (error) => {
  if (error) throw error;
  console.log('연결 성공');
});

module.exports = pool;
