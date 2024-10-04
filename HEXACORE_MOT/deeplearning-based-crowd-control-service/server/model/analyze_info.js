// analyze_info.js
const pool = require('./db');

// 공통된 방문자 수 조회 로직을 처리하는 함수
const fetchVisitorData = (sqlQuery, params, callback) => {
	pool.query(sqlQuery, params, (err, results) => {
		if (err) {
			return callback(err);
		}
		callback(null, results);
	})
}
const AnalyzeInfo = {
    // 공통된 SQL 로직을 사용하는 함수들
    getById: (userId, callback) => {
        const sqlQuery = `
        SELECT e.exhb_id, SUM(a.population) AS total_population
        FROM analyze_info a
        JOIN zone z ON a.zone_id = z.zone_id
        JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
        WHERE e.user_id = ?
        AND a.time BETWEEN DATE_SUB(NOW(), INTERVAL 1 MINUTE) AND NOW()
        GROUP BY e.exhb_id;`;
        
        fetchVisitorData(sqlQuery, [userId], callback);
    },

    getByExhb: (userId, callback) => {
        const sqlQuery = `
        SELECT e.exhb_id,
            AVG(CASE WHEN HOUR(a.time) = HOUR(NOW()) AND DATE(a.time) = CURDATE() THEN a.population END) AS current_avg_population,
            AVG(CASE WHEN HOUR(a.time) = HOUR(NOW()) AND DATE(a.time) = CURDATE() - INTERVAL 1 DAY THEN a.population END) AS yesterday_avg_population,
            AVG(CASE WHEN HOUR(a.time) = HOUR(NOW()) AND DATE(a.time) = CURDATE() - INTERVAL 7 DAY THEN a.population END) AS last_week_avg_population,
            AVG(CASE WHEN HOUR(a.time) = HOUR(NOW()) AND DATE(a.time) = CURDATE() - INTERVAL 1 MONTH THEN a.population END) AS last_month_avg_population
        FROM analyze_info a
        JOIN zone z ON a.zone_id = z.zone_id
        JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
        WHERE e.user_id = ?
        GROUP BY e.exhb_id;`;

        fetchVisitorData(sqlQuery, [userId], callback);
    },

    getWeekAvg: (userId, callback) => {
        const sqlQuery = `
        SELECT 
        AVG(CASE WHEN a.time BETWEEN CURDATE() - INTERVAL 7 DAY AND NOW() THEN a.population END) AS this_week_avg_population,
        AVG(CASE WHEN a.time BETWEEN CURDATE() - INTERVAL 14 DAY AND CURDATE() - INTERVAL 7 DAY THEN a.population END) AS last_week_avg_population,
        AVG(CASE WHEN a.time BETWEEN CURDATE() - INTERVAL 1 MONTH AND NOW() THEN a.population END) AS last_month_avg_population
        FROM analyze_info a
        JOIN zone z ON a.zone_id = z.zone_id
        JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
        WHERE e.user_id = ?;`;

        fetchVisitorData(sqlQuery, [userId], callback);
    },

    getByTime: (userId, callback) => {
        const sqlQuery = `
        SELECT 
        DATE_FORMAT(a.time, '%Y-%m-%d %H:00:00') AS hour,
        SUM(a.population) AS total_population
        FROM analyze_info a
        JOIN zone z ON a.zone_id = z.zone_id
        JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
        WHERE e.user_id = ?
        AND a.time BETWEEN DATE_FORMAT(NOW(), '%Y-%m-%d 09:00:00') AND DATE_FORMAT(NOW(), '%Y-%m-%d 18:00:00')
        GROUP BY hour
        ORDER BY hour;`;

        fetchVisitorData(sqlQuery, [userId], callback);
    },

    topCrowded: (userId, exhbId, date, time, callback) => {
        const sqlQuery = `
        SELECT z.zone_id, zone_name,
            SUM(a.population) AS total_population
        FROM analyze_info a
        JOIN zone z ON a.zone_id = z.zone_id
        WHERE z.user_id = ?
        AND z.exhb_id =? 
        AND a.time BETWEEN STR_TO_DATE(CONCAT(?, ' ', ?), '%Y-%m-%d %H:%i:%s') 
        AND DATE_ADD(STR_TO_DATE(CONCAT(?, ' ', ?), '%Y-%m-%d %H:%i:%s'), INTERVAL 1 MINUTE)
        GROUP BY z.zone_id, z.zone_name
        ORDER BY total_population DESC;`;

        fetchVisitorData(sqlQuery, [userId, exhbId, date, time, date, time], callback);
    },
};

