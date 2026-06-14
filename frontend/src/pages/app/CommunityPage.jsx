import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageMotion from '../../components/PageMotion';
import { useToast } from '../../context/ToastContext';
import { HOBBY_TAGS } from '../../lib/constants';
import { COMMUNITY_POSTS } from '../../lib/demoData';

const FILTERS = ['All', 'Following', ...HOBBY_TAGS];

// Mock comments per post
const MOCK_COMMENTS = {
  1: [
    { id: 1, name: 'Marcus T.', initials: 'MT', color: '#A8C4D4', text: 'The color mixing really shows! Keep going 🌱', time: '1h ago' },
    { id: 2, name: 'Leo K.', initials: 'LK', color: '#6B4226', text: 'Attempt 7 is where it starts clicking for most people. You\'re right on track!', time: '45m ago' },
  ],
  2: [
    { id: 1, name: 'Priya S.', initials: 'PS', color: '#C9920A', text: 'Sharing the ugly parts is the bravest thing. Respect 🙌', time: '4h ago' },
    { id: 2, name: 'Aisha R.', initials: 'AR', color: '#A67C5B', text: 'Your rhythm will catch up. The chord changes are already cleaner than mine were at this stage!', time: '3h ago' },
  ],
  3: [
    { id: 1, name: 'Marcus T.', initials: 'MT', color: '#A8C4D4', text: 'That one good photo feeling is everything 📷', time: '20h ago' },
  ],
  4: [
    { id: 1, name: 'Priya S.', initials: 'PS', color: '#C9920A', text: 'This made me tear up. Your mum is so lucky 🥹', time: '1d ago' },
    { id: 2, name: 'Aisha R.', initials: 'AR', color: '#A67C5B', text: 'The journey from wobbly pancake to this is everything pottery is about!', time: '22h ago' },
    { id: 3, name: 'Marcus T.', initials: 'MT', color: '#A8C4D4', text: 'Goals. Absolute goals.', time: '20h ago' },
  ],
};

// Mock DM conversations
const MOCK_DMS = {
  'Priya S.': [
    { id: 1, from: 'them', text: 'Hey! Loved your question in the doubt garden 🌱', time: '2d ago' },
    { id: 2, from: 'me', text: 'Thanks! Your watercolor tips really helped me.', time: '2d ago' },
    { id: 3, from: 'them', text: 'We should do a watercolor challenge together sometime!', time: '1d ago' },
  ],
  'Marcus T.': [
    { id: 1, from: 'them', text: 'Did you see my guitar video? 😅', time: '5h ago' },
    { id: 2, from: 'me', text: 'Yes! Your chord changes are getting so much better!', time: '4h ago' },
  ],
  'Aisha R.': [],
  'Leo K.': [
    { id: 1, from: 'them', text: 'Thanks for the upvote on my answer!', time: '3d ago' },
  ],
};

function ReactionButton({ emoji, count, onReact, popped }) {
  return (
    <motion.button
      type="button"
      className="reaction-btn"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      animate={popped ? { scale: [1, 1.35, 1] } : {}}
      transition={{ duration: 0.35 }}
      onClick={onReact}
      style={{ flexDirection: 'row', minWidth: 'auto', gap: '6px', padding: '5px 12px' }}
    >
      <span>{emoji}</span>
      <span style={{ fontWeight: 600 }}>{count}</span>
    </motion.button>
  );
}

function Avatar({ initials, color, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: Math.round(size * 0.36) + 'px', flexShrink: 0,
    }}>{initials}</div>
  );
}

// ─── Comments Drawer ────────────────────────────────────────────────────────
function CommentsDrawer({ post, onClose }) {
  const [comments, setComments] = useState(MOCK_COMMENTS[post.id] || []);
  const [text, setText] = useState('');
  const { showToast } = useToast();

  const submit = () => {
    if (!text.trim()) return;
    setComments((prev) => [...prev, {
      id: Date.now(),
      name: 'Demo User',
      initials: 'DU',
      color: '#8A7E70',
      text: text.trim(),
      time: 'just now',
    }]);
    setText('');
    showToast('Comment posted 🌱');
  };

  return (
    <>
      <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div className="bottom-drawer" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>Comments 💬</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--ink-muted)' }}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem', maxHeight: '40vh', overflowY: 'auto' }}>
          {comments.length === 0 ? (
            <p style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
              Be the first to leave an honest comment 🌱
            </p>
          ) : (
            comments.map((c) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '10px' }}>
                <Avatar initials={c.initials} color={c.color} size={34} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>{c.name}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>{c.time}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>{c.text}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            className="form-input"
            placeholder="Write a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            style={{ flex: 1 }}
          />
          <button type="button" className="btn btn-primary btn-sm" onClick={submit} disabled={!text.trim()}>Post</button>
        </div>
      </motion.div>
    </>
  );
}

