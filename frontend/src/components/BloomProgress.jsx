import { motion, AnimatePresence } from 'framer-motion';

// ─── Constants ────────────────────────────────────────────────────────────────
const TASKS_PER_CHAPTER = 15;
const CHAPTERS_TO_FULL_BLOOM = 50;       // 750 tasks = full bloom
const TASKS_FULL_BLOOM = CHAPTERS_TO_FULL_BLOOM * TASKS_PER_CHAPTER; // 750
const CHAPTERS_PER_FLOWER = 10;          // 1 flower every 10 chapters
const MAX_FLOWERS = 20;                  // bouquet cap
const CHAPTERS_TO_GRANDMASTER = MAX_FLOWERS * CHAPTERS_PER_FLOWER; // 200 chapters
const CHAPTERS_PER_FRUIT = 10;           // 1 fruit per 10 chapters after grandmaster

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getProgressMeta(completedTasks, totalChapters) {
  const clampedTasks = Math.min(completedTasks, TASKS_FULL_BLOOM);
  const percent = Math.round((clampedTasks / TASKS_FULL_BLOOM) * 100);
  const isFullBloom = completedTasks >= TASKS_FULL_BLOOM;
  const flowerCount = Math.min(MAX_FLOWERS, Math.floor(totalChapters / CHAPTERS_PER_FLOWER));
  const isGrandmaster = totalChapters >= CHAPTERS_TO_GRANDMASTER;
  const fruitCount = isGrandmaster
    ? Math.floor((totalChapters - CHAPTERS_TO_GRANDMASTER) / CHAPTERS_PER_FRUIT)
    : 0;
  return { percent, isFullBloom, flowerCount, isGrandmaster, fruitCount };
}

// ─── Bloom stage from 0-100% ──────────────────────────────────────────────────
const STAGES = [
  { label: 'Seed',       min: 0,  max: 19,  emoji: '🌰' },
  { label: 'Sprout',     min: 20, max: 39,  emoji: '🌱' },
  { label: 'Bud',        min: 40, max: 59,  emoji: '🪴' },
  { label: 'Bloom',      min: 60, max: 79,  emoji: '🌺' },
  { label: 'Full Bloom', min: 80, max: 100, emoji: '🌸' },
];

function getStage(p) {
  return STAGES.find(s => p >= s.min && p <= s.max) || STAGES[0];
}

// ─── Single flower SVG (compact, for bouquet) ─────────────────────────────────
function MiniFlower({ x, y, color = '#E91E63', delay = 0, size = 1 }) {
  const petals = [0, 60, 120, 180, 240, 300];
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: size, opacity: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 200 }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      {petals.map((angle, i) => (
        <ellipse
          key={i}
          cx={x + 8 * Math.cos((angle * Math.PI) / 180)}
          cy={y + 8 * Math.sin((angle * Math.PI) / 180)}
          rx="4" ry="7"
          fill={i % 2 === 0 ? color : '#F48FB1'}
          transform={`rotate(${angle}, ${x + 8 * Math.cos((angle * Math.PI) / 180)}, ${y + 8 * Math.sin((angle * Math.PI) / 180)})`}
          opacity="0.9"
        />
      ))}
      <circle cx={x} cy={y} r="5" fill="#FFC107" />
      <circle cx={x} cy={y} r="3" fill="#FF8F00" />
    </motion.g>
  );
}

// ─── Bouquet display (1-20 flowers) ──────────────────────────────────────────
function FlowerBouquet({ flowerCount }) {
  if (flowerCount === 0) return null;

  // Arrange flowers in a natural bouquet pattern
  const positions = [];
  const rows = [
    { count: Math.min(flowerCount, 5), y: 85, startX: 30, gap: 22 },
    { count: Math.min(Math.max(flowerCount - 5, 0), 5), y: 65, startX: 41, gap: 22 },
    { count: Math.min(Math.max(flowerCount - 10, 0), 5), y: 45, startX: 41, gap: 22 },
    { count: Math.min(Math.max(flowerCount - 15, 0), 5), y: 28, startX: 52, gap: 22 },
  ];

  rows.forEach(row => {
    for (let i = 0; i < row.count; i++) {
      positions.push({ x: row.startX + i * row.gap, y: row.y });
    }
  });

  const colors = ['#E91E63', '#9C27B0', '#FF5722', '#E91E63', '#F06292',
                  '#CE93D8', '#FF8A65', '#F48FB1', '#BA68C8', '#FFAB91',
                  '#E91E63', '#9C27B0', '#FF5722', '#E91E63', '#F06292',
                  '#CE93D8', '#FF8A65', '#F48FB1', '#BA68C8', '#FFAB91'];

  return (
    <g>
      {/* Stems */}
      {positions.map((pos, i) => (
        <line key={`stem-${i}`} x1={pos.x} y1={pos.y + 10} x2="60" y2="108"
          stroke="#388E3C" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      ))}
      {/* Wrap ribbon */}
      {flowerCount >= 5 && (
        <ellipse cx="60" cy="100" rx="18" ry="5" fill="none"
          stroke="#C9920A" strokeWidth="2" opacity="0.7" />
      )}
      {/* Flowers */}
      {positions.map((pos, i) => (
        <MiniFlower key={i} x={pos.x} y={pos.y} color={colors[i % colors.length]} delay={i * 0.08} />
      ))}
    </g>
  );
}

