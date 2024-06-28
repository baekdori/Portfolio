const express = require('express');
const AnalyzeInfo = require('../model/analyze_info');
const { checkUserId } = require('../model/check');
const router = express.Router();
const logger = require('../logs/logger');

// todo 1전시관부터 4전시관까지 한번에 받아와야함
// ! ID는 세션값에 있으니깐 ID값으로 전체 전시관 조회하기
// 로그인 후 세션아이디 넘겨 받기

// 도넛차트 아래 동시간대 인원 평균
router.get('/', async (req, res) => {
    logger.info('sametime router 요청');

    try {
        logger.info('sametime router 시작');

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

        // DB에서 동시간대 정보 조회
        logger.info(`User ID: ${userId} 동시간대 정보 DB 조회`);
        const results = await new Promise((resolve, reject) => {
            AnalyzeInfo.getByExhb(userId, (err, data) => {
                if (err) {
                    logger.error('sametime db 에러', err);
                    reject(err);
                } else {
					if(data.length >=1) {
						logger.info('sametime 성공');
						resolve(data);
					}
					else {
						logger.info('sametime 데이터 없음 또는 길이가 0입니다');
                        resolve([]);
					}
				}
            });
        })

        res.json(results);
    }
    catch (error) {
        logger.error('sametime router 에러: ', error);
        return res.status(500).json({ error: 'Internal Server Error' });

    }
})

module.exports = router;