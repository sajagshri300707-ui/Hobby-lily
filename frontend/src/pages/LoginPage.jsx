import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function GrowingLily() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, var(--brown-pale) 0%, var(--cream-dark) 100%)',
      padding: '3rem', position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${200 + i * 120}px`, height: `${200 + i * 120}px`,
          borderRadius: '50%',
          border: `1px solid rgba(107,66,38,${0.06 - i * 0.015})`,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }} />
      ))}

      {/* Animated lily */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: '6rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 8px 24px rgba(107,66,38,0.2))' }}
      >
        🌸
      </motion.div>

      <div style={{ position: 'absolute', bottom: '20%', left: '20%' }}>
        <motion.span
          animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          style={{ fontSize: '2rem' }}
        >🌱</motion.span>
      </div>
      <div style={{ position: 'absolute', top: '25%', right: '20%' }}>
        <motion.span
          animate={{ y: [0, -8, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
          style={{ fontSize: '1.5rem' }}
        >🌺</motion.span>
      </div>
      <div style={{ position: 'absolute', top: '60%', right: '15%' }}>
        <motion.span
          animate={{ y: [0, -6, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
          style={{ fontSize: '1.2rem' }}
        >🌷</motion.span>
      </div>

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <img src="/logo.jpg" alt="HobbyLily" style={{ width: '80px', borderRadius: '16px', marginBottom: '1.5rem', boxShadow: '0 8px 24px rgba(107,66,38,0.15)' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--ink)', marginBottom: '0.75rem' }}>
          Your hobby garden<br />awaits you.
        </h2>
        <p style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6, maxWidth: '240px' }}>
          Every expert was once a beginner with a seed of curiosity.
        </p>
      </div>

      {/* Mini bloom stages */}
      <div style={{ position: 'absolute', bottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {['🌰', '🌱', '🪴', '🌺', '🌸'].map((e, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.15, type: 'spring', stiffness: 300 }}
            style={{ fontSize: i === 4 ? '1.4rem' : '1rem', opacity: 0.6 + i * 0.1 }}
          >{e}</motion.span>
        ))}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '60px' }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ height: '2px', background: 'linear-gradient(90deg, var(--brown-light), transparent)', borderRadius: '1px' }}
        />
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back! Your garden is waiting 🌸');
      navigate('/app/garden');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => { setEmail('demo@hobbylily.com'); setPassword('demo123'); };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left: Illustration */}
      <div className="hide-mobile" style={{ height: '100vh' }}>
        <GrowingLily />
      </div>

      {/* Right: Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(2rem, 6vw, 5rem)',
          background: 'var(--cream)', gridColumn: 'span 1',
        }}
        className="auth-form-side"
      >
        <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
          {/* Mobile logo */}
          <div className="hide-desktop" style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <img src="/logo.jpg" alt="HobbyLily" style={{ height: '48px', borderRadius: '12px' }} />
          </div>

          <p style={{ fontSize: '0.8rem', letterSpacing: '0.15em', color: 'var(--brown-light)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Welcome back
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: 'var(--ink)', marginBottom: '0.5rem' }}>
            Sign in to your garden
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', marginBottom: '2rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--brown-coffee)', fontWeight: 600, textDecoration: 'none' }}>Start growing →</Link>
          </p>

          {/* Demo hint */}
          <div
            onClick={fillDemo}
            style={{
              background: 'var(--gold-pale)', border: '1px solid var(--gold-light)',
              borderRadius: '10px', padding: '0.75rem 1rem',
              marginBottom: '1.5rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>✨</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)', fontFamily: 'var(--font-body)' }}>Try the demo account</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>Click to fill: demo@hobbylily.com</div>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '10px',
              padding: '0.75rem 1rem', marginBottom: '1.25rem',
              color: '#991B1B', fontSize: '0.88rem', fontFamily: 'var(--font-body)',
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label className="form-label">Email address</label>
              <input
                id="login-email"
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
                id="login-password"
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button id="login-submit" type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
              {loading ? <><span className="loading-dot"/><span className="loading-dot"/><span className="loading-dot"/></> : 'Sign in to my garden 🌸'}
            </button>
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
