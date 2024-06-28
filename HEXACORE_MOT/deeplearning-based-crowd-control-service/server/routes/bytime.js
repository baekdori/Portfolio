const express = require('express');
const AnalyzeInfo = require('../model/analyze_info');
const { checkUserId } = require('../model/check');
const router = express.Router();
const logger = require('../logs/logger');

// 메인 페이지 개장시간부터 끝 시간 
router.get('/', async (req, res) => {
    logger.info('bytime router 요청');

    try {
        logger.info('bytime router 시작');

        const userId = req.query.userId;

        if (!userId) {
            logger.error('아이디가 입력되지 않았습니다');
            return res.status(400).json({ error: 'ID is null' });
        }

        // ID 검사
        const userExists = await checkUserId(userId);
        if (!userExists) {
            logger.error(`User ID: ${userId} 가 존재하지 않습니다`);
            return res.status(400).json({ error: '해당하는 사용자가 없습니다' });
        }

        // DB에서 시간별 정보 조회
        logger.info(`User ID: ${userId} 시간별 정보 DB 조회`);
        const results = await new Promise((resolve, reject) => {
            AnalyzeInfo.getByTime(userId, (err, data) => {
                if (err) {
                    logger.error('bytime db 에러', err);
                    reject(err);
                } else {
					if(data.length >=1) {
						logger.info('bytime 성공');
						resolve(data);
					}
					else {
						logger.info('bytime 데이터 없음 또는 길이가 0입니다');
                        resolve([]);
					}
				}
            });
        });

        res.json(results);
    }
    catch (error) {
        logger.error('bytime router 에러 :', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
