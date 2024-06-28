const express = require('express');
const router = express.Router()
const AnalyzeInfo = require('../model/analyze_info');
const { checkUserId , checkExhbId} = require('../model/check');
const logger = require('../logs/logger');

// front에서 전시관 클릭시 전시관 id 받기
// 혼잡도 상위 5개
router.get('/', async (req, res) => {
	logger.info('crowded router 요청');

	try {
		logger.info('crowded router 시작');

		const { userId, exhbId, date } = req.query;

		// 현재 시간 부분만 추출
		const getCurrentTime = () => {
			const now = new Date();
			// 현재 시각에서 5분을 뺀 시간을 얻기 위해 getTime() 메서드를 사용하여 현재 시각의 타임스탬프를 가져온 후,
			// 5분(300초)에 대한 밀리초(ms)를 빼 줍니다.
			const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000);

			// fiveMinutesAgo 객체를 이용해서 원하는 포맷으로 시각을 표시할 수 있습니다.
			// 예를 들어, HH:mm:ss 형식으로 시각을 표시하고자 한다면 다음과 같이 할 수 있습니다:
			const formattedTime = `${oneMinuteAgo.getHours().toString().padStart(2, '0')}:${oneMinuteAgo.getMinutes().toString().padStart(2, '0')}:${oneMinuteAgo.getSeconds().toString().padStart(2, '0')}`;
			
			console.log('formatted',formattedTime); // 출력 예: "15:25:00"
			return formattedTime;

		};
		const time = getCurrentTime();
		
		
		console.log(date," date check");
		console.log(time," crowded time check1");

		if (!userId) {
            logger.error('아이디가 입력되지 않았습니다');
			return res.status(400).json({ error: 'ID is null' });
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

		// DB에서 top5 정보 조회
        logger.info(`User ID: ${userId}, Exhibition ID: ${exhbId} 혼잡도 정보 DB 조회`);
		const results = await new Promise((resolve, reject) => {
			AnalyzeInfo.topCrowded(userId, exhbId, date, time, (err, data) => {
				if (err) {
                    logger.error('crowded db 에러', err);
					reject(err);
				} else {

					logger.info('현재 data', data)
					if(data.length >=1) {
						logger.info('crowded 성공');
						resolve(data);
					}
					else {
						logger.info('crowded 데이터 없음 또는 길이가 0입니다');
                        resolve([]);
					}
				}
			});
		})
		
		res.json(results);
	}
	catch (error) {
        logger.error('crowded router 에러 :', error);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;