// ─── Tree (grandmaster state) ─────────────────────────────────────────────────
function GrandmasterTree({ fruitCount }) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      {/* Trunk */}
      <rect x="54" y="80" width="12" height="30" rx="4" fill="#6B4226" />
      {/* Main branches */}
      <line x1="60" y1="85" x2="30" y2="60" stroke="#6B4226" strokeWidth="5" strokeLinecap="round" />
      <line x1="60" y1="85" x2="90" y2="60" stroke="#6B4226" strokeWidth="5" strokeLinecap="round" />
      <line x1="60" y1="75" x2="60" y2="45" stroke="#6B4226" strokeWidth="4" strokeLinecap="round" />
      {/* Sub-branches */}
      <line x1="30" y1="60" x2="18" y2="42" stroke="#6B4226" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="60" x2="42" y2="44" stroke="#6B4226" strokeWidth="3" strokeLinecap="round" />
      <line x1="90" y1="60" x2="102" y2="42" stroke="#6B4226" strokeWidth="3" strokeLinecap="round" />
      <line x1="90" y1="60" x2="78" y2="44" stroke="#6B4226" strokeWidth="3" strokeLinecap="round" />
      {/* Foliage */}
      <motion.circle cx="60" cy="38" r="22" fill="#2E7D32" opacity="0.9"
        animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 3, repeat: Infinity }} />
      <circle cx="30" cy="52" r="16" fill="#388E3C" opacity="0.85" />
      <circle cx="90" cy="52" r="16" fill="#388E3C" opacity="0.85" />
      <circle cx="18" cy="36" r="12" fill="#43A047" opacity="0.8" />
      <circle cx="102" cy="36" r="12" fill="#43A047" opacity="0.8" />
      {/* Flowers on tree */}
      {[{x:52,y:28},{x:68,y:24},{x:38,y:44},{x:82,y:44},{x:22,y:30},{x:98,y:30}].map((p,i) => (
        <MiniFlower key={i} x={p.x} y={p.y} size={0.7} delay={i * 0.1} />
      ))}
      {/* Fruits */}
      {Array.from({ length: Math.min(fruitCount, 12) }).map((_, i) => {
        const fruitPositions = [
          {x:55,y:32},{x:65,y:30},{x:48,y:40},{x:72,y:38},{x:28,y:46},{x:92,y:46},
          {x:20,y:34},{x:100,y:34},{x:60,y:22},{x:42,y:28},{x:78,y:28},{x:35,y:36}
        ];
        const fp = fruitPositions[i];
        return (
          <motion.text key={i} x={fp.x} y={fp.y} fontSize="10" textAnchor="middle"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}>
            🍎
          </motion.text>
        );
      })}
      {/* Soil */}
      <ellipse cx="60" cy="112" rx="30" ry="7" fill="#8B6347" opacity="0.4" />
    </motion.g>
  );
}

