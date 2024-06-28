const connection = require('./db');

const Zone = {
  getAll: (callback) => {
    connection.query('SELECT * FROM zone', callback);
  },
  getById: (zoneId, callback) => {
    connection.query('SELECT * FROM zone WHERE zone_id = ?', [zoneId], callback);
  },
  create: (zoneData, callback) => {
    connection.query('INSERT INTO zone SET ?', zoneData, callback);
  },
  // 기타 메서드들 추가 가능
};

module.exports = Zone;