module.exports = AnalyzeInfo;

//1. 코드 중복 감소
// 공통된 DB 조회 로직을 하나의 함수(fetchVisitorData)로 모듈화함으로써, 각 기능별로 같은 구조의 코드를 반복해서 작성할 필요가 없어집니다. 이로 인해 코드의 길이가 줄어들고, 관리가 더 쉬워집니다.
// 여러 함수에서 SQL 쿼리를 제외한 다른 로직이 동일하므로, 이를 재사용하면 코드가 깔끔해지고 유지보수가 용이해집니다.
// 2. 유지보수 용이성
// DB 조회 로직에 변화가 필요할 때, 공통 함수인 fetchVisitorData만 수정하면 모든 조회 함수에 변화가 반영되기 때문에, 여러 곳에서 중복된 코드를 일일이 수정할 필요가 없습니다. 예를 들어, 데이터베이스 연결 로직이나 에러 처리 방식이 변경된다면, 해당 부분만 수정하여 전체 기능에 반영할 수 있습니다.
// SQL 쿼리를 변경해야 할 때도 개별 함수의 쿼리문만 수정하면 되기 때문에, 복잡한 비즈니스 로직을 처리할 때 실수 가능성을 줄여줍니다.
// 3. 가독성 향상
// 각 함수가 처리해야 하는 핵심 SQL 쿼리 로직만 남기고, 나머지 공통 작업은 fetchVisitorData에서 처리하므로, 함수 자체가 훨씬 더 간결하고 읽기 쉽게 됩니다. 이는 개발자가 코드의 목적을 빠르게 파악할 수 있도록 도와줍니다.
// 4. 일관된 에러 처리 및 로깅
// 공통 함수에서 에러 처리와 로깅을 일관되게 처리할 수 있습니다. 따라서 각 함수마다 에러 처리 로직을 작성할 필요가 없고, 에러가 발생했을 때 일관된 방식으로 핸들링할 수 있습니다.
// 에러나 쿼리 결과에 대한 로깅이 동일한 위치에서 이루어지므로, 문제 발생 시 디버깅이 더 수월해집니다.
// 5. 확장성 향상
// 새로운 조회 함수가 추가되더라도, 공통된 fetchVisitorData 함수를 재사용할 수 있기 때문에, 쉽게 확장할 수 있습니다. 즉, 새로운 SQL 쿼리와 조건만 추가하면 되기 때문에 코드의 확장성 또한 좋아집니다.
// 예를 들어, 새로운 통계나 데이터를 조회해야 할 때마다 기존의 공통 함수에 조건만 맞춰 추가하면 됩니다.
// 6. 테스트 용이성
// fetchVisitorData 함수 자체를 단위 테스트할 수 있기 때문에, 함수 하나만 충분히 테스트해도 여러 함수에서 발생할 수 있는 다양한 문제를 사전에 방지할 수 있습니다. 공통 로직을 테스트하여 그 로직을 사용하는 모든 함수의 신뢰성을 높일 수 있습니다.
// 7. 비즈니스 로직과 DB 접근 로직 분리
// 비즈니스 로직(어떤 데이터를 어떻게 조회할지)과 DB 접근 로직(데이터를 어떻게 가져오는지)을 분리하는 것이 가능해집니다. 이는 각 책임을 명확하게 분리해, 더 모듈화된 코드를 만들 수 있게 합니다. 즉, 데이터 조회는 SQL만 변경하면 되고, 나머지 로직은 변경 없이 재사용됩니다.
// 이와 같은 장점들로 인해, 코드 품질과 생산성 면에서 효율이 크게 향상됩니다.