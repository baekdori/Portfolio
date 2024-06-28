// utils.js 파일에 저장된 함수
const User = require('./user');
const Exhibition = require('./exhibition');

/** userId 존재 여부 확인 함수 */
async function checkUserId(userId) {
    try {
        const userExists = await new Promise((resolve, reject) => {
            User.checkUserIdExists(userId, (err, exists) => {
                if (err) {
                    console.error("userId 확인 중 오류 발생:", err);
                    reject(err);
                } else {
                    resolve(exists);
                }
            });
        });
        return userExists;
    } catch (error) {
        console.error("userId 확인 중 오류 발생:", error);
        throw error; // 예외를 호출한 곳으로 전파
    }
}

/** exhbId가 존재 확인 함수*/ 
async function checkExhbId(userId,exhbId) {
    try {
        const exhbExists = await new Promise((resolve, reject) => {
            Exhibition.checkExhbIdExists(userId, exhbId, (err, exists) => {
                if (err) {
                    console.error("exhbId 확인 중 오류 발생:", err);
                    reject(err);
                } else {
                    resolve(exists);
                }
            });
        });
        return exhbExists;
    }
    catch (error) {
        console.error("exhbId 확인 중 오류 발생", error);
        throw error;
    }
}

module.exports = {checkUserId, checkExhbId};
