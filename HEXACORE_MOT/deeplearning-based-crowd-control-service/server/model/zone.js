const pool = require('./db');

const Zone = {
	getAll: (callback) => {
		pool.query('SELECT * FROM zone', callback);
	},
	getById: (zoneId, callback) => {
		pool.query('SELECT * FROM zone WHERE zone_id = ?', [zoneId], callback);
	},
	create: (zoneData, callback) => {
		pool.query('INSERT INTO zone SET ?', zoneData, callback);
	},

	// 구역별 체류 인원,시간
	peopleineachsection: (userId, exhbId, date, time, callback) => {
		pool.query(`
			SELECT z.zone_name, COALESCE(a.population, 0) AS population, COALESCE(a.staying_time, 0) AS staying_time, a.time
			FROM zone z
			JOIN (
				SELECT zone_id, MAX(time) AS max_time
				FROM analyze_info
				WHERE DATE(time) = ? AND HOUR(time) = ?
				GROUP BY zone_id
			) AS latest_analyze ON z.zone_id = latest_analyze.zone_id
			JOIN analyze_info a ON a.zone_id = latest_analyze.zone_id AND a.time = latest_analyze.max_time
			JOIN exhibition e ON z.exhb_id = e.exhb_id
			WHERE z.user_id = ? AND e.exhb_id = ?;
		`, [date, time, userId, exhbId], callback);
	}


	// 기타 메서드들 추가 가능
};

module.exports = Zone;
