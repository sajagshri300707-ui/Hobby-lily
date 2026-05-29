import { motion } from 'framer-motion';

export default function LilySpinner({ label = 'Blooming…' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
        padding: '1.5rem',
      }}
    >
      <motion.span
        animate={{ scale: [0.8, 1.1, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: '2.5rem', display: 'block' }}
      >
        🌸
      </motion.span>
      <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>{label}</p>
    </motion.div>
  );
}
