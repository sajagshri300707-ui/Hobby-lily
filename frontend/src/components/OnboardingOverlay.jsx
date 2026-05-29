import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  {
    title: 'Welcome to HobbyLily 🌸',
    body: 'A honest space to grow hobbies together — no highlight reels, just real progress.',
    emoji: '🌸',
  },
  {
    title: 'Your garden starts here',
    body: 'Each hobby is a flower that blooms as you practice. Track progress on My Garden.',
    emoji: '🌱',
    action: 'garden',
  },
  {
    title: 'Pick your first hobby',
    body: 'Tell us your vibe and AI will suggest the perfect hobby to plant.',
    emoji: '✨',
    action: 'add-hobby',
  },
];

export default function OnboardingOverlay({ onComplete, onOpenAddHobby }) {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const current = STEPS[step];

  const finish = () => {
    localStorage.setItem('hl_onboarding_done', 'true');
    onComplete?.();
  };

  const next = () => {
    if (current.action === 'garden') navigate('/app/garden');
    if (step >= STEPS.length - 1) {
      onOpenAddHobby?.();
      finish();
      return;
    }
    setStep((s) => s + 1);
    if (STEPS[step + 1]?.action === 'add-hobby') {
      navigate('/app/garden');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
        background: 'rgba(26,18,7,0.55)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16 }}
          className="card"
          style={{ maxWidth: '420px', width: '100%', padding: '2rem', textAlign: 'center' }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{current.emoji}</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--ink)' }}>
            {current.title}
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontFamily: 'var(--font-body)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            {current.body}
          </p>
          <motion.div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '1.25rem' }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === step ? 24 : 8, height: 8, borderRadius: 99,
                  background: i === step ? 'var(--gold)' : 'var(--border)',
                  transition: 'var(--transition)',
                }}
              />
            ))}
          </motion.div>
          <button type="button" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }} onClick={next}>
            {step === STEPS.length - 1 ? 'Plant my first hobby 🌱' : 'Continue →'}
          </button>
          {step > 0 && (
            <button
              type="button"
              onClick={finish}
              style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}
            >
              Skip for now
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
