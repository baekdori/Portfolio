const pool = require('./db');

const Exhibition = {
	getAll: (callback) => {
		pool.query('SELECT * FROM exhibition', callback);
	},
	getById: (userId, callback) => {
		pool.query('SELECT * FROM exhibition WHERE user_id = ?', [userId], callback);
	},
	create: (exhibitionData, callback) => {
		pool.query('INSERT INTO exhibition SET ?', exhibitionData, callback);
	},
	/** 이번주 평균 일별로 조회 */
	thisWeek: (userId, callback) => {
		pool.query(`
		SELECT 
		DATE_FORMAT(a.time, '%Y-%m-%d') AS day,
		AVG(a.population) AS avg_population
		FROM analyze_info a
		JOIN zone z ON a.zone_id = z.zone_id
		JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
		WHERE e.user_id = ?
		AND a.time BETWEEN DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-%d 09:00:00'), INTERVAL 1 WEEK) AND DATE_FORMAT(NOW(), '%Y-%m-%d 18:00:00')
		GROUP BY day
		ORDER BY day;`, [userId], callback);
	},

	/** 지난주 평균 일별로 조회 */
	lastWeek: (userId, callback) => {
		pool.query(`
		SELECT 
		DATE_FORMAT(a.time, '%Y-%m-%d') AS day,
		AVG(a.population) AS avg_population
		FROM analyze_info a
		JOIN zone z ON a.zone_id = z.zone_id
		JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
		WHERE e.user_id = ?
		AND a.time BETWEEN DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-%d 09:00:00'), INTERVAL 2 WEEK) AND DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-%d 18:00:00'), INTERVAL 1 WEEK)
		GROUP BY day
		ORDER BY day;`, [userId], callback);
	},

	/** 평균 관람객 추이 */
	getByDate: (userId, exhbId, startTime, endTime, callback) => {
		pool.query(`
		SELECT e.exhb_id,
		DATE_FORMAT(a.time, '%Y-%m-%d %H:00:00') AS hour,
		AVG(CASE WHEN a.time BETWEEN ? AND ? THEN a.population END) AS current_population,
		AVG(CASE WHEN a.time BETWEEN DATE_SUB(?, INTERVAL 1 DAY) AND DATE_SUB(?, INTERVAL 1 DAY) THEN a.population END) AS yesterday_population,
		AVG(CASE WHEN a.time BETWEEN DATE_SUB(?, INTERVAL 1 WEEK) AND DATE_SUB(?, INTERVAL 1 WEEK) THEN a.population END) AS last_week_population,
		AVG(CASE WHEN a.time BETWEEN DATE_SUB(?, INTERVAL 1 MONTH) AND DATE_SUB(?, INTERVAL 1 MONTH) THEN a.population END) AS last_month_population
		FROM analyze_info a
		JOIN zone z ON a.zone_id = z.zone_id
		JOIN exhibition e ON z.user_id = e.user_id
		AND z.exhb_id = e.exhb_id
		WHERE e.user_id = ? AND e.exhb_id = ?
		GROUP BY e.exhb_id, hour
		HAVING
		current_population IS NOT NULL
		OR yesterday_population IS NOT NULL
		OR last_week_population IS NOT NULL
		OR last_month_population IS NOT NULL
		ORDER BY hour DESC;`,
			[
				startTime, endTime,
				startTime, endTime,
				startTime, endTime,
				startTime, endTime,
				userId, exhbId,
			], callback);
	},

	

	/** 성별 정보*/
	// ! 날짜를 입력받아 그 날짜의 누적 정보
	getByGender: (userId, exhbId, date, callback) => {
		pool.query(`
		SELECT e.exhb_id, 
    	SUM(a.man_cnt) AS man_cnt_sum, 
    	SUM(a.woman_cnt) AS woman_cnt_sum
		FROM analyze_info a
		JOIN zone z ON a.zone_id = z.zone_id
		JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
		WHERE e.user_id = ? AND e.exhb_id = ?
		AND DATE(a.time) = ?`, [userId, exhbId, date], callback);
	},


	/** 연령별 정보*/
	// ! 오늘 자정부터 현재 시간까지 누적 되게
	getByAge: (userId, exhbId, date, callback) => {
		pool.query(`
			SELECT e.exhb_id,
			SUM(a.child_man) AS sum_child_man, 
			SUM(a.teen_man) AS sum_teen_man, 
			SUM(a.youth_man) AS sum_youth_man, 
			SUM(a.middle_man) AS sum_middle_man, 
			SUM(a.old_man) AS sum_old_man, 
			SUM(a.child_woman) AS sum_child_woman, 
			SUM(a.teen_woman) AS sum_teen_woman, 
			SUM(a.youth_woman) AS sum_youth_woman, 
			SUM(a.middle_woman) AS sum_middle_woman, 
			SUM(a.old_woman) AS sum_old_woman
			FROM analyze_info a
			JOIN zone z ON a.zone_id = z.zone_id
			JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
			WHERE e.user_id = ? AND e.exhb_id = ?
			AND DATE(a.time) = ?
		`, [userId, exhbId, date], callback);
	},

	checkExhbIdExists: (userId, exhbId, callback) => {
		pool.query(
			'SELECT COUNT(*) as count FROM exhibition WHERE user_id = ? AND exhb_id = ?',
			[userId, exhbId],
			(err, results) => {
				if (err) {
					return callback(err);
				}
				callback(null, results[0].count > 0);
			}
		);
	},
	/** 구역별 평균체류 시간, 인원 조회 */
	getByWork: (userId, exhbId, callback) => {
		pool.query(`
		SELECT sum(ai.population),
		z.zone_name,
		AVG(ai.staying_time) as avg_time
		FROM
		analyze_info ai
		JOIN zone z ON ai.zone_id = z.zone_id
		JOIN exhibition e ON z.user_id = e.user_id
		AND z.exhb_id = e.exhb_id
		WHERE
		e.user_id = ?
		AND e.exhb_id = ?
		AND ai.time BETWEEN DATE_SUB(NOW(), INTERVAL 5 MINUTE) AND NOW()
		AND ai.staying_time is not NULL
		GROUP BY 
		ai.zone_id,
		z.zone_name;`, [userId, exhbId], callback);
	}
};

module.exports = Exhibition;
