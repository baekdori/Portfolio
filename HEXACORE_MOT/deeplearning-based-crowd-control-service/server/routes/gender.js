const express = require('express');
const router = express.Router();
const Exhibition = require('../model/exhibition');
const { checkUserId, checkExhbId } = require('../model/check');
const logger = require('../logs/logger');

// 성별 정보 
router.get('/', async (req, res) => {
    logger.info('bygender router 요청');

    try {
        logger.info('bygender router 시작');

        const { userId, exhbId, date } = req.query;

        if (!userId || !exhbId || !date) {
            logger.error('byage 에서 아이디 또는 전시관 또는 날짜가 입력되지 않았습니다');
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

        // DB에서 성별 정보 조회
        logger.info(`User ID: ${userId}, Exhibition ID: ${exhbId} 성별 정보 DB 조회`);
        const results = await new Promise((resolve, reject) => {
            Exhibition.getByGender(userId, exhbId, date, (err, data) => {
                if (err) {
                    logger.error('bygender db 에러', err);
                    reject(err);
                } else {
					if(data.length >=1) {
						logger.info('bygender 성공');
						resolve(data);
					}
					else {
						logger.info('bygender 데이터 없음 또는 길이가 0입니다');
                        resolve([]);
					}
				}
            });
        })
        console.log(results);
        res.json(results);
    }
    catch (error) {
        logger.error('bygender router 에러 :', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;