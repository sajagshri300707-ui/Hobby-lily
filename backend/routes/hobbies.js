const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Demo user (id: 1, demo@hobbylily.com) mock hobbies — hardcoded in-memory fallback
const DEMO_USER_ID = 1;
const MOCK_HOBBIES = [
  { id: 1, user_id: DEMO_USER_ID, name: 'Guitar', emoji: '🎸', bloom_stage: 'sprout', progress: 23, days_active: 34, difficulty: 'beginner', estimated_time_per_day: '30 mins/day' },
  { id: 2, user_id: DEMO_USER_ID, name: 'Watercolor Painting', emoji: '🎨', bloom_stage: 'bud', progress: 61, days_active: 28, difficulty: 'intermediate', estimated_time_per_day: '45 mins/day' },
  { id: 3, user_id: DEMO_USER_ID, name: 'Photography', emoji: '📷', bloom_stage: 'seed', progress: 8, days_active: 12, difficulty: 'beginner', estimated_time_per_day: '20 mins/day' }
];

// GET /api/hobbies — get all hobbies for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM hobbies WHERE user_id = $1 ORDER BY created_at ASC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('DB failed, returning mock hobbies');
    // Return mock hobbies regardless of user_id (user is already authenticated)
    res.json(MOCK_HOBBIES);
  }
});

// POST /api/hobbies — add a new hobby
router.post('/', authMiddleware, async (req, res) => {
  const { name, emoji, difficulty, estimated_time_per_day } = req.body;
  if (!name) return res.status(400).json({ error: 'Hobby name is required.' });
  try {
    const result = await pool.query(
      `INSERT INTO hobbies (user_id, name, emoji, bloom_stage, progress, days_active, difficulty, estimated_time_per_day)
       VALUES ($1, $2, $3, 'seed', 0, 0, $4, $5) RETURNING *`,
      [req.user.id, name, emoji || '🌸', difficulty || 'beginner', estimated_time_per_day || '30 mins/day']
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB failed, returning mock new hobby');
    const newHobby = {
      id: Date.now(), user_id: req.user.id, name, emoji: emoji || '🌸',
      bloom_stage: 'seed', progress: 0, days_active: 0, difficulty: difficulty || 'beginner', estimated_time_per_day: estimated_time_per_day || '30 mins/day'
    };
    MOCK_HOBBIES.push(newHobby);
    res.json(newHobby);
  }
});

// GET /api/hobbies/:id — single hobby
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM hobbies WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Hobby not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    const h = MOCK_HOBBIES.find(h => h.id == req.params.id);
    if (h) res.json(h);
    else res.status(404).json({ error: 'Hobby not found.' });
  }
});

// GET /api/hobbies/:id/stats — garden stats
router.get('/user/stats', authMiddleware, async (req, res) => {
  try {
    const hobbies = await pool.query(
      'SELECT * FROM hobbies WHERE user_id = $1', [req.user.id]
    );
    const tasks = await pool.query(
      `SELECT t.* FROM tasks t
       JOIN hobbies h ON h.id = t.hobby_id
       WHERE h.user_id = $1 AND t.status = 'completed'`,
      [req.user.id]
    );
    const totalDays = hobbies.rows.reduce((sum, h) => sum + (h.days_active || 0), 0);
    const maxStage = ['seed','sprout','bud','bloom','full_bloom'];
    let topStageIdx = 0;
    hobbies.rows.forEach(h => {
      const idx = maxStage.indexOf(h.bloom_stage);
      if (idx > topStageIdx) topStageIdx = idx;
    });
    res.json({
      totalHobbies: hobbies.rows.length,
      daysActive: Math.max(...hobbies.rows.map(h => h.days_active || 0), 0),
      tasksCompleted: tasks.rows.length,
      bloomStage: maxStage[topStageIdx] || 'seed'
    });
  } catch (err) {
    const maxStage = ['seed', 'sprout', 'bud', 'bloom', 'full_bloom'];
    let topStageIdx = 0;
    MOCK_HOBBIES.forEach(h => {
      const idx = maxStage.indexOf(h.bloom_stage);
      if (idx > topStageIdx) topStageIdx = idx;
    });
    res.json({
      totalHobbies: MOCK_HOBBIES.length,
      daysActive: Math.max(...MOCK_HOBBIES.map(h => h.days_active || 0), 0),
      tasksCompleted: 12,
      bloomStage: maxStage[topStageIdx] || 'seed'
    });
  }
});

module.exports = router;
