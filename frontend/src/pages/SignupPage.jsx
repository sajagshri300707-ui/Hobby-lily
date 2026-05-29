import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function GardenIllustration() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, var(--blue-pale) 0%, var(--cream) 100%)',
      padding: '3rem', position: 'relative', overflow: 'hidden',
    }}>
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: '5rem', marginBottom: '1rem', textAlign: 'center' }}
      >
        🌱🌺🌸
      </motion.div>

      {/* Floating elements */}
      {['🌼', '🌿', '🍃', '✨'].map((e, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -15, 0], rotate: [-5, 5, -5], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.8 }}
          style={{
            position: 'absolute', fontSize: '1.5rem',
            top: `${20 + i * 15}%`,
            left: i % 2 === 0 ? '15%' : '80%',
          }}
        >{e}</motion.div>
      ))}

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <img src="/logo.jpg" alt="HobbyLily" style={{ width: '72px', borderRadius: '16px', marginBottom: '1.5rem', boxShadow: '0 8px 24px rgba(107,66,38,0.15)' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--ink)', marginBottom: '0.75rem' }}>
          Plant your first seed<br />today.
        </h2>
        <p style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6, maxWidth: '240px' }}>
          Join thousands of honest learners growing together — one task at a time.
        </p>

        {/* Fake community avatars */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '-8px' }}>
          {['#A8C4D4', '#C9920A', '#A67C5B', '#6B4226'].map((color, i) => (
            <div key={i} style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: color, border: '2px solid white',
              marginLeft: i > 0 ? '-10px' : 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-body)',
            }}>
              {['AM', 'RS', 'JK', '+'][i]}
            </div>
          ))}
          <div style={{ marginLeft: '12px', fontSize: '0.8rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', alignSelf: 'center' }}>
            12,400+ gardeners
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('All fields are required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/app/garden');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left: illustration */}
      <div className="hide-mobile" style={{ height: '100vh' }}>
        <GardenIllustration />
      </div>

      {/* Right: form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(2rem, 6vw, 5rem)',
          background: 'var(--cream)',
        }}
      >
        <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
          <div className="hide-desktop" style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <img src="/logo.jpg" alt="HobbyLily" style={{ height: '48px', borderRadius: '12px' }} />
          </div>

          <p style={{ fontSize: '0.8rem', letterSpacing: '0.15em', color: 'var(--brown-light)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Join the garden
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: 'var(--ink)', marginBottom: '0.5rem' }}>
            Create your account
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', marginBottom: '2rem' }}>
            Already growing?{' '}
            <Link to="/login" style={{ color: 'var(--brown-coffee)', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
          </p>

          {error && (
            <div style={{
              background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '10px',
              padding: '0.75rem 1rem', marginBottom: '1.25rem',
              color: '#991B1B', fontSize: '0.88rem', fontFamily: 'var(--font-body)',
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label className="form-label">Your name</label>
              <input
                id="signup-name"
                className="form-input"
                type="text"
                placeholder="What should we call you?"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div>
              <label className="form-label">Email address</label>
              <input
                id="signup-email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input
                id="signup-password"
                className="form-input"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button id="signup-submit" type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
              {loading ? <><span className="loading-dot"/><span className="loading-dot"/><span className="loading-dot"/></> : 'Plant my first seed 🌱'}
            </button>

            <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
              By signing up, you agree to grow honestly and support others.
            </p>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0', color: 'var(--ink-muted)', fontSize: '0.82rem', fontFamily: 'var(--font-body)' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            or
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', gap: '10px' }} disabled>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        </div>
      </motion.div>
    </div>
  );
}
