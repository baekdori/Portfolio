const express = require('express');
const Exhibition = require('../model/exhibition');
const { checkUserId } = require('../model/check');
const router = express.Router();
const logger = require('../logs/logger');

// 메인페이지 지난주 정보 조회
router.get('/', async (req, res) => {
    logger.info('lastweek router 요청');

    try {
        logger.info('lastweek router 시작');

        const userId = req.query.userId;

        if (!userId) {
            logger.error('아이디가 입력되지 않았습니다');
            return res.status(400).json({ error: 'userId is null' });
        }

        // ID 검사
        const userExists = await checkUserId(userId);
        if (!userExists) {
            logger.error(`User ID: ${userId} 가 존재하지 않습니다`);
            return res.status(404).json({ error: '해당하는 사용자가 없습니다' });
        }

        // DB에서 지난주 정보 조회
        logger.info(`User ID: ${userId} 지난주 정보 DB 조회`);
        const results = await new Promise((resolve, reject) => {
            Exhibition.lastWeek(userId, (err, data) => {
                if (err) {
                    logger.error('lastweek db 에러', err);
                    reject(err);
                } else {
					if(data.length >=1) {
						logger.info('lastweek 성공');
						resolve(data);
					}
					else {
						logger.info('lastweek 데이터 없음 또는 길이가 0입니다');
                        resolve([]);
					}
				}
            });
        })


        res.json(results);
    }
    catch (error) {
        logger.error('lastweek router 에러: ', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
