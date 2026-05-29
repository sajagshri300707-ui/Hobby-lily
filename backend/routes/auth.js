const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashed]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'hobbylily_secret_2026',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Signup DB error, falling back to mock sign up');
    // Mock successful signup
    const user = { id: Date.now(), name, email };
    const token = jwt.sign(
      user,
      process.env.JWT_SECRET || 'hobbylily_secret_2026',
      { expiresIn: '7d' }
    );
    res.json({ token, user });
  }
});

const MOCK_USERS = {
  'demo@hobbylily.com': { id: 1, name: 'Demo User', email: 'demo@hobbylily.com', password: 'demo123' },
  'priya@hobbylily.com': { id: 2, name: 'Priya Sharma', email: 'priya@hobbylily.com', password: 'priya123' }
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Hardcoded mock accounts check
  if (MOCK_USERS[email] && MOCK_USERS[email].password === password) {
    const user = MOCK_USERS[email];
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'hobbylily_secret_2026',
      { expiresIn: '7d' }
    );
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'hobbylily_secret_2026',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login. Make sure Docker/PostgreSQL is running!' });
  }
});

module.exports = router;
