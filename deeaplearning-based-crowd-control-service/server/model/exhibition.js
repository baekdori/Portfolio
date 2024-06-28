const connection = require('./db');

const Exhibition = {
  getAll: (callback) => {
    connection.query('SELECT * FROM exhibition', callback);
  },
  getById: (userId, exhbId, callback) => {
    connection.query('SELECT * FROM exhibition WHERE user_id = ? AND exhb_id = ?', [userId, exhbId], callback);
  },
  create: (exhibitionData, callback) => {
    connection.query('INSERT INTO exhibition SET ?', exhibitionData, callback);
  },
  // 기타 메서드들 추가 가능
};

module.exports = Exhibition;
