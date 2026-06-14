import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Confetti particle ────────────────────────────────────────────────────────
function ConfettiParticle({ x, color, delay }) {
  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 1, scale: 1, rotate: 0 }}
      animate={{ y: -130, x, opacity: 0, scale: 0.4, rotate: 360 }}
      transition={{ duration: 1.3, delay, ease: 'easeOut' }}
      style={{
        position: 'absolute', bottom: '40%', left: '50%',
        width: '8px', height: '8px', borderRadius: '2px',
        background: color, pointerEvents: 'none', zIndex: 10,
      }}
    />
  );
}

const CONFETTI_COLORS = [
  '#E91E63', '#FFC107', '#4CAF50', '#2196F3',
  '#9C27B0', '#FF5722', '#00BCD4', '#FF9800',
];

// ─── Main KatelynMascot component ────────────────────────────────────────────
// Uses the actual katelyn.png image from /public/katelyn.png
// Animations: celebrate (bounce + confetti) → wink overlay → static
export default function KatelynMascot({ size = 90, autoPlay = true, style = {} }) {
  const [phase, setPhase] = useState(autoPlay ? 'celebrate' : 'static');
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (!autoPlay) return;

    // Generate confetti burst
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 180,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: Math.random() * 0.5,
    }));
    setConfetti(particles);

    // celebrate → wink at 1s
    const t1 = setTimeout(() => setPhase('wink'), 1000);
    // wink → static at 2s
    const t2 = setTimeout(() => {
      setPhase('static');
      setConfetti([]);
    }, 2000);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [autoPlay]);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, ...style }}>
      {/* Confetti burst */}
      <AnimatePresence>
        {confetti.map(p => (
          <ConfettiParticle key={p.id} x={p.x} color={p.color} delay={p.delay} />
        ))}
      </AnimatePresence>

      {/* Katelyn image with animation */}
      <motion.img
        src="/katelyn.png"
        alt="Katelyn"
        animate={
          phase === 'celebrate'
            ? { y: [0, -16, 0, -10, 0, -6, 0], rotate: [0, -8, 8, -5, 5, 0] }
            : phase === 'wink'
            ? { scale: [1, 1.08, 1], rotate: [0, 5, 0] }
            : { y: 0, rotate: 0, scale: 1 }
        }
        transition={
          phase === 'celebrate'
            ? { duration: 0.9, ease: 'easeInOut' }
            : phase === 'wink'
            ? { duration: 0.4 }
            : { duration: 0.3 }
        }
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        onError={e => {
          // Fallback emoji if image not found
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      {/* Fallback if katelyn.png not in public folder yet */}
      <div style={{
        display: 'none', width: size, height: size,
        alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.6, position: 'absolute',
      }}>
        🐦
      </div>

      {/* Wink overlay — closes left eye */}
      <AnimatePresence>
        {phase === 'wink' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              // Approximate position of left eye on the bird image
              top: '28%', left: '30%',
              width: '18%', height: '8%',
              background: 'transparent',
              pointerEvents: 'none',
            }}
          >
            {/* Draw a curved wink line over the eye */}
            <svg viewBox="0 0 30 12" width="100%" height="100%">
              <path
                d="M2 8 Q15 2 28 8"
                stroke="#3A6B9C"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
