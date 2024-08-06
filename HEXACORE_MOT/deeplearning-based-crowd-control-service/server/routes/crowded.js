const express = require('express'); // express 모듈을 불러옵니다.
const router = express.Router(); // express의 Router 객체를 생성합니다.
const AnalyzeInfo = require('../model/analyze_info'); // analyze_info 모델을 불러옵니다.
const { checkUserId , checkExhbId} = require('../model/check'); // check 모델에서 checkUserId와 checkExhbId 함수를 불러옵니다.
const logger = require('../logs/logger'); // logger 모듈을 불러옵니다.

// front에서 전시관 클릭시 전시관 id 받기
// 혼잡도 상위 5개
router.get('/', async (req, res) => { // '/' 경로로 GET 요청이 들어왔을 때 실행되는 비동기 함수입니다.
	logger.info('crowded router 요청'); // logger를 통해 "crowded router 요청" 로그를 남깁니다.

	try {
		logger.info('crowded router 시작'); // logger를 통해 "crowded router 시작" 로그를 남깁니다.

		const { userId, exhbId, date } = req.query; // 쿼리 파라미터에서 userId, exhbId, date를 추출합니다.

		// 현재 시간 부분만 추출
		const getCurrentTime = () => { // 현재 시간을 얻는 함수를 정의합니다.
			const now = new Date(); // 현재 시간을 나타내는 Date 객체를 생성합니다.
			// 현재 시각에서 1분을 뺀 시간을 얻기 위해 getTime() 메서드를 사용하여 현재 시각의 타임스탬프를 가져온 후,
			// 1분(60초)에 대한 밀리초(ms)를 뺍니다.
			const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000);

			// oneMinuteAgo 객체를 이용해서 원하는 포맷으로 시각을 표시합니다.
			// HH:mm:ss 형식으로 시각을 표시합니다.
			const formattedTime = `${oneMinuteAgo.getHours().toString().padStart(2, '0')}:${oneMinuteAgo.getMinutes().toString().padStart(2, '0')}:${oneMinuteAgo.getSeconds().toString().padStart(2, '0')}`;
			
			console.log('formatted',formattedTime); // 포맷된 시간을 콘솔에 출력합니다.
			return formattedTime; // 포맷된 시간을 반환합니다.

		};
		const time = getCurrentTime(); // 현재 시간(1분 전의 시간)을 변수 time에 저장합니다.
		
		
		console.log(date," date check"); // 쿼리 파라미터에서 추출한 date를 콘솔에 출력합니다.
		console.log(time," crowded time check1"); // 계산된 현재 시간을 콘솔에 출력합니다.

		if (!userId) { // userId가 존재하지 않는 경우
            logger.error('아이디가 입력되지 않았습니다'); // logger를 통해 "아이디가 입력되지 않았습니다" 로그를 남깁니다.
			return res.status(400).json({ error: 'ID is null' }); // 400 상태 코드와 함께 에러 메시지를 응답합니다.
		}

		// ID 검사 
		const userExists = await checkUserId(userId); // checkUserId 함수를 호출하여 userId의 존재 여부를 검사합니다.
		if (!userExists) { // userId가 존재하지 않는 경우
            logger.error(`User ID: ${userId} 가 존재하지 않습니다`); // logger를 통해 "User ID가 존재하지 않습니다" 로그를 남깁니다.
			return res.status(404).json({ error: '해당하는 사용자가 없습니다' }); // 404 상태 코드와 함께 에러 메시지를 응답합니다.
		}

		// 전시관 ID 검사
		const exhbExists = await checkExhbId(userId, exhbId); // checkExhbId 함수를 호출하여 exhbId의 존재 여부를 검사합니다.
		if (!exhbExists) { // exhbId가 존재하지 않는 경우
            logger.error(`Exhibition ID: ${exhbId}가 ${userId}에 존재하지 않습니다`); // logger를 통해 "Exhibition ID가 존재하지 않습니다" 로그를 남깁니다.
			return res.status(404).json({ error: '해당 전시관이 없습니다' }); // 404 상태 코드와 함께 에러 메시지를 응답합니다.
		}

		// DB에서 top5 정보 조회
        logger.info(`User ID: ${userId}, Exhibition ID: ${exhbId} 혼잡도 정보 DB 조회`); // logger를 통해 "혼잡도 정보 DB 조회" 로그를 남깁니다.
		const results = await new Promise((resolve, reject) => { // Promise 객체를 생성하여 비동기 작업을 처리합니다.
			AnalyzeInfo.topCrowded(userId, exhbId, date, time, (err, data) => { // AnalyzeInfo 모델의 topCrowded 함수를 호출하여 DB에서 정보를 조회합니다.
				if (err) { // 에러가 발생한 경우
                    logger.error('crowded db 에러', err); // logger를 통해 "crowded db 에러" 로그를 남깁니다.
					reject(err); // Promise를 reject합니다.
				} else { // 에러가 발생하지 않은 경우
					logger.info('현재 data', data); // logger를 통해 현재 data를 로그에 남깁니다.
					if(data.length >=1) { // 조회된 데이터가 1개 이상인 경우
						logger.info('crowded 성공'); // logger를 통해 "crowded 성공" 로그를 남깁니다.
						resolve(data); // Promise를 resolve합니다.
					}
					else { // 조회된 데이터가 없거나 길이가 0인 경우
						logger.info('crowded 데이터 없음 또는 길이가 0입니다'); // logger를 통해 "crowded 데이터 없음" 로그를 남깁니다.
                        resolve([]); // 빈 배열을 resolve합니다.
					}
				}
			});
		})
		
		res.json(results); // 조회된 결과를 JSON 형태로 응답합니다.
	}
	catch (error) { // 에러가 발생한 경우
        logger.error('crowded router 에러 :', error); // logger를 통해 "crowded router 에러" 로그를 남깁니다.
		return res.status(500).json({ error: 'Internal Server Error' }); // 500 상태 코드와 함께 에러 메시지를 응답합니다.
	}
});

module.exports = router; // router 객체를 모듈로 내보냅니다.