// ─── DM Chat Panel ──────────────────────────────────────────────────────────
function DMPanel({ user: chatUser, onClose }) {
  const [messages, setMessages] = useState(MOCK_DMS[chatUser.user] || []);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: 'me', text: text.trim(), time: 'just now' }]);
    setText('');
    // Simulate reply after 1.5s
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        from: 'them',
        text: '🌱 Thanks for the message! (This is a demo reply)',
        time: 'just now',
      }]);
    }, 1500);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(26,18,7,0.45)', zIndex: 200 }}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(380px, 100vw)',
          background: 'var(--white)', zIndex: 201,
          display: 'flex', flexDirection: 'column',
          boxShadow: '-8px 0 40px rgba(26,18,7,0.15)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'var(--white)',
        }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--ink-muted)', padding: '4px' }}>←</button>
          <Avatar initials={chatUser.initials} color={chatUser.color} size={38} />
          <div>
            <div style={{ fontWeight: 600, fontFamily: 'var(--font-body)', color: 'var(--ink)', fontSize: '0.95rem' }}>{chatUser.user}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>{chatUser.hobby} · {chatUser.stage}</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', fontSize: '0.88rem', marginTop: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌱</div>
              Start a conversation with {chatUser.user}!
            </div>
          )}
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                maxWidth: '75%',
                padding: '8px 12px',
                borderRadius: m.from === 'me' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: m.from === 'me' ? 'var(--brown-coffee)' : 'var(--cream-dark)',
                color: m.from === 'me' ? 'white' : 'var(--ink)',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.5,
              }}>
                {m.text}
                <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '3px', textAlign: 'right' }}>{m.time}</div>
              </div>
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', background: 'var(--white)' }}>
          <input
            className="form-input"
            placeholder={`Message ${chatUser.user}…`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            style={{ flex: 1 }}
          />
          <button type="button" className="btn btn-primary btn-sm" onClick={send} disabled={!text.trim()}>Send</button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [filter, setFilter] = useState('All');
  const [showDrawer, setShowDrawer] = useState(false);
  const [showComments, setShowComments] = useState(null);
  const [showDM, setShowDM] = useState(null);
  const [popped, setPopped] = useState({});
  const [newPost, setNewPost] = useState({ type: 'journal', caption: '', hobby: 'Guitar' });

  const filtered = posts.filter((p) => {
    if (filter === 'All' || filter === 'Following') return true;
    return p.hobby === filter;
  });

  const react = (postId, key) => {
    setPosts((prev) => prev.map((p) => p.id === postId
      ? { ...p, reactions: { ...p.reactions, [key]: (p.reactions[key] || 0) + 1 } }
      : p));
    setPopped({ [`${postId}-${key}`]: true });
    setTimeout(() => setPopped((p) => ({ ...p, [`${postId}-${key}`]: false })), 400);
    if (key === '🌱' || key === '💪') showToast('+Water sent! 🌱', 'points');
  };

  const submitPost = () => {
    if (!newPost.caption.trim()) return;
    const post = {
      id: Date.now(),
      user: 'Demo User',
      initials: 'DU',
      color: '#8A7E70',
      hobby: newPost.hobby,
      stage: '🌱 Sprout',
      time: 'just now',
      content: newPost.caption,
      video: newPost.type === 'video',
      videoLabel: '0:30',
      reactions: { '🌸': 0, '💪': 0, '🥹': 0 },
    };
    setPosts((prev) => [post, ...prev]);
    setShowDrawer(false);
    setNewPost({ type: 'journal', caption: '', hobby: 'Guitar' });
    showToast('Posted to The Garden 🌸');
  };

  const commentCount = (post) => {
    const mock = MOCK_COMMENTS[post.id];
    return mock ? mock.length : 0;
  };

  return (
    <PageMotion style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.8rem', letterSpacing: '0.12em', color: 'var(--brown-light)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>
          Honest learners 📹
        </p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--ink)', marginBottom: '0.5rem' }}>
          Community Feed
        </h1>
        <p style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>
          No highlight reels. Just real progress.
        </p>
      </div>
      <div className="filter-tabs" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {FILTERS.map((f) => (
          <button key={f} type="button" className={`filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filtered.map((post, i) => (
          <motion.article key={post.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card feed-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem' }}>
              <Avatar initials={post.initials} color={post.color} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>{post.user}</span>
                  <span className="hobby-pill">{post.hobby}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>{post.stage}</span>
                  {/* Add to Group button */}
                  <button
                    type="button"
                    onClick={() => showToast(`Invite sent to ${post.user}! 🌱`)}
                    style={{
                      fontSize: '0.7rem', padding: '2px 8px', borderRadius: '99px',
                      border: '1px solid var(--border)', background: 'var(--cream)',
                      color: 'var(--ink-soft)', cursor: 'pointer', fontFamily: 'var(--font-body)',
                      fontWeight: 600, transition: 'var(--transition)',
                    }}
                    title={`Add ${post.user} to a group`}
                  >
                    + Group
                  </button>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>{post.time}</div>
              </div>
              {/* DM chat icon */}
              <button
                type="button"
                onClick={() => setShowDM(post)}
                title={`Message ${post.user}`}
                style={{
                  background: 'none', border: '1px solid var(--border)', borderRadius: '8px',
                  padding: '6px 8px', cursor: 'pointer', fontSize: '1rem',
                  color: 'var(--ink-muted)', transition: 'var(--transition)',
                  flexShrink: 0, alignSelf: 'flex-start',
                }}
              >
                💬
              </button>
            </div>
            {post.video ? (
              <div className="video-placeholder">
                <span style={{ fontSize: '2rem' }}>▶</span>
                <p>Raw video — {post.videoLabel || '0:47'}</p>
              </div>
            ) : (
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontFamily: 'var(--font-body)', marginBottom: '1rem' }}>{post.content}</p>
            )}
            {post.video && <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontFamily: 'var(--font-body)', marginBottom: '1rem', fontSize: '0.9rem' }}>{post.content}</p>}
            <div className="reaction-row">
              {Object.entries(post.reactions).map(([emoji, count]) => (
                <ReactionButton
                  key={emoji}
                  emoji={emoji}
                  count={count}
                  onReact={() => react(post.id, emoji)}
                  popped={popped[`${post.id}-${emoji}`]}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowComments(post)}
              style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}
            >
              💬 {commentCount(post)} comments
            </button>
          </motion.article>
        ))}
      </div>

      {/* FAB */}
      <button type="button" className="fab-post" onClick={() => setShowDrawer(true)} aria-label="New post">+</button>

      {/* New Post Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <>
            <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDrawer(false)} />
            <motion.div className="bottom-drawer" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Post to Garden 🌸</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                {['journal', 'video'].map((t) => (
                  <button key={t} type="button" className={`filter-tab${newPost.type === t ? ' active' : ''}`} style={{ flex: 1 }} onClick={() => setNewPost((p) => ({ ...p, type: t }))}>
                    {t === 'journal' ? 'Journal Post' : 'Video Upload'}
                  </button>
                ))}
              </div>
              {newPost.type === 'video' && (
                <input type="file" accept="video/*" className="form-input" style={{ marginBottom: '1rem' }} />
              )}
              <textarea className="form-input" rows={4} placeholder="Caption…" value={newPost.caption} onChange={(e) => setNewPost((p) => ({ ...p, caption: e.target.value }))} style={{ marginBottom: '0.75rem', resize: 'none' }} />
              <select className="form-input" value={newPost.hobby} onChange={(e) => setNewPost((p) => ({ ...p, hobby: e.target.value }))} style={{ marginBottom: '1rem' }}>
                {HOBBY_TAGS.map((h) => <option key={h}>{h}</option>)}
              </select>
              <button type="button" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }} onClick={submitPost}>Post to Garden 🌸</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Comments Drawer */}
      <AnimatePresence>
        {showComments && (
          <CommentsDrawer post={showComments} onClose={() => setShowComments(null)} />
        )}
      </AnimatePresence>

      {/* DM Panel */}
      <AnimatePresence>
        {showDM && (
          <DMPanel user={showDM} onClose={() => setShowDM(null)} />
        )}
      </AnimatePresence>
    </PageMotion>
  );
}
