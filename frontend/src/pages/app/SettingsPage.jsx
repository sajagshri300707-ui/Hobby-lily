import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PageMotion from '../../components/PageMotion';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { LANGUAGES } from '../../lib/i18n';
import i18n from '../../lib/i18n';

export default function SettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [notifs, setNotifs] = useState({ daily: true, weekly: true, reactions: true });
  const [journalPublic, setJournalPublic] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('hl_theme') === 'dark');
  const [language, setLanguage] = useState(() => localStorage.getItem('hl_language') || 'en');

  const initials = name ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('hl_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('hl_theme', 'light');
    }
  }, [darkMode]);

  const handleLanguageChange = (code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
    localStorage.setItem('hl_language', code);
    // RTL support for Arabic
    document.documentElement.setAttribute('dir', code === 'ar' ? 'rtl' : 'ltr');
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('hl_settings', JSON.stringify({ name, bio, notifs, journalPublic }));
    showToast(t('settings.save') + ' ✓');
  };

  const resetGarden = () => {
    if (window.confirm('Reset your entire garden? This cannot be undone.')) {
      showToast('Garden reset cancelled (demo)', 'error');
    }
  };

  return (
    <PageMotion style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', maxWidth: '680px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--ink)', marginBottom: '2rem' }}>
        {t('settings.title')}
      </h1>
      <form onSubmit={handleSave}>
        {/* Profile */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.25rem' }}>{t('settings.profile')}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-coffee))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem' }}>{initials}</div>
            <div>
              <div style={{ fontWeight: 600, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>{name || user?.name}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-muted)' }}>{user?.email}</div>
            </div>
          </div>
          <label className="form-label">{t('settings.name')}</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: '1rem' }} />
          <label className="form-label">{t('settings.email')}</label>
          <input className="form-input" value={user?.email || ''} disabled style={{ marginBottom: '1rem', opacity: 0.6 }} />
          <label className="form-label">{t('settings.bio')}</label>
          <textarea className="form-input" rows={3} placeholder={t('settings.bioPlaceholder')} value={bio} onChange={(e) => setBio(e.target.value)} style={{ resize: 'vertical' }} />
        </div>

        {/* Appearance */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.25rem' }}>{t('settings.appearance')}</h2>
          <ToggleRow
            label={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>{darkMode ? '🌙' : '☀️'}</span><span>{t('settings.darkMode')}</span></span>}
            checked={darkMode}
            onChange={() => setDarkMode((v) => !v)}
          />
          <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', marginTop: '-0.5rem' }}>
            {t('settings.darkModeDesc')}
          </p>
        </div>

        {/* Language */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{t('settings.language')}</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', marginBottom: '1.25rem' }}>
            {t('settings.languageDesc')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
            {LANGUAGES.map((lang) => (
              <motion.button
                key={lang.code}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                  border: language === lang.code ? '2px solid var(--brown-coffee)' : '1.5px solid var(--border)',
                  background: language === lang.code ? 'var(--brown-pale)' : 'var(--white)',
                  fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                  color: language === lang.code ? 'var(--brown-coffee)' : 'var(--ink-soft)',
                  fontWeight: language === lang.code ? 700 : 400,
                  transition: 'var(--transition)',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
                <div>
                  <div style={{ fontWeight: 600, lineHeight: 1.2 }}>{lang.nativeName}</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>{lang.label}</div>
                </div>
                {language === lang.code && (
                  <span style={{ marginLeft: 'auto', color: 'var(--brown-coffee)', fontSize: '0.9rem' }}>✓</span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.25rem' }}>{t('settings.notifications')}</h2>
          {[
            { key: 'daily', label: t('settings.dailyReminder') },
            { key: 'weekly', label: t('settings.weeklyInsights') },
            { key: 'reactions', label: t('settings.communityReactions') },
          ].map(({ key, label }) => (
            <ToggleRow key={key} label={label} checked={notifs[key]} onChange={() => setNotifs((n) => ({ ...n, [key]: !n[key] }))} />
          ))}
        </div>

        {/* Privacy */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.25rem' }}>{t('settings.privacy')}</h2>
          <ToggleRow label={t('settings.journalPublic')} checked={journalPublic} onChange={() => setJournalPublic((v) => !v)} />
        </div>

        {/* Danger zone */}
        <div className="card" style={{ padding: '1.75rem', border: '1px solid #FECACA', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#991B1B', marginBottom: '1rem' }}>{t('settings.dangerZone')}</h2>
          <button type="button" className="btn btn-ghost btn-sm" style={{ color: '#DC2626', borderColor: '#DC2626' }} onClick={resetGarden}>
            {t('settings.resetGarden')}
          </button>
        </div>

        <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>{t('settings.save')}</button>
      </form>
    </PageMotion>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>{label}</span>
      <button type="button" onClick={onChange} style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: checked ? 'var(--brown-coffee)' : 'var(--cream-dark)', position: 'relative',
        flexShrink: 0,
      }}>
        <motion.div animate={{ x: checked ? 22 : 2 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
      </button>
    </div>
  );
}
