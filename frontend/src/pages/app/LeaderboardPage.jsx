import { motion } from 'framer-motion';
import PageMotion from '../../components/PageMotion';
import { useAuth } from '../../context/AuthContext';
import { LEADERBOARD } from '../../lib/demoData';

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function LeaderboardPage() {
  const { user } = useAuth();

  const leaders = LEADERBOARD.map((l) => ({
    ...l,
    name: l.isYou ? (user?.name || l.name) : l.name,
    initials: l.isYou
      ? (user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'DU')
      : l.initials,
  }));

  return (
    <PageMotion style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.8rem', letterSpacing: '0.12em', color: 'var(--brown-light)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>
          Community growth 🏆
        </p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--ink)', marginBottom: '0.5rem' }}>
          Leaderboard
        </h1>
        <p style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>
          Ranked by Bloomometer — a mix of consistency, tasks, and community contribution.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {[leaders[1], leaders[0], leaders[2]].map((leader, i) => {
          const heights = [120, 150, 100];
          return (
            <motion.div
              key={leader.rank}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, type: 'spring' }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%', background: leader.color,
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--font-body)',
                border: leader.rank === 1 ? '3px solid var(--gold-light)' : 'none',
                boxShadow: leader.rank === 1 ? '0 0 0 3px var(--gold-pale)' : 'none',
              }}>{leader.initials}</div>
              <div style={{ fontSize: '1.3rem' }}>{MEDALS[leader.rank]}</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>{leader.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>{leader.bloomometer}🌸</div>
              </div>
              <div style={{
                width: '80px', height: `${heights[i]}px`,
                background: leader.rank === 1 ? 'linear-gradient(to top, var(--gold), var(--gold-light))' : 'linear-gradient(to top, var(--brown-light), var(--brown-pale))',
                borderRadius: '8px 8px 0 0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--font-body)',
              }}>{leader.rank}</div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {leaders.map((leader, i) => (
          <motion.div
            key={leader.rank}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card"
            style={{
              padding: '1rem 1.25rem',
              background: leader.isYou ? 'var(--gold-pale)' : 'var(--white)',
              border: leader.isYou ? '2px solid var(--gold-light)' : '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink-muted)', width: '24px', textAlign: 'center' }}>
                {MEDALS[leader.rank] || leader.rank}
              </span>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', background: leader.color,
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.78rem', fontFamily: 'var(--font-body)', flexShrink: 0,
              }}>{leader.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.92rem', fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>{leader.name}</span>
                  {leader.isYou && <span style={{ fontSize: '0.7rem', padding: '1px 8px', background: 'var(--gold)', color: 'var(--ink)', borderRadius: '99px', fontWeight: 700, fontFamily: 'var(--font-body)' }}>YOU</span>}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>{leader.hobby} · {leader.stage}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)' }}>{leader.bloomometer}🌸</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>{leader.tasks} tasks · {leader.days}d</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </PageMotion>
  );
}
