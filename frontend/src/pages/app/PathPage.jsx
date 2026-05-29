import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import api from '../../lib/api';
import BloomProgress from '../../components/BloomProgress';

// ─── YouTube Video Panel ────────────────────────────────────────────────────
function YouTubePanel({ searchQuery, fallbackUrl }) {
  const [open, setOpen] = useState(false);
  const [videos, setVideos] = useState(null);   // null = not fetched yet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchVideos = useCallback(async () => {
    if (videos !== null) return;   // already fetched
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/ai/youtube-search?q=${encodeURIComponent(searchQuery)}`);
      setVideos(res.data.videos || []);
    } catch {
      setError(true);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, videos]);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) fetchVideos();
  };

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {/* Toggle button */}
      <button
        onClick={handleToggle}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: open ? '#DC2626' : '#FEE2E2',
          color: open ? '#fff' : '#991B1B',
          border: 'none', borderRadius: '99px',
          padding: '7px 16px', fontSize: '0.82rem', fontWeight: 700,
          cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)',
        }}
      >
        📺 {open ? 'Hide tutorials' : 'Watch tutorials'}
        <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: '0.75rem',
              background: 'linear-gradient(135deg, #FFF5F5, #FFF)',
              border: '1.5px solid #FECACA',
              borderRadius: '14px',
              padding: '1rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#991B1B', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                  TOP TUTORIALS FROM YOUTUBE
                </p>
                <a
                  href={fallbackUrl}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '0.72rem', color: '#DC2626', fontFamily: 'var(--font-body)', textDecoration: 'none', opacity: 0.8 }}
                >
                  Search all →
                </a>
              </div>

              {/* Loading skeletons */}
              {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div className="skeleton" style={{ width: '120px', height: '68px', borderRadius: '8px', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div className="skeleton" style={{ height: '14px', width: '80%', borderRadius: '4px', marginBottom: '8px' }} />
                        <div className="skeleton" style={{ height: '12px', width: '50%', borderRadius: '4px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error / fallback */}
              {!loading && error && (
                <div style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>
                  <div style={{ marginBottom: '8px' }}>😔 Couldn't load videos right now.</div>
                  <a href={fallbackUrl} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#DC2626', fontWeight: 600, textDecoration: 'none' }}>
                    Search YouTube manually →
                  </a>
                </div>
              )}

              {/* Video cards */}
              {!loading && !error && videos && videos.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {videos.map((v, idx) => (
                    <motion.a
                      key={v.videoId}
                      href={v.url}
                      target="_blank" rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      style={{
                        display: 'flex', gap: '12px', alignItems: 'center',
                        background: '#fff', borderRadius: '10px',
                        border: '1px solid #FECACA',
                        padding: '8px', textDecoration: 'none',
                        transition: 'all 0.18s', cursor: 'pointer',
                      }}
                      whileHover={{ scale: 1.01, boxShadow: '0 4px 16px rgba(220,38,38,0.12)', borderColor: '#FCA5A5' }}
                    >
                      {/* Thumbnail */}
                      <div style={{ position: 'relative', flexShrink: 0, width: '120px', height: '68px', borderRadius: '7px', overflow: 'hidden', background: '#111' }}>
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          onError={e => { e.target.style.opacity = '0'; }}
                        />
                        {/* Play overlay */}
                        <div style={{
                          position: 'absolute', inset: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(0,0,0,0.2)',
                          transition: 'background 0.2s',
                        }}>
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: 'rgba(220,38,38,0.9)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <span style={{ color: '#fff', fontSize: '10px', marginLeft: '2px' }}>▶</span>
                          </div>
                        </div>
                        {/* Duration badge */}
                        {v.duration && (
                          <span style={{
                            position: 'absolute', bottom: '4px', right: '4px',
                            background: 'rgba(0,0,0,0.8)', color: '#fff',
                            fontSize: '0.65rem', padding: '1px 5px',
                            borderRadius: '3px', fontWeight: 700,
                          }}>{v.duration}</span>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)',
                          fontFamily: 'var(--font-body)', lineHeight: 1.35,
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          marginBottom: '6px',
                        }}>{v.title}</p>
                        <p style={{ fontSize: '0.72rem', color: '#DC2626', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                          {v.author}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}

              {/* No results */}
              {!loading && !error && videos && videos.length === 0 && (
                <div style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>
                  No videos found. <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#DC2626', fontWeight: 600 }}>Try YouTube →</a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MOCK_GUITAR_PATH = {
  hobbyName: "Guitar",
  totalDuration: "14 weeks",
  chapters: [
    {
      chapterNumber: 1,
      chapterTitle: "Getting Your Hands Ready",
      chapterDescription: "Build the foundational physical habits required to play.",
      estimatedDuration: "2 weeks",
      tasks: [
        { id: 1, taskNumber: 1, taskTitle: "Learn parts of guitar", taskDescription: "Understand the neck, frets, body, and tuning pegs. This helps you speak the language of guitar.", estimatedTime: "30 mins", difficulty: "Easy", status: "completed", commonChallenges: [{ challenge: "Forgetting the names", solution: "Label them with sticky notes for a few days." }], proTip: "Knowing the parts helps you troubleshoot tuning issues faster.", youtubeSearch: "Guitar parts beginner tutorial", articleSearch: "Learn parts of guitar beginner guide tips" },
        { id: 2, taskNumber: 2, taskTitle: "Tune with app", taskDescription: "Use a free app like GuitarTuna to get your guitar in standard EADGBE tuning.", estimatedTime: "20 mins", difficulty: "Easy", status: "completed", commonChallenges: [{ challenge: "Tuning pegs feel too tight", solution: "Turn them slowly and pluck the string constantly." }], proTip: "Always tune UP to a note, not down to it. It holds pitch better.", youtubeSearch: "How to tune guitar with app", articleSearch: "Standard tuning guitar beginner guide tips" },
        { id: 3, taskNumber: 3, taskTitle: "Learn posture and pick holding", taskDescription: "Sit up straight and hold the pick firmly but flexibly between your thumb and index finger.", estimatedTime: "45 mins", difficulty: "Easy", status: "completed", commonChallenges: [{ challenge: "Pick slips out of hand", solution: "Hold it closer to the tip, leaving only a tiny edge exposed." }], proTip: "Keep your wrist loose. The motion comes from the wrist, not the elbow.", youtubeSearch: "Guitar posture and pick holding", articleSearch: "How to hold a guitar pick beginner tips" }
      ]
    },
    {
      chapterNumber: 2,
      chapterTitle: "Your First Chords",
      chapterDescription: "Learn the foundational open chords used in millions of songs.",
      estimatedDuration: "3 weeks",
      tasks: [
        { id: 4, taskNumber: 1, taskTitle: "C Major chord", taskDescription: "Place your fingers on the correct frets to play a bright, happy C Major chord.", estimatedTime: "1 hour", difficulty: "Medium", status: "completed", commonChallenges: [{ challenge: "Muted strings", solution: "Arch your fingers more." }], proTip: "Press right behind the fret wire, not in the middle of the fret.", youtubeSearch: "C Major chord guitar beginner tutorial", articleSearch: "How to play C Major chord guitar beginner guide tips" },
        { id: 5, taskNumber: 2, taskTitle: "G Major chord", taskDescription: "Learn the G Major chord, a very common and powerful open chord.", estimatedTime: "1 hour", difficulty: "Medium", status: "completed", commonChallenges: [{ challenge: "Stretching fingers far enough", solution: "Rotate your wrist slightly forward." }], proTip: "Leave your third finger on the high E string as an anchor when switching to D.", youtubeSearch: "G Major chord guitar beginner tutorial", articleSearch: "How to play G Major chord guitar beginner guide tips" },
        { id: 6, taskNumber: 3, taskTitle: "D Major chord", taskDescription: "Learn the D Major chord shape and make sure all notes ring clearly.", estimatedTime: "1 hour", difficulty: "Medium", status: "current", commonChallenges: [
            { id: 1, challenge: "My ring finger keeps touching the high e string and muting it", solution: "Arch your ring finger more — only the fingertip should touch the string.", upvotes: 12, isCommon: true },
            { id: 2, challenge: "I can play D chord alone but cannot switch from G fast enough", solution: "Practice only the G to D switch in slow motion 20 times before adding strumming.", upvotes: 8, isCommon: true },
            { id: 3, challenge: "My wrist hurts after 10 minutes of practice", solution: "Stop immediately and check your wrist angle — it should be relatively straight.", upvotes: 5, isCommon: false }
          ], proTip: "Only strum the top 4 strings for a clean D Major sound.", youtubeSearch: "D Major chord guitar beginner tutorial", articleSearch: "How to play D Major chord guitar beginner guide tips" },
        { id: 7, taskNumber: 4, taskTitle: "Em chord", taskDescription: "Learn E minor, one of the easiest and moodiest open chords.", estimatedTime: "30 mins", difficulty: "Easy", status: "upcoming", commonChallenges: [{ challenge: "Fingers feel cramped", solution: "Use your middle and ring fingers together." }], proTip: "You can strum all 6 strings for E minor.", youtubeSearch: "Em chord guitar beginner tutorial", articleSearch: "How to play E minor chord guitar beginner guide tips" }
      ]
    },
    {
      chapterNumber: 3,
      chapterTitle: "Your First Song",
      chapterDescription: "Combine your chords to play a real song.",
      estimatedDuration: "2 weeks",
      tasks: [
        { id: 8, taskNumber: 1, taskTitle: "Basic down strumming pattern", taskDescription: "Play 4 down strums per measure on a single chord.", estimatedTime: "1 hour", difficulty: "Easy", status: "upcoming", commonChallenges: [{ challenge: "Losing the beat", solution: "Tap your foot along with the strums." }], proTip: "Keep your hand moving in a continuous motion even if you miss a strum.", youtubeSearch: "Basic down strumming pattern beginner tutorial", articleSearch: "Guitar strumming patterns beginner guide tips" },
        { id: 9, taskNumber: 2, taskTitle: "Play Knockin on Heaven's Door", taskDescription: "Use G, D, Am, and C to play this classic Bob Dylan song.", estimatedTime: "3 hours", difficulty: "Hard", status: "upcoming", commonChallenges: [{ challenge: "Changing chords in time", solution: "Practice the transitions without strumming first." }], proTip: "Singing along, even badly, helps you internalize the rhythm.", youtubeSearch: "Knockin on Heavens Door guitar beginner tutorial", articleSearch: "Easy guitar songs Knockin on Heavens Door beginner guide tips" }
      ]
    },
    {
      chapterNumber: 4,
      chapterTitle: "Building Rhythm",
      chapterDescription: "Add up-strums and complexity to your playing.",
      estimatedDuration: "3 weeks",
      tasks: [
        { id: 10, taskNumber: 1, taskTitle: "Down-up strumming pattern", taskDescription: "Learn to strum smoothly in both directions.", estimatedTime: "2 hours", difficulty: "Medium", status: "upcoming", commonChallenges: [{ challenge: "Up-strums sound harsh", solution: "Use less pick and a lighter touch on the way up." }], proTip: "Your hand should work like a metronome pendulum.", youtubeSearch: "Down up strumming pattern beginner tutorial", articleSearch: "Guitar strumming technique beginner guide tips" },
        { id: 11, taskNumber: 2, taskTitle: "Learn 3 chord song structures", taskDescription: "Understand how I-IV-V progressions work in popular music.", estimatedTime: "2 hours", difficulty: "Medium", status: "upcoming", commonChallenges: [{ challenge: "Finding the right chords", solution: "Memorize the I-IV-V in keys of G, C, and D." }], proTip: "Once you know these structures, you can guess the chords to hundreds of songs.", youtubeSearch: "3 chord song structures beginner tutorial", articleSearch: "Guitar music theory beginner guide tips" }
      ]
    },
    {
      chapterNumber: 5,
      chapterTitle: "Your First Original Sound",
      chapterDescription: "Start making the guitar your own.",
      estimatedDuration: "4 weeks",
      tasks: [
        { id: 12, taskNumber: 1, taskTitle: "Learn a song you love", taskDescription: "Pick your favorite song and learn it start to finish.", estimatedTime: "1 week", difficulty: "Hard", status: "upcoming", commonChallenges: [{ challenge: "Song is too fast", solution: "Use YouTube's playback speed to slow it down to 50%." }], proTip: "Focus on getting through the whole song clumsily before perfecting individual parts.", youtubeSearch: "How to learn any song on guitar beginner tutorial", articleSearch: "Learning songs on guitar beginner guide tips" },
        { id: 13, taskNumber: 2, taskTitle: "Record and share your first video", taskDescription: "Record yourself playing and share it with a friend or community.", estimatedTime: "1 hour", difficulty: "Medium", status: "upcoming", commonChallenges: [{ challenge: "Red light syndrome", solution: "Hit record and leave it running for 20 minutes while you practice." }], proTip: "Recording yourself is the fastest way to identify areas for improvement.", youtubeSearch: "Recording guitar video on phone beginner tutorial", articleSearch: "Sharing guitar progress beginner guide tips" }
      ]
    }
  ]
};

function TaskItem({ task, index, onComplete, hobbyName, onUpvoteChallenge }) {
  const isCompleted = task.status === 'completed';
  const isCurrent   = task.status === 'current';
  const isUpcoming  = task.status === 'upcoming';
  const [completing, setCompleting] = useState(false);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [challengeText, setChallengeText] = useState('');
  const [solutionText, setSolutionText] = useState('');
  const { showToast } = useToast();

  const handleComplete = async () => {
    setCompleting(true);
    await onComplete(task.id, task.taskTitle);
    setCompleting(false);
  };
  
  const handlePostChallenge = () => {
    if (!challengeText.trim()) return;
    showToast('+5 points 🌱', 'points');
    setShowChallengeForm(false);
    setChallengeText('');
    setSolutionText('');
  };

  const lang = localStorage.getItem('hl_language') || 'en';
  const langYT = { hi: 'Hindi', es: 'en español', fr: 'en français', de: 'auf Deutsch', ja: '日本語', zh: '中文', ar: 'بالعربية', pt: 'em português', ko: '한국어' };
  const langSuffix = langYT[lang] ? ` ${langYT[lang]}` : '';
  const ytSearchQuery = task.youtubeSearch
    ? `${task.youtubeSearch}${langSuffix}`
    : `${hobbyName} ${task.taskTitle} beginner tutorial${langSuffix}`;
  const ytFallbackUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ytSearchQuery)}`;
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(`how to ${task.taskTitle} ${hobbyName} beginner tips${langSuffix}`)}${lang !== 'en' ? `&hl=${lang}` : ''}`;

  const sortedChallenges = [...(task.commonChallenges || [])].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        background: isCompleted ? 'var(--cream)' : 'var(--white)',
        border: isCurrent ? '2px solid var(--blue-soft)' : '1px solid var(--border)',
        borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem',
        opacity: isUpcoming ? 0.8 : 1,
        boxShadow: isCurrent ? '0 4px 20px rgba(168,196,212,0.3)' : 'var(--shadow-card)',
        position: 'relative', overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
          background: isCompleted ? 'var(--gold)' : isCurrent ? 'var(--blue-soft)' : 'var(--cream-dark)',
          color: isCompleted ? 'var(--white)' : 'var(--ink-muted)',
          animation: isCurrent ? 'pulse-ring 2s infinite' : 'none',
        }}>
          {isCompleted ? '✓' : isCurrent ? '▶' : `${task.taskNumber || index + 1}`}
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: isCompleted ? 'var(--ink-muted)' : 'var(--ink)', textDecoration: isCompleted ? 'line-through' : 'none', marginBottom: '4px' }}>
              {task.taskTitle}
            </h4>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '99px', background: 'var(--cream-dark)', color: 'var(--ink-muted)' }}>⏱ {task.estimatedTime}</span>
              <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '99px', background: 'var(--brown-pale)', color: 'var(--brown-coffee)' }}>{task.difficulty}</span>
            </div>
          </div>
          
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '1rem' }}>{task.taskDescription}</p>

          {task.proTip && (
            <div style={{ background: 'var(--gold-pale)', borderLeft: '4px solid var(--gold)', padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}><strong>💡 Pro Tip:</strong> {task.proTip}</p>
            </div>
          )}

          {/* YouTube video panel */}
          <YouTubePanel searchQuery={ytSearchQuery} fallbackUrl={ytFallbackUrl} />

          {/* Article search link */}
          <div style={{ marginBottom: '1.5rem' }}>
            <a href={googleUrl} target="_blank" rel="noopener noreferrer"
              style={{ background: '#EBF4F8', color: '#1565C0', padding: '7px 16px', borderRadius: '99px', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 700, fontFamily: 'var(--font-body)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              📖 Read articles →
            </a>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <h5 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '2px' }}>👥 Community Challenges</h5>
            <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginBottom: '1rem' }}>Real struggles from real learners</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
              {sortedChallenges.map((c, idx) => (
                <div key={idx} style={{ background: '#FFF5F0', border: '1px solid #FFD8C4', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#C2410C' }}>{c.challenge}</p>
                    {c.upvotes >= 3 && <span style={{ fontSize: '0.7rem', background: '#FEE2E2', color: '#991B1B', padding: '2px 8px', borderRadius: '99px', fontWeight: 600 }}>🔥 Common issue</span>}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>{c.solution}</p>
                  {c.upvotes > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => onUpvoteChallenge && onUpvoteChallenge(task.id, idx)}
                        style={{
                          background: 'none', border: '1px solid #FFD8C4', borderRadius: '99px',
                          padding: '2px 10px', cursor: 'pointer', fontSize: '0.75rem',
                          color: '#C2410C', fontFamily: 'var(--font-body)', fontWeight: 600,
                          transition: 'var(--transition)',
                        }}
                      >
                        ❤️ {c.upvotes}
                      </button>
                    </div>
                  )}
                  {!c.upvotes && (
                    <button
                      type="button"
                      onClick={() => onUpvoteChallenge && onUpvoteChallenge(task.id, idx)}
                      style={{
                        background: 'none', border: '1px solid #FFD8C4', borderRadius: '99px',
                        padding: '2px 10px', cursor: 'pointer', fontSize: '0.75rem',
                        color: '#C2410C', fontFamily: 'var(--font-body)', fontWeight: 600,
                        marginTop: '6px', transition: 'var(--transition)',
                      }}
                    >
                      ❤️ 0
                    </button>
                  )}
                </div>
              ))}
            </div>

            {!showChallengeForm ? (
              <button className="btn btn-ghost btn-sm" onClick={() => setShowChallengeForm(true)}>+ Post your challenge</button>
            ) : (
              <div style={{ background: 'var(--cream-dark)', padding: '1rem', borderRadius: '8px' }}>
                <textarea className="form-input" rows={2} placeholder="Describe the challenge you faced..." value={challengeText} onChange={e => setChallengeText(e.target.value)} style={{ marginBottom: '8px' }} />
                <textarea className="form-input" rows={2} placeholder="How did you solve it? (optional)" value={solutionText} onChange={e => setSolutionText(e.target.value)} style={{ marginBottom: '8px' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-primary btn-sm" onClick={handlePostChallenge}>Submit</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowChallengeForm(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {isCurrent && (
            <button className="btn btn-gold" onClick={handleComplete} disabled={completing} style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}>
              {completing ? '...' : 'Mark Complete ✓'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ChapterAccordion({ chapter, onComplete, hobbyName, defaultExpanded, onUpvoteChallenge }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const tasks = chapter.tasks || [];
  const completed = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  const isChapterComplete = completed === tasks.length && tasks.length > 0;

  return (
    <div className="card" style={{ marginBottom: '1.5rem', overflow: 'hidden' }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--white)', borderBottom: expanded ? '1px solid var(--border)' : 'none' }}
      >
        <div style={{ flex: 1, paddingRight: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            {isChapterComplete && <span style={{ fontSize: '1rem' }}>✅</span>}
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>Chapter {chapter.chapterNumber}: {chapter.chapterTitle}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>{chapter.estimatedDuration} • {tasks.length} tasks</span>
          </div>
          <BloomProgress percent={progress} />
        </div>
        <div style={{ padding: '0 10px', fontSize: '1.2rem', color: 'var(--ink-muted)' }}>
          {expanded ? '▲' : '▼'}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            style={{ overflow: 'hidden', background: 'var(--cream)' }}
          >
            <div style={{ padding: '1.5rem' }}>
              {tasks.map((task, i) => (
                <TaskItem key={task.id || task.taskNumber} task={task} index={i} onComplete={onComplete} hobbyName={hobbyName} onUpvoteChallenge={onUpvoteChallenge} />
              ))}

              {/* Chapter reward card */}
              {chapter.reward && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: isChapterComplete
                      ? 'linear-gradient(135deg, var(--gold-pale), #FFF8E1)'
                      : 'var(--cream-dark)',
                    border: isChapterComplete ? '2px solid var(--gold)' : '2px dashed var(--border)',
                    borderRadius: '14px', padding: '1.25rem',
                    textAlign: 'center', marginTop: '0.5rem',
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
                    {isChapterComplete ? chapter.reward.emoji || '🏆' : '🔒'}
                  </div>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: isChapterComplete ? 'var(--gold)' : 'var(--ink-muted)', marginBottom: '4px', fontWeight: 700 }}>
                    {isChapterComplete ? `🎉 ${chapter.reward.title}` : `Chapter Reward: ${chapter.reward.title}`}
                  </p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                    {isChapterComplete ? chapter.reward.description : 'Complete all tasks to unlock this reward'}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PathPage() {
  const location = useLocation();
  const { showToast } = useToast();
  const [hobbies, setHobbies] = useState([]);
  const [selectedHobbyId, setSelectedHobbyId] = useState(location.state?.hobbyId || null);
  const [pathData, setPathData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskLoading, setTaskLoading] = useState(false);
  const [paceMessage, setPaceMessage] = useState('');
  const [bloomData, setBloomData] = useState({ probability: 0, message: '' });

  const CLIENT_MOCK_HOBBIES = [
    { id: 1, name: 'Guitar',              emoji: '🎸', bloom_stage: 'sprout', progress: 23, days_active: 18, difficulty: 'beginner',     estimated_time_per_day: '30 mins/day' },
    { id: 2, name: 'Watercolor Painting', emoji: '🎨', bloom_stage: 'bud',    progress: 61, days_active: 34, difficulty: 'intermediate', estimated_time_per_day: '45 mins/day' },
    { id: 3, name: 'Photography',         emoji: '📷', bloom_stage: 'seed',   progress: 8,  days_active: 6,  difficulty: 'beginner',     estimated_time_per_day: '20 mins/day' },
  ];

  useEffect(() => {
    api.get('/hobbies').then(res => {
      const data = res.data?.length > 0 ? res.data : CLIENT_MOCK_HOBBIES;
      setHobbies(data);
      if (!selectedHobbyId && data.length > 0) {
        setSelectedHobbyId(data[0].id);
      }
      setLoading(false);
    }).catch(() => {
      // Backend unreachable — use client-side mock hobbies
      setHobbies(CLIENT_MOCK_HOBBIES);
      if (!selectedHobbyId) setSelectedHobbyId(CLIENT_MOCK_HOBBIES[0].id);
      setLoading(false);
    });
  }, []);

  const selectedHobby = hobbies.find(h => h.id === selectedHobbyId);

  useEffect(() => {
    if (!selectedHobby) return;
    setTaskLoading(true);

    const storageKey = `path_${selectedHobby.name}`;
    const localPath = localStorage.getItem(storageKey);
    if (localPath) {
      try {
        const parsed = JSON.parse(localPath);
        setPathData(parsed);
        setTaskLoading(false);
        return;
      } catch(e) { console.error('Parse err', e); }
    }

    if (selectedHobby.name === 'Guitar') {
      const guitarPath = JSON.parse(JSON.stringify(MOCK_GUITAR_PATH));
      localStorage.setItem(storageKey, JSON.stringify(guitarPath));
      setPathData(guitarPath);
      setTaskLoading(false);
      return;
    }

    // No cached path — generate chapter 1
    generateNextChapter(selectedHobby.name, 1, []);
  }, [selectedHobbyId, selectedHobby]);

  // Generate a single chapter and append it to pathData
  const generateNextChapter = async (hobbyName, chapterNumber, existingChapters) => {
    setTaskLoading(true);
    const lang = localStorage.getItem('hl_language') || 'en';
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
    try {
      const res = await api.post('/ai/generate-chapter', {
        hobbyName,
        chapterNumber,
        completedChapters: existingChapters.map(c => ({
          chapterNumber: c.chapterNumber,
          chapterTitle: c.chapterTitle,
          tasks: (c.tasks || []).map(t => ({ taskTitle: t.taskTitle })),
        })),
        language: lang,
        culturalContext,
      });
      const newChapter = res.data;
      if (!newChapter || !newChapter.tasks) return;

      newChapter.tasks = newChapter.tasks.map((t, j) => ({
        ...t,
        id: Date.now() + chapterNumber * 100 + j,
        taskNumber: j + 1,
        status: chapterNumber === 1 && j === 0 ? 'current' : 'upcoming',
      }));

      setPathData(prev => {
        const updated = prev
          ? { ...prev, chapters: [...prev.chapters, newChapter] }
          : { hobbyName, chapters: [newChapter] };
        localStorage.setItem(`path_${hobbyName}`, JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('Chapter generation failed:', err);
    } finally {
      setTaskLoading(false);
    }
  };

  const handleComplete = async (taskId, taskTitle) => {
    let allDoneInLastChapter = false;
    let nextChapterNum = 1;
    let currentChapters = [];

    setPathData(prev => {
      if (!prev) return prev;
      const next = { ...prev, chapters: prev.chapters.map(ch => ({ ...ch, tasks: [...ch.tasks] })) };
      let nextTaskToCurrent = false;

      for (let c = 0; c < next.chapters.length; c++) {
        for (let t = 0; t < next.chapters[c].tasks.length; t++) {
          if (nextTaskToCurrent && next.chapters[c].tasks[t].status === 'upcoming') {
            next.chapters[c].tasks[t] = { ...next.chapters[c].tasks[t], status: 'current' };
            nextTaskToCurrent = false;
          }
          if (next.chapters[c].tasks[t].id === taskId || next.chapters[c].tasks[t].taskTitle === taskTitle) {
            next.chapters[c].tasks[t] = { ...next.chapters[c].tasks[t], status: 'completed' };
            nextTaskToCurrent = true;
          }
        }
      }

      // Check if ALL tasks in the LAST chapter are now completed
      const lastChapter = next.chapters[next.chapters.length - 1];
      const lastChapterAllDone = lastChapter.tasks.every(t => t.status === 'completed');
      if (lastChapterAllDone) {
        allDoneInLastChapter = true;
        nextChapterNum = next.chapters.length + 1;
        currentChapters = next.chapters;
      }

      // Save to localStorage
      localStorage.setItem(`path_${next.hobbyName}`, JSON.stringify(next));
      return next;
    });

    if (taskId) {
      try { await api.patch(`/tasks/${taskId}/complete`); } catch {}
    }

    showToast('Task complete! +10 points 🌟', 'points');

    // Auto-generate next chapter when last chapter is fully done
    if (allDoneInLastChapter && selectedHobby) {
      showToast('🎉 Chapter complete! Generating your next chapter…', 'points');
      setTimeout(() => {
        generateNextChapter(selectedHobby.name, nextChapterNum, currentChapters);
      }, 1000);
    }
  };

  const handleUpvoteChallenge = (taskId, challengeIdx) => {
    setPathData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        chapters: prev.chapters.map((ch) => ({
          ...ch,
          tasks: ch.tasks.map((t) => {
            if (t.id === taskId && t.commonChallenges) {
              const challenges = [...t.commonChallenges];
              if (challenges[challengeIdx]) {
                challenges[challengeIdx] = {
                  ...challenges[challengeIdx],
                  upvotes: (challenges[challengeIdx].upvotes || 0) + 1,
                };
              }
              return { ...t, commonChallenges: challenges };
            }
            return t;
          }),
        })),
      };
    });
  };

  const allTasks = pathData?.chapters.flatMap(c => c.tasks) || [];
  const completed = allTasks.filter(t => t.status === 'completed').length;
  const total = allTasks.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const paceStats = useMemo(() => {
    const days = 14; 
    const daysSinceLast = 1;
    const paceTrend = 'steady';
    return { days, daysSinceLast, paceTrend, completed };
  }, [completed]);

  useEffect(() => {
    if (!selectedHobby || total === 0) return;
    const msg = paceStats.daysSinceLast > 3
      ? `It's been ${paceStats.daysSinceLast} days — a short ${selectedHobby.name} session today would feel great.`
      : `Steady progress on ${selectedHobby.name} — ${completed}/${total} tasks done.`;
    setPaceMessage(msg);

    setBloomData({
      probability: Math.min(95, Math.round(progress * 1.05 + 15)),
      message: `You're ${progress}% along your ${selectedHobby.name} path — keep going!`,
    });
  }, [selectedHobby, progress, total, paceStats]);

  const bloomProb = bloomData.probability || Math.min(98, Math.round(progress * 1.1 + 20));

  if (loading) return (
    <div style={{ padding: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
      {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '80px', marginBottom: '1rem' }} />)}
    </div>
  );

  return (
    <div style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.8rem', letterSpacing: '0.12em', color: 'var(--brown-light)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>
            Learning Path 🗺️
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--ink)' }}>
            My Path
          </h1>
        </div>

        {hobbies.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {hobbies.map(h => (
              <button
                key={h.id}
                id={`hobby-tab-${h.id}`}
                onClick={() => setSelectedHobbyId(h.id)}
                style={{
                  padding: '8px 20px', borderRadius: '99px', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.88rem',
                  border: selectedHobbyId === h.id ? '2px solid var(--brown-coffee)' : '2px solid var(--border)',
                  background: selectedHobbyId === h.id ? 'var(--brown-coffee)' : 'var(--white)',
                  color: selectedHobbyId === h.id ? 'var(--white)' : 'var(--ink-soft)',
                  transition: 'var(--transition)',
                }}
              >
                {h.name}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
          <div>
            {taskLoading ? (
              [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '120px', marginBottom: '1.5rem' }} />)
            ) : !pathData || total === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
                <p style={{ marginBottom: '0.5rem', fontWeight: 600, color: 'var(--ink)' }}>Generating your learning path…</p>
                <p style={{ fontSize: '0.85rem' }}>AI is building a personalised path for this hobby. This takes about 10 seconds.</p>
              </div>
            ) : (
              <div>
                {pathData.chapters.map((chap, i) => (
                  <ChapterAccordion 
                    key={i} 
                    chapter={chap} 
                    onComplete={handleComplete} 
                    hobbyName={pathData.hobbyName}
                    defaultExpanded={chap.tasks.some(t => t.status === 'current') || i === 0}
                    onUpvoteChallenge={(taskId, idx) => handleUpvoteChallenge(taskId, idx)}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--brown-light)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase' }}>
                Bloom Probability
              </p>
              <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1rem' }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--cream-dark)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="var(--gold)" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - bloomProb / 100) }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)' }}>{bloomProb}%</span>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                {bloomData.message || 'chance of reaching Bloom at your current pace'}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', marginTop: '6px' }}>
                Pace: {paceStats.paceTrend}
              </p>
            </div>

            <div className="card" style={{ padding: '1.5rem', background: 'var(--blue-pale)', border: '1.5px solid var(--blue-soft)30' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.3rem' }}>🧠</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)', fontFamily: 'var(--font-body)', marginBottom: '6px' }}>
                    Pace AI
                  </p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                    {paceMessage}
                  </p>
                </div>
              </div>
            </div>

            {selectedHobby && (
              <div className="card" style={{ padding: '1.25rem' }}>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)', fontFamily: 'var(--font-body)', marginBottom: '0.75rem' }}>
                  {selectedHobby.name} Overall Progress
                </p>
                {/* Full bloom progress — bouquet/tree/grandmaster system */}
                <BloomProgress
                  percent={progress}
                  completedTasks={completed}
                  totalChapters={pathData?.chapters?.length || 0}
                  showFull={true}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>
                    {completed} tasks · {pathData?.chapters?.length || 0} chapters
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>
                    cap: 750
                  </span>
                </div>
                {/* Pre-generate next chapter button */}
                {!taskLoading && pathData?.chapters && (
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ width: '100%', marginTop: '10px', justifyContent: 'center', fontSize: '0.78rem' }}
                    onClick={() => generateNextChapter(
                      selectedHobby.name,
                      (pathData.chapters.length || 0) + 1,
                      pathData.chapters
                    )}
                  >
                    + Generate next chapter
                  </button>
                )}
                {taskLoading && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--brown-light)', fontFamily: 'var(--font-body)', marginTop: '8px', textAlign: 'center' }}>
                    ✨ Generating chapter {(pathData?.chapters?.length || 0) + 1}…
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
