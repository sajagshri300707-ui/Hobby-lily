import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import BloomProgress from '../../components/BloomProgress';
import { getStreak, streakMessage, streakFlame } from '../../lib/streakUtils';
import i18n from '../../lib/i18n';
import { playHobbyPlantedSound, playSkipSound } from '../../lib/sounds';

const CLIENT_MOCK_HOBBIES = [];
const CLIENT_MOCK_STATS = { totalHobbies: 0, daysActive: 0, tasksCompleted: 0, bloomStage: 'seed' };

const BLOOM_STAGES = {
  seed:       { emoji: '🌰', label: 'Seed',       className: 'flower-seed',      badge: 'stage-seed' },
  sprout:     { emoji: '🌱', label: 'Sprout',     className: 'flower-sprout',    badge: 'stage-sprout' },
  bud:        { emoji: '🪴', label: 'Bud',        className: 'flower-bud',       badge: 'stage-bud' },
  bloom:      { emoji: '🌺', label: 'Bloom',      className: 'flower-bloom',     badge: 'stage-bloom' },
  full_bloom: { emoji: '🌸', label: 'Full Bloom', className: 'flower-fullbloom', badge: 'stage-fullbloom' },
};

function FlowerCard({ hobby, onContinue }) {
  const { t } = useTranslation();
  const stage = BLOOM_STAGES[hobby.bloom_stage] || BLOOM_STAGES.seed;

  // Read path data from localStorage to get real chapter/task counts
  const pathData = (() => {
    try { return JSON.parse(localStorage.getItem(`path_${hobby.name}`) || 'null'); } catch { return null; }
  })();
  const totalChapters = pathData?.chapters?.length || 0;
  const completedTasks = pathData?.chapters?.flatMap(c => c.tasks || []).filter(t => t.status === 'completed').length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ y: -6, boxShadow: 'var(--shadow-hover)' }}
      className="card"
      style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'var(--white)' }}
    >
      <span className={`badge ${stage.badge}`} style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem', fontFamily: 'var(--font-body)' }}>
        {t(`common.bloomStages.${hobby.bloom_stage}`, stage.label)}
      </span>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--ink)', marginBottom: '0.25rem' }}>
        {hobby.emoji} {hobby.name}
      </h3>
      <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', marginBottom: '1rem' }}>
        {t('garden.daysActiveBadge', { count: hobby.days_active })} · {hobby.difficulty}
      </p>

      {/* Full bloom progress with bouquet system */}
      <BloomProgress
        percent={hobby.progress}
        completedTasks={completedTasks}
        totalChapters={totalChapters}
        showFull={totalChapters > 0}
      />

      <button onClick={() => onContinue(hobby)} className="btn btn-primary btn-sm"
        style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}>
        {t('garden.continuePath')}
      </button>
    </motion.div>
  );
}

function TypingText({ text }) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    setDisplay('');
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 18);
    return () => clearInterval(timer);
  }, [text]);
  return <span>{display}<span className="typing-cursor">|</span></span>;
}

