import { motion } from 'framer-motion';
import KatelynMascot from './KatelynMascot';

export default function SkipCard({ skippedChapters, startChapter, reason, skillsUsed = [] }) {
  if (!skippedChapters || skippedChapters < 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
      style={{
        background: 'linear-gradient(135deg, #EBF4F8, #E3F2FD)',
        border: '2px solid var(--blue-soft)',
        borderRadius: '18px',
        padding: '1.75rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '-30px', right: '-30px',
        width: '160px', height: '160px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,196,212,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20px', left: '-20px',
        width: '120px', height: '120px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,196,212,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Katelyn — big and centred */}
      <KatelynMascot size={130} autoPlay={true} style={{ marginBottom: '1rem', zIndex: 1 }} />

      {/* Skip badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
        style={{ marginBottom: '0.75rem', zIndex: 1 }}
      >
        <span style={{
          background: 'linear-gradient(135deg, var(--blue-soft), #7BB8D4)',
          color: 'white',
          padding: '6px 18px',
          borderRadius: '99px',
          fontSize: '0.9rem',
          fontWeight: 700,
          fontFamily: 'var(--font-body)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 12px rgba(91,184,245,0.35)',
        }}>
          🚀 {skippedChapters} chapter{skippedChapters !== 1 ? 's' : ''} skipped!
        </span>
      </motion.div>

      {/* Heading */}
      <h3 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1.25rem',
        color: 'var(--ink)',
        marginBottom: '0.5rem',
        zIndex: 1,
      }}>
        Katelyn gave you a head start! 🎉
      </h3>

      <p style={{
        fontSize: '0.78rem',
        color: 'var(--ink-muted)',
        fontFamily: 'var(--font-body)',
        marginBottom: reason ? '0.75rem' : 0,
        zIndex: 1,
      }}>
        Starting at Chapter {startChapter}
      </p>

      {/* Reason */}
      {reason && (
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--ink-soft)',
          fontFamily: 'var(--font-body)',
          lineHeight: 1.6,
          marginBottom: skillsUsed.length > 0 ? '1rem' : 0,
          maxWidth: '480px',
          zIndex: 1,
        }}>
          {reason}
        </p>
      )}

      {/* Skills used */}
      {skillsUsed.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', zIndex: 1 }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', alignSelf: 'center', width: '100%', marginBottom: '4px' }}>
            Because you know:
          </span>
          {skillsUsed.map((skill, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              style={{
                fontSize: '0.78rem',
                padding: '4px 12px',
                background: 'rgba(168,196,212,0.25)',
                border: '1px solid var(--blue-soft)',
                borderRadius: '99px',
                color: '#1565C0',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
              }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
