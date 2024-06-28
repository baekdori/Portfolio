const pool = require("./db");

const User = {
	getAll: (callback) => {
		pool.query("SELECT * FROM user", callback);
	},
	getById: (userId, userPW, callback) => {
		// console.log(`Executing query with userId: ${userId}, userPW: ${userPW}`);
		pool.query(
			"SELECT user_id, com FROM user WHERE user_id = ? AND user_pw = ?",
			[userId, userPW],
			callback
		);
	},
	create: (userData, callback) => {
		pool.query("INSERT INTO user SET ?", userData, callback);
	},
	/** userID가 DB에 있는지 확인*/
	checkUserIdExists: (userId, callback) => {
		pool.query(`SELECT COUNT(*) as count FROM user WHERE user_id = ?`, [userId], (err, results) => {
			if (err) {
				return callback(err);
			}
			callback(null, results[0].count > 0);
		});
	},
};

module.exports = User;
