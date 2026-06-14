const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const pool = require('../db');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload(); // { email, sub, name, ... }
  } catch (err) {
    throw new Error('Invalid Google token');
  }
}

// --- Rate Limiting ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per `window`
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all auth routes
router.use(authLimiter);

// --- OTP In-Memory Lockout (Basic) ---
// TODO (PRODUCTION): Move this state to a persistent store (e.g., Redis or PostgreSQL) 
// so that brute-force lockouts survive server restarts.
// Currently maps phone -> { attempts: number, lockUntil: timestamp }
const otpAttemptsMap = new Map();

function checkOtpLockout(phone) {
  const record = otpAttemptsMap.get(phone);
  if (!record) return false;
  if (record.lockUntil && Date.now() < record.lockUntil) {
    return true;
  }
  if (record.lockUntil && Date.now() >= record.lockUntil) {
    // Lock expired
    otpAttemptsMap.delete(phone);
  }
  return false;
}

function recordOtpFailure(phone) {
  let record = otpAttemptsMap.get(phone) || { attempts: 0, lockUntil: null };
  record.attempts += 1;
  if (record.attempts >= 5) {
    // Lock for 15 minutes
    record.lockUntil = Date.now() + 15 * 60 * 1000;
  }
  otpAttemptsMap.set(phone, record);
}

function clearOtpFailures(phone) {
  otpAttemptsMap.delete(phone);
}

// --- Helpers ---
function formatAuthResponse(user, token) {
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar_color: user.avatar_color
    }
  };
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, phone: user.phone },
    process.env.JWT_SECRET || 'hobbylily_secret_2026',
    { expiresIn: '7d' }
  );
}

function normalizePhone(phone) {
  if (!phone) return null;
  return phone.replace(/\D/g, ''); // Keep only digits
}

function handleMockFallback(res, mockFn) {
  if (process.env.USE_MOCK_AUTH === 'true') {
    console.log('[WARN] Database failed, falling back to MOCK AUTH.');
    mockFn();
  } else {
    console.error('[AUDIT] DATABASE_FAILURE | Mock auth is disabled.');
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// --- Routes ---

// POST /api/auth/signup (Email)
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required.' });

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log(`[AUDIT] SIGNUP_FAILED | reason=email_exists | email=${email}`);
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashed]
    );

    const user = result.rows[0];
    const token = generateToken(user);
    console.log(`[AUDIT] SIGNUP_SUCCESS | method=email | user_id=${user.id}`);
    res.json(formatAuthResponse(user, token));
  } catch (err) {
    console.error('Signup error:', err);
    handleMockFallback(res, () => {
      const user = { id: Date.now(), name, email };
      res.json(formatAuthResponse(user, generateToken(user)));
    });
  }
});

