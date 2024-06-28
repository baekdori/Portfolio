const express = require('express');
const AnalyzeInfo = require('../model/analyze_info');
const { checkUserId, checkExhbId } = require('../model/check');
const router = express.Router();
const logger = require('../logs/logger');

// 히트맵 정보
router.get('/', async (req, res) => {
    logger.info('heatmap router 요청');

    try {
        logger.info('heatmap router 시작');

        const { userId, exhbId } = req.query;
        let today = new Date();
        today.setMinutes(today.getMinutes() - 1); // 현재 시간에서 1분을 뺍니다.

        let year = today.getFullYear();
        let month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
        let day = String(today.getDate()).padStart(2, '0');
        let hours = String(today.getHours()).padStart(2, '0');
        let minutes = String(today.getMinutes()).padStart(2, '0');
        let seconds = String(today.getSeconds()).padStart(2, '0'); // 초까지 추가

        const time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        
        if (!userId || !exhbId) {
            logger.error('아이디 또는 전시관이 입력되지 않았습니다');
            return res.status(400).json({ error: 'userId or exhbId is null' });
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

        // DB에서 히트맵 정보 조회
        logger.info(`User ID: ${userId}, Exhibition ID: ${exhbId} 히트맵 정보 DB 조회`);
        const results = await new Promise((resolve, reject) => {
            console.log(time, "time");
            AnalyzeInfo.getByZone(userId, exhbId, time, (err, data) => {
                if (err) {
                    logger.error('heatmap db 에러', err);
                    reject(err);
                } else {
					if(data.length >=1) {
						logger.info('heatmap 성공');
						resolve(data);
					}
					else {
						logger.info('heatmap 데이터 없음 또는 길이가 0입니다');
                        resolve([]);
					}
				}
            });
        })

        res.json(results);
    }
    catch (error) {
        logger.error('heatmap router 에러 :', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;