// ─── Full Bloom celebration SVG ───────────────────────────────────────────────
function FullBloomCelebration() {
  const petals = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];
  return (
    <motion.g initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}>
      <motion.circle cx="60" cy="52" r="36"
        fill="rgba(255,193,7,0.15)"
        animate={{ r: [30, 40, 30], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 2.5, repeat: Infinity }} />
      <ellipse cx="60" cy="108" rx="38" ry="8" fill="#8B6347" opacity="0.35" />
      <rect x="30" y="100" width="60" height="12" rx="4" fill="#A67C5B" opacity="0.5" />
      <line x1="60" y1="100" x2="60" y2="62" stroke="#2E7D32" strokeWidth="4" strokeLinecap="round" />
      <path d="M60 90 Q42 80 38 66 Q53 74 60 87" fill="#388E3C" />
      <path d="M60 83 Q78 73 82 59 Q67 67 60 80" fill="#4CAF50" />
      {petals.map((angle, i) => (
        <motion.ellipse key={`o-${angle}`}
          cx={60 + 22 * Math.cos((angle * Math.PI) / 180)}
          cy={52 + 22 * Math.sin((angle * Math.PI) / 180)}
          rx="7" ry="15"
          fill={i % 3 === 0 ? '#E91E63' : i % 3 === 1 ? '#F06292' : '#F48FB1'}
          transform={`rotate(${angle}, ${60 + 22 * Math.cos((angle * Math.PI) / 180)}, ${52 + 22 * Math.sin((angle * Math.PI) / 180)})`}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: i * 0.05, duration: 0.4, type: 'spring' }} opacity="0.92" />
      ))}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <motion.ellipse key={`in-${angle}`}
          cx={60 + 12 * Math.cos((angle * Math.PI) / 180)}
          cy={52 + 12 * Math.sin((angle * Math.PI) / 180)}
          rx="5" ry="9" fill="#FCE4EC"
          transform={`rotate(${angle + 30}, ${60 + 12 * Math.cos((angle * Math.PI) / 180)}, ${52 + 12 * Math.sin((angle * Math.PI) / 180)})`}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.5 + i * 0.05, duration: 0.4, type: 'spring' }} opacity="0.85" />
      ))}
      <circle cx="60" cy="52" r="11" fill="#FFC107" />
      <circle cx="60" cy="52" r="6" fill="#FF8F00" />
      {[{x:28,y:20,d:0},{x:92,y:16,d:0.3},{x:16,y:48,d:0.6},{x:104,y:53,d:0.9},{x:43,y:10,d:1.2},{x:77,y:8,d:1.5}].map((s,i) => (
        <motion.text key={i} x={s.x} y={s.y} fontSize="11" textAnchor="middle"
          animate={{ opacity: [0,1,0], y: [s.y, s.y-8, s.y] }}
          transition={{ duration: 2, repeat: Infinity, delay: s.d }}>✨</motion.text>
      ))}
    </motion.g>
  );
}

