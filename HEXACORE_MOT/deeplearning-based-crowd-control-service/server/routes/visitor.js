const express = require("express");
const Exhibition = require("../model/exhibition");
const { checkUserId, checkExhbId } = require("../model/check");
const router = express.Router();
const logger = require("../logs/logger");

// 관람객 평균 추이
router.get("/", async (req, res) => {
  logger.info("visitor router 요청");
  try {
    logger.info("visitor router 시작");

    const { userId, exhbId, date } = req.query; // 클라이언트에서 전달하는 date 파라미터를 받음
    const startTime = `${date} 09:00:00`;
    const endTime = `${date} 18:00:00`;

    if (!userId || !exhbId) {
      logger.error("아이디 또는 전시관이 입력되지 않았습니다");
      return res.status(400).json({ error: "userId or exhbId is null" });
    }

    // ID 검사
    const userExists = await checkUserId(userId);
    if (!userExists) {
      logger.error(`User ID: ${userId} 가 존재하지 않습니다`);
      return res.status(404).json({ error: "해당하는 사용자가 없습니다" });
    }

    // 전시관 ID 검사
    const exhbExists = await checkExhbId(userId, exhbId);
    if (!exhbExists) {
      logger.error(`Exhibition ID: ${exhbId}가 ${userId}에 존재하지 않습니다`);
      return res.status(404).json({ error: "해당 전시관이 없습니다" });
    }

    // DB에서 평균 방문객 정보 조회
    logger.info(
      `User ID: ${userId}, Exhibition ID: ${exhbId} 평균 방문객 정보 DB 조회`
    );
    const results = await new Promise((resolve, reject) => {
      Exhibition.getByDate(userId, exhbId, startTime, endTime, (err, data) => {
        if (err) {
          logger.error("visitor db 에러", err);
          reject(err);
        } else {
          if (data.length >= 1) {
            logger.info("visitor 성공");
            console.log(data);
            resolve(data);
          } else {
            logger.info("visitor 데이터 없음 또는 길이가 0입니다");
            resolve([]);
          }
        }
      });
    });

    res.json(results);
  } catch (error) {
    logger.error("visitor router 에러: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