// ─── Two-step Add Hobby Modal ─────────────────────────────────────────────────
function AddHobbyModal({ onClose, onAdd, navigate }) {
  const { t } = useTranslation();
  const lang = i18n.language || 'en';

  // step: 'choose' | 'direct' | 'describe'
  const [step, setStep] = useState('choose');
  const [directInput, setDirectInput] = useState('');
  const [priorContext, setPriorContext] = useState('');
  const [describeInput, setDescribeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [planting, setPlanting] = useState(false);
  const [error, setError] = useState('');

  // Collect inherited skills from all completed hobbies in localStorage
  const getInheritedSkills = () => {
    const skills = {};
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('skills_'));
      keys.forEach(k => {
        const hobbyName = k.replace('skills_', '');
        const raw = localStorage.getItem(k);
        if (!raw) return;
        const data = JSON.parse(raw);
        // Support both old format (array) and new format (object with profile)
        if (Array.isArray(data)) {
          skills[hobbyName] = { skills: data, profile: data.join(', ') };
        } else if (data?.skills?.length > 0 || data?.profile) {
          skills[hobbyName] = data;
        }
      });
    } catch {}
    return skills;
  };

  const langCultureMap = {
    hi: 'Indian culture, Bollywood music, classical Indian arts',
    es: 'Latin American and Spanish culture',
    fr: 'French culture and arts',
    de: 'German culture',
    ja: 'Japanese culture, J-pop, anime',
    zh: 'Chinese culture, C-pop, traditional Chinese arts',
    ar: 'Arabic culture, Middle Eastern music and arts',
    pt: 'Brazilian and Portuguese culture',
    ko: 'Korean culture, K-pop, K-drama',
  };
  const culturalContext = langCultureMap[lang] || '';

  const handleDirectGenerate = async (e) => {
    e.preventDefault();
    if (!directInput.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/hobbies', {
        name: directInput.trim(),
        emoji: '🌱',
        difficulty: 'beginner',
        estimated_time_per_day: '30 mins/day',
      });

      const inherited = getInheritedSkills();
      const hasContext = priorContext.trim() || Object.keys(inherited).length > 0;

      // Assess what chapter to start at
      let startChapter = 1;
      let skipData = null;
      if (hasContext) {
        try {
          const assessRes = await api.post('/ai/assess-start-chapter', {
            hobbyName: directInput.trim(),
            inheritedSkills: inherited,
            priorContext: priorContext.trim(),
          });
          startChapter = assessRes.data.startChapter || 1;
          if (assessRes.data.skippedChapters > 0) skipData = assessRes.data;
        } catch {}
      }

      // Generate the starting chapter
      const chRes = await api.post('/ai/generate-chapter', {
        hobbyName: directInput.trim(),
        chapterNumber: startChapter,
        completedChapters: [],
        language: lang,
        culturalContext,
        priorContext: priorContext.trim(),
        inheritedSkills: inherited,
      });
      if (chRes.data?.tasks) {
        chRes.data.tasks = chRes.data.tasks.map((t, j) => ({
          ...t, id: Date.now() + j, taskNumber: j + 1,
          status: j === 0 ? 'current' : 'upcoming',
        }));
        const pathObj = {
          hobbyName: directInput.trim(),
          chapters: [chRes.data],
          skipData,
          startedAtChapter: startChapter,
        };
        localStorage.setItem(`path_${directInput.trim()}`, JSON.stringify(pathObj));
      }
      onAdd(res.data);
      onClose();
      playHobbyPlantedSound();
      if (skipData) setTimeout(() => playSkipSound(), 700);
      navigate('/app/path', { state: { hobbyId: res.data.id } });
    } catch (err) {
      console.error("Direct Generate Error:", err);
      setError('Failed to add hobby: ' + (err.response?.data?.error || err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDescribeSuggest = async (e) => {
    e.preventDefault();
    if (!describeInput.trim()) return;
    setLoading(true);
    setError('');
    setSuggestion(null);
    setAlternatives([]);
    try {
      const res = await api.post('/ai/suggest-hobbies', { input: describeInput, language: lang });
      const hobbies = res.data.hobbies || [];
      if (hobbies.length) { setSuggestion(hobbies[0]); setAlternatives(hobbies.slice(1)); }
    } catch { setError('AI is taking a breather. Try again in a moment 🌱'); }
    finally { setLoading(false); }
  };

  const handlePlant = async () => {
    if (!suggestion) return;
    setPlanting(true);
    try {
      const res = await api.post('/hobbies', {
        name: suggestion.hobbyName, emoji: suggestion.emoji,
        difficulty: suggestion.difficulty, estimated_time_per_day: suggestion.estimatedTimePerDay,
      });

      const inherited = getInheritedSkills();
      let startChapter = 1;
      let skipData = null;
      if (Object.keys(inherited).length > 0) {
        try {
          const assessRes = await api.post('/ai/assess-start-chapter', {
            hobbyName: suggestion.hobbyName,
            inheritedSkills: inherited,
            priorContext: '',
          });
          startChapter = assessRes.data.startChapter || 1;
          if (assessRes.data.skippedChapters > 0) skipData = assessRes.data;
        } catch {}
      }

      const chRes = await api.post('/ai/generate-chapter', {
        hobbyName: suggestion.hobbyName, chapterNumber: startChapter,
        completedChapters: [], language: lang, culturalContext,
        priorContext: '',
        inheritedSkills: inherited,
      });
      if (chRes.data?.tasks) {
        chRes.data.tasks = chRes.data.tasks.map((t, j) => ({
          ...t, id: Date.now() + j, taskNumber: j + 1,
          status: j === 0 ? 'current' : 'upcoming',
        }));
        localStorage.setItem(`path_${suggestion.hobbyName}`, JSON.stringify({
          hobbyName: suggestion.hobbyName,
          chapters: [chRes.data],
          skipData,
          startedAtChapter: startChapter,
        }));
      }
      onAdd(res.data);
      onClose();
      playHobbyPlantedSound();
      if (skipData) setTimeout(() => playSkipSound(), 700);
      navigate('/app/path', { state: { hobbyId: res.data.id } });
    } catch (err) {
      console.error("Plant Error:", err);
      setError('Failed to add hobby: ' + (err.response?.data?.error || err.message || 'Unknown error'));
    } finally { setPlanting(false); }
  };

  const QUICK_IDEAS = [
    'something I can do at night',
    'a hobby that costs nothing',
    'I want to feel creative',
    'something calming',
  ];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="modal-box" style={{ padding: '2rem' }}
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--ink)', marginBottom: '0.25rem' }}>
              {step === 'choose' ? 'Plant a new hobby 🌱' : step === 'direct' ? 'I have a hobby in mind 🎯' : 'Describe to Katelyn ✨'}
            </h2>
            <p style={{ color: 'var(--ink-muted)', fontSize: '0.88rem', fontFamily: 'var(--font-body)' }}>
              {step === 'choose' ? 'How would you like to start?' : step === 'direct' ? 'Type your hobby and we\'ll build your path' : 'Tell Katelyn your vibe — she\'ll find the perfect hobby'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--ink-muted)' }}>×</button>
        </div>

        <AnimatePresence mode="wait">

          {/* ── Step 1: Choose ── */}
          {step === 'choose' && (
            <motion.div key="choose" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {/* Direct path button */}
              <button
                type="button"
                onClick={() => setStep('direct')}
                style={{
                  width: '100%', padding: '1.25rem 1.5rem', borderRadius: '14px', cursor: 'pointer',
                  border: '2px solid var(--border)', background: 'var(--white)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '1rem', transition: 'var(--transition)',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--brown-coffee)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', marginBottom: '3px' }}>I have a hobby in mind</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)' }}>Type it directly and generate your path</p>
                </div>
                <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>→</span>
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>

              {/* Describe to Katelyn button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('describe')}
                style={{
                  width: '100%', padding: '1.25rem 1.5rem', borderRadius: '14px', cursor: 'pointer',
                  border: '2px solid var(--gold)', background: 'linear-gradient(135deg, var(--gold-pale), #FFF8E1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gold)', marginBottom: '3px' }}>Don't know what hobby you like?</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>Describe to Katelyn — she'll find the perfect one for you</p>
                </div>
                <span style={{ fontSize: '1.5rem' }}>✨</span>
              </motion.button>
            </motion.div>
          )}

          {step === 'direct' && (
            <motion.div key="direct" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button type="button" onClick={() => setStep('choose')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', marginBottom: '1rem', padding: 0 }}>← Back</button>
              <form onSubmit={handleDirectGenerate}>
                <input
                  className="form-input"
                  placeholder="e.g. Guitar, Watercolor, Chess, Pottery…"
                  value={directInput}
                  onChange={e => setDirectInput(e.target.value)}
                  style={{ marginBottom: '0.75rem', fontSize: '1rem' }}
                  autoFocus
                />

                {/* Prior knowledge field */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-soft)', fontFamily: 'var(--font-body)', marginBottom: '6px' }}>
                    What do you already know? <span style={{ fontWeight: 400, color: 'var(--ink-muted)' }}>(optional)</span>
                  </label>
                  <textarea
                    className="form-input"
                    rows={2}
                    placeholder='e.g. "I played guitar for 2 years, know basic chords and some music theory"'
                    value={priorContext}
                    onChange={e => setPriorContext(e.target.value)}
                    style={{ resize: 'none', fontSize: '0.88rem' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', marginTop: '4px' }}>
                    AI will skip what you already know and start you at the right level.
                  </p>
                </div>

                {/* Show inherited skills from other hobbies */}
                {(() => {
                  const inherited = getInheritedSkills();
                  const entries = Object.entries(inherited);
                  if (entries.length === 0) return null;
                  return (
                    <div style={{ background: 'var(--gold-pale)', border: '1px solid var(--gold-light)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gold)', fontFamily: 'var(--font-body)', marginBottom: '6px' }}>
                        🧠 Skills you can inherit from your other hobbies:
                      </p>
                      {entries.map(([hobby, data]) => (
                        <p key={hobby} style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontFamily: 'var(--font-body)', marginBottom: '2px' }}>
                          <strong>{hobby}:</strong> {data.profile || (data.skills || []).join(', ')}
                        </p>
                      ))}
                      <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', marginTop: '6px' }}>
                        These will be automatically applied — you may skip ahead!
                      </p>
                    </div>
                  );
                })()}

                {error && <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#FEE2E2', borderRadius: '10px', fontSize: '0.85rem', color: '#991B1B' }}>{error}</div>}
                <button type="submit" className="btn btn-primary" disabled={loading || !directInput.trim()} style={{ width: '100%', justifyContent: 'center' }}>
                  {loading ? '✨ Generating your path…' : 'Generate Path →'}
                </button>
              </form>
            </motion.div>
          )}

          {/* ── Step 2b: Describe to Katelyn ── */}
          {step === 'describe' && (
            <motion.div key="describe" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button type="button" onClick={() => { setStep('choose'); setSuggestion(null); setAlternatives([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', marginBottom: '1rem', padding: 0 }}>← Back</button>
              <form onSubmit={handleDescribeSuggest}>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder={`Type anything... "I want to feel creative", "something I can do at night", "a hobby that costs nothing"`}
                  value={describeInput}
                  onChange={e => setDescribeInput(e.target.value)}
                  style={{ resize: 'none', marginBottom: '0.75rem' }}
                  autoFocus
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                  {QUICK_IDEAS.map(idea => (
                    <button key={idea} type="button" onClick={() => setDescribeInput(idea)}
                      style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.78rem', border: '1px solid var(--border)', background: 'var(--cream)', color: 'var(--ink-soft)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      {idea}
                    </button>
                  ))}
                </div>
                <button type="submit" className="btn btn-gold" disabled={loading || !describeInput.trim()} style={{ width: '100%', justifyContent: 'center' }}>
                  {loading ? '✨ Katelyn is thinking…' : '✨ Find my perfect hobby'}
                </button>
              </form>

              {error && <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#FEE2E2', borderRadius: '10px', fontSize: '0.85rem', color: '#991B1B' }}>{error}</div>}

              <AnimatePresence>
                {suggestion && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, var(--cream), var(--brown-pale))', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '3rem' }}>{suggestion.emoji}</span>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--ink)' }}>{suggestion.hobbyName}</h3>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.75rem', padding: '2px 10px', background: 'var(--gold-pale)', color: 'var(--gold)', borderRadius: '99px', fontWeight: 600 }}>{suggestion.difficulty}</span>
                          <span style={{ fontSize: '0.75rem', padding: '2px 10px', background: 'var(--blue-pale)', color: 'var(--blue-soft)', borderRadius: '99px', fontWeight: 600 }}>⏱ {suggestion.estimatedTimePerDay}</span>
                        </div>
                      </div>
                    </div>
                    <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontFamily: 'var(--font-body)', fontSize: '0.92rem', marginBottom: '0.75rem' }}>
                      <TypingText text={suggestion.reason} />
                    </p>
                    {alternatives.length > 0 && (
                      <div style={{ marginBottom: '1.25rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: '8px' }}>Other ideas</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {alternatives.map(alt => (
                            <button key={alt.hobbyName} type="button"
                              onClick={() => { setAlternatives(prev => [...prev.filter(a => a.hobbyName !== alt.hobbyName), suggestion]); setSuggestion(alt); }}
                              style={{ padding: '6px 12px', borderRadius: 99, border: '1px solid var(--border)', background: 'var(--white)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.78rem' }}>
                              {alt.emoji} {alt.hobbyName}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn btn-gold" onClick={handlePlant} disabled={planting} style={{ flex: 1, justifyContent: 'center' }}>
                        {planting ? 'Generating your path... 🌱' : 'Plant this seed 🌱'}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setSuggestion(null); setAlternatives([]); }}>Try again</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function StreakCard() {
  const { count } = getStreak();
  if (!count) return null;
  const milestones = [3, 7, 14, 30];
  const nextMilestone = milestones.find(m => m > count) || 30;
  const prevMilestone = [...milestones].reverse().find(m => m <= count) || 0;
  const progressToNext = prevMilestone === nextMilestone ? 100 : Math.round(((count - prevMilestone) / (nextMilestone - prevMilestone)) * 100);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      style={{ background: count >= 7 ? 'linear-gradient(135deg, #FF6B35, #FF8C42)' : 'linear-gradient(135deg, var(--gold), var(--gold-light))', borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem', color: count >= 7 ? 'white' : 'var(--ink)', boxShadow: count >= 7 ? '0 4px 20px rgba(255,107,53,0.35)' : '0 4px 20px rgba(201,146,10,0.25)' }}>
      <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: '2.5rem', lineHeight: 1 }}>🔥</motion.div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '2px' }}>{count}-day streak {streakFlame(count)}</div>
        <div style={{ fontSize: '0.82rem', opacity: 0.85, fontFamily: 'var(--font-body)', marginBottom: '8px' }}>{streakMessage(count)}</div>
        {count < 30 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.72rem', opacity: 0.8 }}>
              <span>{count} days</span><span>Next: {nextMilestone} days</span>
            </div>
            <div style={{ height: '5px', background: 'rgba(255,255,255,0.3)', borderRadius: '99px', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${progressToNext}%` }} transition={{ duration: 1 }} style={{ height: '100%', background: 'rgba(255,255,255,0.8)', borderRadius: '99px' }} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-card)' }}>
      <span style={{ fontSize: '1.6rem' }}>{icon}</span>
      <div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', marginTop: '2px' }}>{label}</div>
      </div>
    </div>
  );
}

export default function GardenPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [hobbies, setHobbies] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { if (location.state?.openAddHobby) setShowModal(true); }, [location.state]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hobbiesRes, statsRes] = await Promise.all([api.get('/hobbies'), api.get('/hobbies/user/stats')]);
      setHobbies(hobbiesRes.data?.length > 0 ? hobbiesRes.data : CLIENT_MOCK_HOBBIES);
      setStats(statsRes.data?.totalHobbies > 0 ? statsRes.data : CLIENT_MOCK_STATS);
    } catch {
      setHobbies(CLIENT_MOCK_HOBBIES);
      setStats(CLIENT_MOCK_STATS);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleContinue = (hobby) => navigate('/app/path', { state: { hobbyId: hobby.id } });
  const handleAddHobby = (newHobby) => { setHobbies(prev => [...prev, newHobby]); fetchData(); };

  const STAT_CARDS = stats ? [
    { icon: '🌱', value: stats.totalHobbies, label: t('garden.totalHobbies') },
    { icon: '📅', value: stats.daysActive, label: t('garden.daysActive') },
    { icon: '✅', value: stats.tasksCompleted, label: t('garden.tasksCompleted') },
    { icon: '🌺', value: BLOOM_STAGES[stats.bloomStage]?.label || 'Seed', label: t('garden.topBloom') },
  ] : [];

  return (
    <div style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.8rem', letterSpacing: '0.12em', color: 'var(--brown-light)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>
            {t('garden.welcome')} 🌸
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--ink)', lineHeight: 1.1 }}>
            {t('garden.title')}, {user?.name?.split(' ')[0] || 'Gardener'}
          </h1>
        </div>
        <button id="add-hobby-btn" className="btn btn-primary" onClick={() => setShowModal(true)}>
          {t('garden.addHobby')}
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '80px' }} />)}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {STAT_CARDS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && <StreakCard />}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--ink)' }}>
          {t('garden.title')}
        </h2>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>
          {t('garden.growing', { count: hobbies.length })}
        </span>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '320px' }} />)}
        </div>
      ) : hobbies.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--ink)', marginBottom: '0.75rem' }}>{t('garden.gardenWaiting')}</h3>
          <p style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', marginBottom: '1.5rem', maxWidth: '360px', margin: '0 auto 1.5rem' }}>{t('garden.gardenWaitingDesc')}</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>{t('garden.plantFirst')}</button>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {hobbies.map((hobby, i) => (
            <motion.div key={hobby.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <FlowerCard hobby={hobby} onContinue={handleContinue} />
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: hobbies.length * 0.1 }}
            onClick={() => setShowModal(true)} className="card"
            style={{ padding: '1.75rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: '2px dashed var(--border)', background: 'transparent', boxShadow: 'none', minHeight: '280px' }}
            whileHover={{ borderColor: 'var(--brown-light)', background: 'var(--brown-pale)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.5 }}>+</div>
            <p style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>{t('garden.addNewHobby')}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', marginTop: '4px' }}>{t('garden.aiPicksPerfect')}</p>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {showModal && <AddHobbyModal onClose={() => setShowModal(false)} onAdd={handleAddHobby} navigate={navigate} />}
      </AnimatePresence>
    </div>
  );
}