// POST /api/auth/login (Email)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  // Mock accounts
  if (process.env.USE_MOCK_AUTH === 'true' && email === 'demo@hobbylily.com' && password === 'demo123') {
    const user = { id: 1, name: 'Demo User', email: 'demo@hobbylily.com', avatar_color: '#A8C4D4' };
    return res.json(formatAuthResponse(user, generateToken(user)));
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      console.log(`[AUDIT] LOGIN_FAILED | reason=user_not_found | email=${email}`);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = result.rows[0];
    if (!user.password) {
      console.log(`[AUDIT] LOGIN_FAILED | reason=no_password_set | email=${email}`);
      return res.status(401).json({ error: 'Invalid credentials. Try logging in with Google.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log(`[AUDIT] LOGIN_FAILED | reason=invalid_password | email=${email}`);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = generateToken(user);
    console.log(`[AUDIT] LOGIN_SUCCESS | method=email | user_id=${user.id}`);
    res.json(formatAuthResponse(user, token));
  } catch (err) {
    console.error('Login error:', err);
    handleMockFallback(res, () => {
      const user = { id: Date.now(), name: 'Mock User', email };
      res.json(formatAuthResponse(user, generateToken(user)));
    });
  }
});

// POST /api/auth/phone/login
router.post('/phone/login', async (req, res) => {
  const rawPhone = req.body.phone;
  const otp = req.body.otp;
  const phone = normalizePhone(rawPhone);

  if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP are required.' });

  if (checkOtpLockout(phone)) {
    console.log(`[AUDIT] OTP_LOCKED | phone=${phone}`);
    return res.status(429).json({ error: 'Too many failed attempts. Try again in 15 minutes.' });
  }

  // OTP Service verification
  const isProduction = process.env.NODE_ENV === 'production';
  // In production, this would match an actual SMS OTP cache.
  const validOtp = isProduction ? process.env.EXPECTED_OTP : '123456';

  if (otp !== validOtp) {
    recordOtpFailure(phone);
    console.log(`[AUDIT] OTP_FAILED | phone=${phone}`);
    return res.status(401).json({ error: 'Invalid OTP.' });
  }

  clearOtpFailures(phone);

  try {
    const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (result.rows.length === 0) {
      console.log(`[AUDIT] LOGIN_FAILED | reason=phone_not_found | phone=${phone}`);
      return res.status(401).json({ error: 'Phone number not registered.' });
    }
    
    const user = result.rows[0];
    const token = generateToken(user);
    console.log(`[AUDIT] LOGIN_SUCCESS | method=phone | user_id=${user.id}`);
    res.json(formatAuthResponse(user, token));
  } catch (err) {
    console.error('Phone login error:', err);
    handleMockFallback(res, () => {
      const user = { id: Date.now(), name: 'Phone User', phone };
      res.json(formatAuthResponse(user, generateToken(user)));
    });
  }
});

// POST /api/auth/phone/signup
router.post('/phone/signup', async (req, res) => {
  const { name, otp } = req.body;
  const phone = normalizePhone(req.body.phone);

  if (!name || !phone || !otp) return res.status(400).json({ error: 'All fields are required.' });

  if (checkOtpLockout(phone)) {
    return res.status(429).json({ error: 'Too many failed attempts. Try again in 15 minutes.' });
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const validOtp = isProduction ? process.env.EXPECTED_OTP : '123456';

  if (otp !== validOtp) {
    recordOtpFailure(phone);
    return res.status(401).json({ error: 'Invalid OTP.' });
  }

  clearOtpFailures(phone);

  try {
    const existing = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (existing.rows.length > 0) {
      console.log(`[AUDIT] SIGNUP_FAILED | reason=phone_exists | phone=${phone}`);
      return res.status(409).json({ error: 'Phone number already registered.' });
    }

    const result = await pool.query(
      'INSERT INTO users (name, phone) VALUES ($1, $2) RETURNING *',
      [name, phone]
    );
    const user = result.rows[0];
    const token = generateToken(user);
    console.log(`[AUDIT] SIGNUP_SUCCESS | method=phone | user_id=${user.id}`);
    res.json(formatAuthResponse(user, token));
  } catch (err) {
    console.error('Phone signup error:', err);
    handleMockFallback(res, () => {
      const user = { id: Date.now(), name, phone };
      res.json(formatAuthResponse(user, generateToken(user)));
    });
  }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
  const { token, email: mockEmail, name: mockName, google_id: mockGoogleId } = req.body;
  
  if (!token && !mockGoogleId) return res.status(400).json({ error: 'Invalid Google payload.' });

  let email, google_id, gName;

  if (process.env.USE_MOCK_AUTH === 'true' && mockGoogleId) {
    // Handle mock login from frontend
    email = mockEmail;
    google_id = mockGoogleId;
    gName = mockName || `Gardener_${google_id.substring(0, 4)}`;
  } else {
    // Real verification
    try {
      const payload = await verifyGoogleToken(token);
      email = payload.email;
      google_id = payload.sub;
      gName = payload.name || `Gardener_${google_id.substring(0, 4)}`;
    } catch (err) {
      console.error('[AUDIT] GOOGLE_AUTH_FAILED | Invalid Token');
      return res.status(401).json({ error: 'Invalid Google token.' });
    }
  }

  try {
    // 1. Check if google_id already exists
    let existing = await pool.query('SELECT * FROM users WHERE google_id = $1', [google_id]);
    
    if (existing.rows.length === 0) {
      // 2. Check if email exists to link accounts
      existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (existing.rows.length > 0) {
        // Link google_id
        console.log(`[AUDIT] ACCOUNT_LINKED | google_id=${google_id} | email=${email}`);
        const updateRes = await pool.query(
          'UPDATE users SET google_id = $1 WHERE email = $2 RETURNING *',
          [google_id, email]
        );
        const user = updateRes.rows[0];
        const token = generateToken(user);
        console.log(`[AUDIT] LOGIN_SUCCESS | method=google_linked | user_id=${user.id}`);
        return res.json(formatAuthResponse(user, token));
      } else {
        // 3. Create new user
        const insertRes = await pool.query(
          'INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING *',
          [gName, email, google_id]
        );
        const user = insertRes.rows[0];
        const token = generateToken(user);
        console.log(`[AUDIT] SIGNUP_SUCCESS | method=google | user_id=${user.id}`);
        return res.json(formatAuthResponse(user, token));
      }
    }

    // Existing Google User
    const user = existing.rows[0];
    const token = generateToken(user);
    console.log(`[AUDIT] LOGIN_SUCCESS | method=google | user_id=${user.id}`);
    res.json(formatAuthResponse(user, token));
  } catch (err) {
    console.error('Google auth error:', err);
    handleMockFallback(res, () => {
      const user = { id: Date.now(), name: gName, email, google_id };
      res.json(formatAuthResponse(user, generateToken(user)));
    });
  }
});

module.exports = router;