// ─── Simple stage SVGs (seed → bloom) ────────────────────────────────────────
function SimpleStageSVG({ percent }) {
  const stage = getStage(percent);
  if (percent < 20) return ( // Seed
    <g>
      <ellipse cx="60" cy="108" rx="38" ry="8" fill="#8B6347" opacity="0.35" />
      <rect x="30" y="100" width="60" height="12" rx="4" fill="#A67C5B" opacity="0.5" />
      <motion.ellipse cx="60" cy="96" rx="12" ry="9" fill="#6B4226"
        animate={{ scaleY: [1, 1.06, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
      <ellipse cx="60" cy="93" rx="5" ry="3" fill="#A67C5B" opacity="0.5" />
    </g>
  );
  if (percent < 40) return ( // Sprout
    <g>
      <ellipse cx="60" cy="108" rx="38" ry="8" fill="#8B6347" opacity="0.35" />
      <rect x="30" y="100" width="60" height="12" rx="4" fill="#A67C5B" opacity="0.5" />
      <line x1="60" y1="100" x2="60" y2="72" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 85 Q45 78 42 68 Q52 72 60 82" fill="#66BB6A" />
      <path d="M60 80 Q75 73 78 63 Q68 67 60 77" fill="#81C784" />
      <motion.circle cx="60" cy="70" r="4" fill="#A5D6A7"
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} />
    </g>
  );
  if (percent < 60) return ( // Bud
    <g>
      <ellipse cx="60" cy="108" rx="38" ry="8" fill="#8B6347" opacity="0.35" />
      <rect x="30" y="100" width="60" height="12" rx="4" fill="#A67C5B" opacity="0.5" />
      <line x1="60" y1="100" x2="60" y2="58" stroke="#388E3C" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M60 88 Q44 80 40 68 Q53 74 60 85" fill="#4CAF50" />
      <path d="M60 82 Q76 74 80 62 Q67 68 60 79" fill="#66BB6A" />
      <motion.ellipse cx="60" cy="50" rx="9" ry="13" fill="#E91E63"
        animate={{ scaleY: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      <path d="M52 58 Q60 52 68 58 Q60 62 52 58" fill="#388E3C" />
    </g>
  );
  // Bloom (60-79%)
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g>
      <ellipse cx="60" cy="108" rx="38" ry="8" fill="#8B6347" opacity="0.35" />
      <rect x="30" y="100" width="60" height="12" rx="4" fill="#A67C5B" opacity="0.5" />
      <line x1="60" y1="100" x2="60" y2="65" stroke="#388E3C" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M60 90 Q44 82 40 70 Q53 76 60 87" fill="#4CAF50" />
      <path d="M60 84 Q76 76 80 64 Q67 70 60 81" fill="#66BB6A" />
      {petals.map((angle, i) => (
        <motion.ellipse key={angle}
          cx={60 + 16 * Math.cos((angle * Math.PI) / 180)}
          cy={52 + 16 * Math.sin((angle * Math.PI) / 180)}
          rx="8" ry="12"
          fill={i % 2 === 0 ? '#E91E63' : '#F06292'}
          transform={`rotate(${angle}, ${60 + 16 * Math.cos((angle * Math.PI) / 180)}, ${52 + 16 * Math.sin((angle * Math.PI) / 180)})`}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: i * 0.06, duration: 0.4, type: 'spring' }} opacity="0.9" />
      ))}
      <circle cx="60" cy="52" r="9" fill="#FFC107" />
      <circle cx="60" cy="52" r="5" fill="#FF8F00" />
    </g>
  );
}

// ─── Main BloomProgress component ────────────────────────────────────────────
// Props:
//   percent        — 0-100 (for simple chapter-level progress bars)
//   completedTasks — total tasks done (for the overall hobby progress)
//   totalChapters  — total chapters generated (for bouquet/tree)
//   showFull       — if true, shows the full bouquet/tree system
export default function BloomProgress({ percent, completedTasks, totalChapters, showFull = false }) {
  const p = Math.min(100, Math.max(0, percent || 0));

  // Simple mode (chapter-level progress bar)
  if (!showFull) {
    const stage = getStage(p);
    return (
      <div style={{ width: '100%' }}>
        <div className="progress-bar" style={{ height: '6px' }}>
          <motion.div className="progress-fill" initial={{ width: 0 }}
            animate={{ width: `${p}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', marginTop: '4px' }}>
          {stage.emoji} {stage.label} · {p}%
        </p>
      </div>
    );
  }

  // Full mode — overall hobby progress with bouquet/tree system
  const done = completedTasks || 0;
  const chapters = totalChapters || 0;
  const { percent: overallPct, isFullBloom, flowerCount, isGrandmaster, fruitCount } = getProgressMeta(done, chapters);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      {/* SVG visualization */}
      <div style={{ width: '140px', height: '130px', position: 'relative' }}>
        <svg viewBox="0 0 120 120" width="140" height="130" style={{ overflow: 'visible' }}>
          <AnimatePresence mode="wait">
            {isGrandmaster ? (
              <GrandmasterTree key="tree" fruitCount={fruitCount} />
            ) : flowerCount > 0 ? (
              <FlowerBouquet key={`bouquet-${flowerCount}`} flowerCount={flowerCount} />
            ) : isFullBloom ? (
              <FullBloomCelebration key="fullbloom" />
            ) : (
              <SimpleStageSVG key={`stage-${Math.floor(overallPct / 20)}`} percent={overallPct} />
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Progress bar — hard locked to 750 tasks */}
      <div style={{ width: '100%' }}>
        <div className="progress-bar" style={{ height: '8px' }}>
          <motion.div className="progress-fill" initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, overallPct)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }} />
        </div>
      </div>

      {/* Grandmaster label */}
      {isGrandmaster && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{ textAlign: 'center' }}>
          <motion.p
            animate={{ textShadow: ['0 0 8px #C9920A', '0 0 20px #C9920A', '0 0 8px #C9920A'] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700,
              color: 'var(--gold)', letterSpacing: '0.08em', marginBottom: '2px' }}>
            GRANDMASTER
          </motion.p>
          <p style={{ fontSize: '0.82rem', color: 'var(--gold)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            🍎 {fruitCount} fruit{fruitCount !== 1 ? 's' : ''}
          </p>
        </motion.div>
      )}

      {/* Bouquet flower count */}
      {!isGrandmaster && flowerCount > 0 && (
        <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', textAlign: 'center' }}>
          🌸 {flowerCount}/20 flowers · {chapters} chapters
        </p>
      )}

      {/* Normal stage label */}
      {!isGrandmaster && flowerCount === 0 && (
        <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', textAlign: 'center' }}>
          {getStage(overallPct).emoji} {getStage(overallPct).label} · {overallPct}%
        </p>
      )}
    </div>
  );
}
