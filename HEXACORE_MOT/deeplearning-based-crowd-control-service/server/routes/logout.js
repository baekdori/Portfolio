const express = require("express");
const router = express.Router();
const logger = require('../logs/logger');

router.get("/", function (req, res) {
	logger.info('logout router 요청');
	// 세션 삭제
	if (req.session) {
		logger.info('logout router 실행');
		req.session.destroy((err) => {
			if (err) {
				logger.error('logout 에러');
				return res.status(500).send("Internal Server Error");
			}
			// 세션 쿠키 삭제
			res.clearCookie("connect.sid", { path: "/" });

			return res.status(200).send("Logout successful");
		});
	} else {
		logger.error('세션이 존재하지 않습니다. 로그아웃할 수 없습니다.');
		return res.status(200).send("Already logged out");
	}
});

module.exports = router;
