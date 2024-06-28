const express = require('express');
const User = require('../model/user');
const router = express.Router();
const logger = require('../logs/logger');

router.post('/', (req, res) => {
	logger.info('login router 요청');

	try {
		logger.info('login router 시작');

		const { userID, userPW } = req.body;

		if (!userID || !userPW) {
			logger.error('아이디 또는 비밀번호가 비었습니다');
			return res.status(400).json({ error: 'userID and userPW are required' });
		}

		User.getById(userID, userPW, (err, results) => {
			if (err) {
				logger.error('login db 에러:', err);
				return res.status(500).json({ error: 'Internal Server Error' });
			}

			if (results.length === 0) {
				logger.error('유효하지 않은 ID 또는 PW입니다.');
				return res.status(401).json({ error: 'Invalid userID or userPW' });
			}

			req.session.userId = results[0].user_id;
			logger.info('로그인에 성공했습니다.');
			res.json(results);
		});
	} catch (error) {
		// Catch any unexpected errors
		logger.error('에러 입니다:', error);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;
