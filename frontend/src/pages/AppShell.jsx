import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useBranch } from '../context/BranchContext';
import OnboardingOverlay from '../components/OnboardingOverlay';
import { updateStreak, getStreak, streakMessage } from '../lib/streakUtils';

const NAV_ITEMS = [
  { path: '/app/garden', icon: '🌸', key: 'garden' },
  { path: '/app/path', icon: '🗺️', key: 'path' },
  { path: '/app/journal', icon: '📓', key: 'journal' },
  { path: '/app/doubts', icon: '🌿', key: 'doubts' },
  { path: '/app/feed', icon: '📹', key: 'feed' },
  { path: '/app/groups', icon: '👥', key: 'groups' },
  { path: '/app/leaderboard', icon: '🏆', key: 'leaderboard' },
  { path: '/app/settings', icon: '⚙️', key: 'settings' },
];

const MOBILE_NAV = [
  { path: '/app/garden', icon: '🌸', key: 'garden' },
  { path: '/app/path', icon: '🗺️', key: 'path' },
  { path: '/app/journal', icon: '📓', key: 'journal' },
  { path: '/app/feed', icon: '📹', key: 'feed' },
  { path: '/app/settings', icon: '⋯', key: 'settings' },
];

const NOTIFICATIONS = [
  { id: 1, text: 'Ananya answered your doubt about guitar 🎸', time: '2h ago' },
  { id: 2, text: 'Karan reacted +Water to your journal 🌱', time: '4h ago' },
  { id: 3, text: "You're 3 tasks away from Bud stage! 🪴", time: '1 day ago' },
  { id: 4, text: 'Rahul started following your garden 🌸', time: '2 days ago' },
];

function UserAvatar({ name }) {
  const initials = name ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U';
  return (
    <div style={{
      width: '36px', height: '36px', borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--brown-light), var(--brown-coffee))',
      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: '0.78rem', fontFamily: 'var(--font-body)', flexShrink: 0, cursor: 'pointer',
    }}>{initials}</div>
  );
}

function StreakBadge({ count }) {
  if (!count || count < 1) return null;
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      title={streakMessage(count)}
      style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        background: count >= 7
          ? 'linear-gradient(135deg, #FF6B35, #FF8C42)'
          : 'linear-gradient(135deg, var(--gold), var(--gold-light))',
        color: count >= 7 ? 'white' : 'var(--ink)',
        borderRadius: '99px', padding: '4px 10px',
        fontSize: '0.78rem', fontWeight: 700,
        fontFamily: 'var(--font-body)',
        cursor: 'default',
        boxShadow: count >= 7 ? '0 2px 8px rgba(255,107,53,0.4)' : '0 2px 8px rgba(201,146,10,0.3)',
      }}
    >
      <motion.span
        animate={count >= 3 ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >🔥</motion.span>
      <span>{count}</span>
    </motion.div>
  );
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { activeBranch, leaveBranch, isInBranch } = useBranch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('hl_onboarding_done'));
  const [openAddHobby, setOpenAddHobby] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Update streak on mount
    const result = updateStreak();
    setStreak(result.count);

    if (result.isNew && result.milestone) {
      const msgs = {
        3:  '🔥 3-day streak! You\'re building a habit!',
        7:  '🔥🔥 7-day streak! One full week!',
        14: '🔥🔥 14-day streak! Two weeks strong!',
        30: '🔥🔥🔥 30-day streak! Legendary gardener!',
      };
      setTimeout(() => showToast(msgs[result.milestone] || `🔥 ${result.milestone}-day streak!`, 'points'), 800);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (openAddHobby) {
      navigate('/app/garden', { state: { openAddHobby: true } });
      setOpenAddHobby(false);
    }
  }, [openAddHobby, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderSidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1rem' }}>
      <div style={{ padding: '0.5rem 0.5rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.jpg" alt="HobbyLily" style={{ height: '32px', borderRadius: '8px' }} />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--ink)' }}>HobbyLily</span>
        </div>
      </div>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            <span>{t(`nav.${item.key}`)}</span>
          </NavLink>
        ))}
      </nav>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <UserAvatar name={user?.name} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--ink)', fontFamily: 'var(--font-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Gardener'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || user?.phone || ''}</div>
        </div>
        <button onClick={handleLogout} title="Sign out" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: 0.6, padding: '4px' }}>↩</button>
      </div>
    </div>
  );

  return (
    <div className="app-shell">
      <aside className="hide-mobile app-sidebar">
        {renderSidebarContent()}
      </aside>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(26,18,7,0.4)', zIndex: 200, backdropFilter: 'blur(2px)' }} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="app-sidebar" style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '240px', zIndex: 201 }}>
              {renderSidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="app-main">
        <header className="app-header">
          <button className="hide-desktop" type="button" onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', padding: '4px' }}>☰</button>
          <div className="hide-desktop" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.jpg" alt="HobbyLily" style={{ height: '28px', borderRadius: '6px' }} />
          </div>
          <div style={{ flex: 1, maxWidth: '400px' }}>
            <input type="text" placeholder={t('common.searchPlaceholder')} className="form-input" style={{ padding: '8px 14px', fontSize: '0.88rem', background: 'var(--cream)' }} />
          </div>

          {/* Branch indicator — shows when in branch mode */}
          {isInBranch && activeBranch && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(91,184,245,0.15)', border: '1.5px solid var(--blue-soft)', borderRadius: '99px', padding: '5px 12px', flexShrink: 0 }}
            >
              <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>🌿</motion.span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brown-coffee)', fontFamily: 'var(--font-body)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeBranch.branchName}
              </span>
              <button
                onClick={leaveBranch}
                title="Exit branch"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--ink-muted)', padding: '0 2px', lineHeight: 1 }}
              >×</button>
            </motion.div>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Streak badge — between search and notifications */}
            <StreakBadge count={streak} />

            <div style={{ position: 'relative' }}>
              <button type="button" onClick={() => setShowNotifs((v) => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', position: 'relative' }}>
                🔔
                <span className="badge" style={{ position: 'absolute', top: '-6px', right: '-8px', background: 'var(--gold)' }}>3</span>
              </button>
              <AnimatePresence>
                {showNotifs && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="notif-dropdown">
                    {NOTIFICATIONS.map((n) => (
                      <div key={n.id} className="notif-item">
                        <p>{n.text}</p>
                        <span>{n.time}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div style={{ position: 'relative' }}>
              <div onClick={() => setShowUserMenu((v) => !v)} role="button" tabIndex={0}><UserAvatar name={user?.name} /></div>
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }} style={{ position: 'absolute', top: '44px', right: 0, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-hover)', padding: '0.5rem', minWidth: '180px', zIndex: 50 }}>
                    <div style={{ padding: '0.5rem 0.75rem' }}>
                      <motion.div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--ink)' }}>{user?.name}</motion.div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>{user?.email || user?.phone || ''}</div>
                    </div>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }} />
                    <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', fontSize: '0.88rem', borderRadius: '8px' }}>{t('common.signOut')} ↩</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
        <main className="app-content">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25, ease: 'easeOut' }} style={{ minHeight: '100%' }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <nav className="mobile-bottom-nav hide-desktop">
          {MOBILE_NAV.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
              <span>{item.icon}</span>
              <span>{t(`nav.${item.key}`)}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingOverlay onComplete={() => setShowOnboarding(false)} onOpenAddHobby={() => { setShowOnboarding(false); setOpenAddHobby(true); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
