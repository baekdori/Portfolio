const express = require('express');
const router = express.Router()
const Zone = require('../model/zone');
const { checkUserId, checkExhbId } = require('../model/check');
const logger = require('../logs/logger');

// 3페이지 구역별 체류 인원
router.get('/', async (req, res) => {
	logger.info('bywork router 요청');

	try {
		logger.info('bywork router 시작');

		const { userId, exhbId, date } = req.query;

		// 현재 시간 부분만 추출
		const getCurrentTime = () => {
			const now = new Date();
			return now.toTimeString().split(' ')[0];
		};
		const time = getCurrentTime();

		if (!userId || !exhbId || !date) {
            logger.error('bywork에서 아이디 또는 전시관 또는 날짜가 입력되지 않았습니다');
            return res.status(400).json({ error: 'userId 또는 exhbId 또는 date가 입력되지 않았습니다' });
        }
		
		// ID 검사 
		const userExists = await checkUserId(userId);
		if (!userExists) {
			logger.error(`User ID: ${userId} 가 존재하지 않습니다`);
			return res.status(404).json({ error: '해당하는 사용자가 없습니다' });
		}

		// 전시관 ID 검사
		const exhbExists = await checkExhbId(userId, exhbId);
		if (!exhbExists) {
			logger.error(`Exhibition ID: ${exhbId}가 ${userId}에 존재하지 않습니다`);
			return res.status(404).json({ error: '해당 전시관이 없습니다' });
		}

		// DB에서 구역별 정보 조회
		logger.info(`User ID: ${userId}, Exhibition ID: ${exhbId} 구역별 정보 DB 조회`);
		const results = await new Promise((resolve, reject) => {
			console.log(date, "Date check");
			Zone.peopleineachsection(userId, exhbId, date, time, (err, data) => {
				if (err) {
					logger.error('bywork db 에러', err);
					reject(err);
				} else {
					if(data.length >=1) {
						logger.info('bywork 성공');
						resolve(data);
					}
					else {
						logger.info('bywork 데이터 없음 또는 길이가 0입니다');
                        resolve([]);
					}
				}
			});
		})

		res.json(results);
	}
	catch (error) {
		logger.error('bywork router 에러 :', error);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;