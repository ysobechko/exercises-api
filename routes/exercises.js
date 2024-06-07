const express = require('express');

const dbModule = require('../db');
const { validateDate, validateDateRange } = require('../utils/date');

const router = express.Router();

router.post('/:_id/exercises', async (req, res) => {
  try {
    const db = dbModule.get();
    const { description, duration, date } = req.body;
    const user = await db.get(
      'SELECT * FROM Users WHERE id = ?',
      req.params._id
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!description || typeof description !== 'string') {
      return res
        .status(400)
        .json({ error: 'Description is required and should be a string' });
    }

    const durationInt = parseInt(duration);

    if (isNaN(durationInt) || durationInt <= 0) {
      return res
        .status(400)
        .json({ error: 'Duration should be a positive number' });
    }

    if (date && !validateDate(date)) {
      return res
        .status(400)
        .json({ error: 'Exercise date should be a valid date in the format YYYY-MM-DD' });
    }

    const exerciseDate = date || new Date().toISOString().slice(0, 10);
    const { lastID } = await db.run(
      'INSERT INTO Exercises (userId, description, duration, date) VALUES (?, ?, ?, ?)',
      req.params._id,
      description,
      duration,
      exerciseDate
    );
    res.json({
      userId: req.params._id,
      exerciseId: lastID,
      description,
      duration,
      date: exerciseDate,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:_id/logs', async (req, res, next) => {
  try {
    const db = dbModule.get();
    const userId = req.params._id;
    const { from, to, limit } = req.query;

    let user = await db.get('SELECT * FROM Users WHERE id = ?', userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let query =
      'SELECT id, description, duration, date FROM Exercises WHERE userId = ?';
    let params = [userId];

    if (from) {
      if (!validateDate(from)) {
        return res
          .status(400)
          .json({ error: 'From should be a valid date in the format YYYY-MM-DD' });
      }
      query += ' AND date >= ?';
      params.push(from);
    }

    if (to) {
      if (!validateDate(to)) {
        return res
          .status(400)
          .json({ error: 'To should be a valid date in the format YYYY-MM-DD' });
      }
      query += ' AND date <= ?';
      params.push(to);
    }

    if (from && to && !validateDateRange(from, to)) {
      return res
        .status(400)
        .json({ error: 'From date should be before to date' });
    }

    query += ' ORDER BY date ASC';

    const count = await db.get(
      'SELECT COUNT(*) as count FROM (' + query + ')',
      ...params
    );

    if (limit) {
      const limitNumber = parseInt(limit);

      if (isNaN(limitNumber) || limitNumber <= 0) {
        return res
          .status(400)
          .json({ error: 'Limit should be a positive number' });
      }
      query += ' LIMIT ?';
      params.push(limitNumber);
    }

    const exercises = await db.all(query, ...params);

    user = { ...user, exercises, count: count.count };

    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
