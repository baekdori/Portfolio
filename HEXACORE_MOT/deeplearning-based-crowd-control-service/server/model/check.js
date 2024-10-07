// check.js
// utils.js 파일에 저장된 함수
const User = require('./user');
const Exhibition = require('./exhibition');

/** userId 존재 여부 확인 함수 */
async function checkUserId(userId) {
    try {
        const userExists = await User.checkUserIdExists(userId);
        return userExists;
    } catch (error) {
        console.error("Error checking userId:", error);
        throw error; // 예외를 호출한 곳으로 전파
    }
}

/** exhbId가 존재 확인 함수*/ 
async function checkExhbId(userId, exhbId) {
    try {
        const exhbExists = await Exhibition.checkExhbIdExists(userId, exhbId);
        return exhbExists;
    } catch (error) {
        console.error("Error checking exhbId:", error);
        throw error;
    }
}
module.exports = {checkUserId, checkExhbId};
