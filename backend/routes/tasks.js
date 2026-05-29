const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const MOCK_TASKS = {
  1: [
    { id: 1, hobby_id: 1, title: 'Learn the parts of a guitar', description: 'Understand neck, frets, body, tuning pegs', estimated_time: '30 mins', status: 'completed' },
    { id: 2, hobby_id: 1, title: 'Understand standard tuning', description: 'Learn EADGBE tuning', estimated_time: '45 mins', status: 'completed' },
    { id: 3, hobby_id: 1, title: 'Learn C major chord', description: 'Finger placement', estimated_time: '1 hour', status: 'completed' },
    { id: 4, hobby_id: 1, title: 'Learn D major chord', description: 'Practice 15 mins daily for 3 days until clean', estimated_time: '3 days × 15 mins', status: 'current' },
    { id: 5, hobby_id: 1, title: 'Learn Em chord', description: 'The easiest chord', estimated_time: '30 mins', status: 'upcoming' },
    { id: 6, hobby_id: 1, title: 'Play your first song', description: 'Slow version with basic chords G, D, Em', estimated_time: '2 hours', status: 'upcoming' }
  ],
  2: [
    { id: 7, hobby_id: 2, title: 'Set up your workspace', description: 'Get the essential supplies', estimated_time: '1 hour', status: 'completed' },
    { id: 8, hobby_id: 2, title: 'Learn color mixing basics', description: 'Primary colors, warm vs cool', estimated_time: '2 hours', status: 'completed' },
    { id: 9, hobby_id: 2, title: 'Paint a simple landscape', description: 'Layered mountains', estimated_time: '2 hours', status: 'current' }
  ],
  3: [
    { id: 10, hobby_id: 3, title: 'Understand your camera settings', description: 'Learn ISO, aperture', estimated_time: '2 hours', status: 'completed' },
    { id: 11, hobby_id: 3, title: 'Practice the rule of thirds', description: 'Compose 20 shots using grid guidelines', estimated_time: '1 hour', status: 'current' }
  ]
};

// GET /api/tasks/hobby/:hobbyId — tasks for a hobby
router.get('/hobby/:hobbyId', authMiddleware, async (req, res) => {
  try {
    const hobbyCheck = await pool.query(
      'SELECT id FROM hobbies WHERE id = $1 AND user_id = $2',
      [req.params.hobbyId, req.user.id]
    );
    if (hobbyCheck.rows.length === 0) return res.status(404).json({ error: 'Hobby not found.' });

    const result = await pool.query(
      'SELECT * FROM tasks WHERE hobby_id = $1 ORDER BY order_index ASC',
      [req.params.hobbyId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('DB failed, returning mock tasks');
    res.json(MOCK_TASKS[req.params.hobbyId] || []);
  }
});

// PATCH /api/tasks/:id/complete — mark a task as complete
router.patch('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE tasks SET status = 'completed', completed_at = NOW()
       WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found.' });

    const task = result.rows[0];

    // Promote next task to current
    await pool.query(
      `UPDATE tasks SET status = 'current'
       WHERE hobby_id = $1 AND status = 'upcoming' AND order_index = (
         SELECT MIN(order_index) FROM tasks WHERE hobby_id = $1 AND status = 'upcoming'
       )`,
      [task.hobby_id]
    );

    // Update hobby progress
    const allTasks = await pool.query('SELECT * FROM tasks WHERE hobby_id = $1', [task.hobby_id]);
    const completedCount = allTasks.rows.filter(t => t.status === 'completed').length;
    const totalCount = allTasks.rows.length;
    const progress = Math.round((completedCount / totalCount) * 100);

    // Determine bloom stage
    let bloom_stage = 'seed';
    if (progress >= 80) bloom_stage = 'full_bloom';
    else if (progress >= 60) bloom_stage = 'bloom';
    else if (progress >= 40) bloom_stage = 'bud';
    else if (progress >= 15) bloom_stage = 'sprout';

    await pool.query(
      'UPDATE hobbies SET progress = $1, bloom_stage = $2 WHERE id = $3',
      [progress, bloom_stage, task.hobby_id]
    );

    res.json({ success: true, task, progress, bloom_stage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to complete task.' });
  }
});

// POST /api/tasks/hobby/:hobbyId/bulk — seed tasks from AI
router.post('/hobby/:hobbyId/bulk', authMiddleware, async (req, res) => {
  const { tasks } = req.body;
  if (!tasks || !Array.isArray(tasks)) return res.status(400).json({ error: 'Tasks array required.' });
  try {
    const hobbyCheck = await pool.query(
      'SELECT id FROM hobbies WHERE id = $1 AND user_id = $2',
      [req.params.hobbyId, req.user.id]
    );
    if (hobbyCheck.rows.length === 0) return res.status(404).json({ error: 'Hobby not found.' });

    // Delete existing tasks
    await pool.query('DELETE FROM tasks WHERE hobby_id = $1', [req.params.hobbyId]);

    const inserted = [];
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      const status = i === 0 ? 'current' : 'upcoming';
      const result = await pool.query(
        `INSERT INTO tasks (hobby_id, title, description, estimated_time, status, order_index)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [req.params.hobbyId, t.title, t.description || '', t.estimatedTime || '1 hour', status, i + 1]
      );
      inserted.push(result.rows[0]);
    }
    res.json(inserted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert tasks.' });
  }
});

module.exports = router;
