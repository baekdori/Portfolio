const express = require('express');
const User = require('../model/user');
const router = express.Router();

router.post('/', (req, res) => {
  const { userID, userPW } = req.body;

  if (!userID || !userPW) {
    return res.status(400).json({ error: 'userID and userPW are required' });
  }

  User.getById(userID, userPW, (err, results) => {
    if (err) {
      console.error('Error fetching user info:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid userID or userPW' });
    }
    
    req.session.userId = results[0].user_id;
    console.log('세션에 id값 저장', req.session.userId);
    
    res.json(results);
  });
});

module.exports = router;
