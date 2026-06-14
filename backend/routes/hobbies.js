const express = require('express');
const fs = require('fs');
const path = require('path');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// File-based fallback store — survives server restarts
const STORE_PATH = path.join(__dirname, '../data/hobbies.json');

function readStore() {
  try {
    if (!fs.existsSync(STORE_PATH)) return [];
    return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  } catch { return []; }
}

function writeStore(hobbies) {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFile(STORE_PATH, JSON.stringify(hobbies, null, 2), (err) => {
      if (err) console.error('File write failed:', err);
    });
  } catch (e) { console.error('Store write error:', e.message); }
}

// GET /api/hobbies — get all hobbies for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM hobbies WHERE user_id = $1 ORDER BY created_at ASC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('DB failed, returning file-store hobbies');
    const store = readStore();
    res.json(store.filter(h => h.user_id === req.user.id));
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
    console.error('DB failed, storing in file-store');
    const newHobby = {
      id: Date.now(), user_id: req.user.id, name, emoji: emoji || '🌸',
      bloom_stage: 'seed', progress: 0, days_active: 0,
      difficulty: difficulty || 'beginner',
      estimated_time_per_day: estimated_time_per_day || '30 mins/day'
    };
    const store = readStore();
    store.push(newHobby);
    writeStore(store);
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
    const store = readStore();
    const h = store.find(h => String(h.id) === String(req.params.id) && h.user_id === req.user.id);
    if (h) res.json(h);
    else res.status(404).json({ error: 'Hobby not found.' });
  }
});

// GET /api/hobbies/user/stats — garden stats
router.get('/user/stats', authMiddleware, async (req, res) => {
  try {
    const hobbies = await pool.query('SELECT * FROM hobbies WHERE user_id = $1', [req.user.id]);
    const tasks = await pool.query(
      `SELECT t.* FROM tasks t JOIN hobbies h ON h.id = t.hobby_id
       WHERE h.user_id = $1 AND t.status = 'completed'`, [req.user.id]
    );
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
    const store = readStore();
    const userHobbies = store.filter(h => h.user_id === req.user.id);
    res.json({
      totalHobbies: userHobbies.length,
      daysActive: 0,
      tasksCompleted: 0,
      bloomStage: 'seed'
    });
  }
});

module.exports = router;
