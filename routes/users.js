const express = require('express');
const router = express.Router();
const dbModule = require('../db');

router.post('/', async (req, res, next) => {
  try {
    const db = dbModule.get();
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const user = await db.get(
      'SELECT * FROM Users WHERE username = ?',
      username
    );

    if (user) {
      return res.status(422).json({ error: 'Username already exists' });
    }

    const { lastID } = await db.run(
      'INSERT INTO Users (username) VALUES (?)',
      username
    );

    res.json({ id: lastID, username });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const db = dbModule.get();
    const users = await db.all('SELECT * FROM Users');

    res.json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
