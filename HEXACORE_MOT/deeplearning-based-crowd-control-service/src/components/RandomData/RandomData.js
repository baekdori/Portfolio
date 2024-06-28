const express = require('express');
const mysql = require('mysql2');
const moment = require('moment-timezone');
const app = express();

const connection = mysql.createConnection({
    host: 'project-db-cgi.smhrd.com',
    user: 'campus_23K_AI18_p3_1',
    port: '3307',
    password: 'smhrd1',
    database: 'campus_23K_AI18_p3_1'
});

// 연결 시작
connection.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});
// const startTime = moment.tz(`${date} 09:00:00`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Seoul'); // 시작 시간 설정
// const endTime = moment.tz(`${date} 18:00:00`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Seoul'); // 종료 시간 설정

app.get('/insertData', (req, res) => {
    const date = req.query.date;
    const startTime = moment.tz('2024-06-19 09:00:00', 'YYYY-MM-DD HH:mm:ss', 'Asia/Seoul'); // 시작 시간 설정
    const endTime = moment.tz('2024-06-19 18:00:00', 'YYYY-MM-DD HH:mm:ss', 'Asia/Seoul'); // 종료 시간 설정
    const interval = 30 * 1000; // 60 seconds interval

    let currentTime = moment(startTime);
    const insertQueries = [];
    
    while (currentTime <= endTime) {
        const formattedTime = currentTime.format('YYYY-MM-DD HH:mm:ss');

        // 예시: analyze_info 테이블에 데이터 삽입 쿼리 생성
        const query = `INSERT INTO analyze_info (zone_id, population, time, man_cnt, woman_cnt, child_man, teen_man, youth_man, middle_man, old_man, child_woman, teen_woman, youth_woman, middle_woman, old_woman, staying_time) VALUES
                       (${getRandomZone()}, ${getRandomPopulation()}, "${formattedTime}", ${getRandomCount()}, ${getRandomCount()}, ${getRandomCount()}, ${getRandomCount()}, ${getRandomCount()}, ${getRandomCount()}, ${getRandomCount()}, ${getRandomCount()}, ${getRandomCount()}, ${getRandomCount()}, ${getRandomCount()}, ${getRandomCount()}, ${getRandomTime()})`;

        insertQueries.push({ query, formattedTime }); // 쿼리와 시간을 객체로 추가
        currentTime.add(interval, 'milliseconds'); // 다음 시간으로 설정
    }
    
    // 모든 쿼리를 순차적으로 실행
    insertQueries.forEach(item => {
        connection.query(item.query, (err, results) => {
            if (err) throw err;
            console.log(`Inserted data for ${item.formattedTime}`);
        });
    });

    res.send('Data insertion complete');
});

// 랜덤 인원수 및 인원 구성을 생성하는 함수
function getRandomPopulation() {
    return Math.floor(Math.random() * 10) + 10;
}

function getRandomZone() {
    return Math.floor(Math.random() * 13) + 4; // 1부터 16까지의 랜덤값
}

// function getRandomZone() {
//     return Math.floor(Math.random() * (32 - 17 + 1)) + 17;
// }
function getRandomCount() {
    return Math.floor(Math.random() * 3) ;
}
function getRandomTime() {
    return Math.floor(Math.random() * 1200)+1;
}
// 서버 시작
const port = 4002;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
