import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageMotion from '../../components/PageMotion';
import { useToast } from '../../context/ToastContext';
import { HOBBY_TAGS, formatJournalDate } from '../../lib/constants';
import {
  BLOG_POSTS,
  COVER_GRADIENTS,
  BLOG_THEMES,
  FONT_PAIRS,
  LAYOUT_STYLES,
} from '../../lib/demoData';

/* ─── helpers ────────────────────────────────────────── */
function estimateReadTime(html) {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function getCoverCSS(id) {
  const g = COVER_GRADIENTS.find((c) => c.id === id);
  return g ? g.css : COVER_GRADIENTS[0].css;
}

function getTheme(id) {
  return BLOG_THEMES.find((t) => t.id === id) || BLOG_THEMES[0];
}

function getFontPair(id) {
  return FONT_PAIRS.find((f) => f.id === id) || FONT_PAIRS[0];
}

const emptyPost = () => ({
  title: '',
  subtitle: '',
  hobby: 'Guitar',
  mood: '😊',
  tags: [],
  content: '',
  coverGradient: 'amber',
  theme: 'warm',
  fontPair: 'editorial',
  layout: 'classic',
  published: false,
});

const MOODS = ['😊', '😤', '🌸', '😴', '🔥', '🥹'];

/* ─── Toolbar config ─────────────────────────────────── */
const TOOLBAR_ITEMS = [
  { cmd: 'bold', icon: 'B', title: 'Bold', style: { fontWeight: 700 } },
  { cmd: 'italic', icon: 'I', title: 'Italic', style: { fontStyle: 'italic' } },
  { cmd: 'underline', icon: 'U', title: 'Underline', style: { textDecoration: 'underline' } },
  { cmd: 'strikeThrough', icon: 'S', title: 'Strikethrough', style: { textDecoration: 'line-through' } },
  { type: 'divider' },
  { cmd: 'formatBlock', arg: 'H1', icon: 'H1', title: 'Heading 1' },
  { cmd: 'formatBlock', arg: 'H2', icon: 'H2', title: 'Heading 2' },
  { cmd: 'formatBlock', arg: 'H3', icon: 'H3', title: 'Heading 3' },
  { type: 'divider' },
  { cmd: 'insertUnorderedList', icon: '•', title: 'Bullet list', style: { fontSize: '1.1rem' } },
  { cmd: 'insertOrderedList', icon: '1.', title: 'Numbered list' },
  { cmd: 'formatBlock', arg: 'BLOCKQUOTE', icon: '❝', title: 'Quote' },
  { type: 'divider' },
  { cmd: 'insertHorizontalRule', icon: '—', title: 'Divider' },
  { cmd: 'createLink', icon: '🔗', title: 'Insert link' },
  { cmd: 'formatBlock', arg: 'PRE', icon: '</>', title: 'Code block' },
];

/* ─── Tag input component ────────────────────────────── */
function TagInput({ tags, setTags }) {
  const [val, setVal] = useState('');
  const handleKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && val.trim()) {
      e.preventDefault();
      const tag = val.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (tag && !tags.includes(tag)) setTags([...tags, tag]);
      setVal('');
    } else if (e.key === 'Backspace' && !val && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };
  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
      {tags.map((t) => (
        <span key={t} className="blog-tag" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }} onClick={() => setTags(tags.filter((x) => x !== t))}>
          #{t} <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>×</span>
        </span>
      ))}
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={handleKey}
        placeholder={tags.length ? '' : 'Add tags…'}
        style={{
          border: 'none', outline: 'none', background: 'transparent',
          fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--ink-soft)',
          minWidth: '60px', flex: 1, padding: '2px 0',
        }}
      />
    </div>
  );
}

/* ─── Blog Post Card ─────────────────────────────────── */
function PostCard({ post, active, onClick }) {
  return (
    <motion.button
      type="button"
      className={`blog-post-card${active ? ' active' : ''}`}
      onClick={onClick}
      whileHover={{ y: -2 }}
      layout
    >
      <div className="card-cover" style={{ background: getCoverCSS(post.coverGradient) }}>
        {!post.published && <span className="draft-badge">Draft</span>}
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span>{post.mood}</span>
          <span>·</span>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readingTime || estimateReadTime(post.content)}</span>
        </div>
        <div className="card-title">{post.title || 'Untitled'}</div>
        {post.subtitle && <div className="card-subtitle">{post.subtitle}</div>}
        {post.tags?.length > 0 && (
          <div className="card-tags">
            {post.tags.slice(0, 3).map((t) => (
              <span key={t} className="blog-tag">#{t}</span>
            ))}
            {post.tags.length > 3 && <span className="blog-tag">+{post.tags.length - 3}</span>}
          </div>
        )}
      </div>
    </motion.button>
  );
}

/* ─── Rich Text Toolbar ──────────────────────────────── */
function Toolbar({ editorRef }) {
  const exec = (cmd, arg) => {
    editorRef.current?.focus();
    if (cmd === 'createLink') {
      const url = prompt('Enter URL:');
      if (url) document.execCommand(cmd, false, url);
    } else if (cmd === 'formatBlock') {
      document.execCommand(cmd, false, `<${arg}>`);
    } else {
      document.execCommand(cmd, false, arg || null);
    }
  };

  return (
    <div className="blog-toolbar">
      {TOOLBAR_ITEMS.map((item, i) =>
        item.type === 'divider' ? (
          <div key={`d-${i}`} className="blog-toolbar-divider" />
        ) : (
          <button
            key={item.cmd + (item.arg || '')}
            type="button"
            className="blog-toolbar-btn"
            title={item.title}
            onMouseDown={(e) => {
              e.preventDefault();
              exec(item.cmd, item.arg);
            }}
            style={item.style}
          >
            {item.icon}
          </button>
        )
      )}
    </div>
  );
}

/* ─── Design Panel ───────────────────────────────────── */
function DesignPanel({ draft, setDraft, onClose }) {
  return (
    <motion.div
      className="blog-design-panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--ink)' }}>Post Design ✨</h3>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--ink-muted)' }}>✕</button>
      </div>

      {/* Cover gradient */}
      <div>
        <div className="design-section-title">Cover</div>
        <div className="design-grid">
          {COVER_GRADIENTS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`design-swatch${draft.coverGradient === g.id ? ' active' : ''}`}
              style={{ background: g.css }}
              onClick={() => setDraft((d) => ({ ...d, coverGradient: g.id }))}
            >
              <span className="swatch-label">{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div>
        <div className="design-section-title">Color Theme</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {BLOG_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`design-theme-btn${draft.theme === t.id ? ' active' : ''}`}
              onClick={() => setDraft((d) => ({ ...d, theme: t.id }))}
            >
              <div className="theme-preview">
                <div className="theme-dot" style={{ background: t.accent }} />
                <div className="theme-dot" style={{ background: t.bg }} />
                <div className="theme-dot" style={{ background: t.text }} />
              </div>
              <div className="theme-label">{t.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Font pairing */}
      <div>
        <div className="design-section-title">Typography</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {FONT_PAIRS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`design-font-btn${draft.fontPair === f.id ? ' active' : ''}`}
              onClick={() => setDraft((d) => ({ ...d, fontPair: f.id }))}
            >
              <div className="font-preview-heading" style={{ fontFamily: f.heading }}>{f.label}</div>
              <div className="font-preview-body" style={{ fontFamily: f.body }}>The quick brown fox jumps…</div>
            </button>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div>
        <div className="design-section-title">Layout</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {LAYOUT_STYLES.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`design-layout-btn${draft.layout === l.id ? ' active' : ''}`}
              onClick={() => setDraft((d) => ({ ...d, layout: l.id }))}
            >
              <div className="design-layout-icon">
                {l.id === 'classic' && '☰'}
                {l.id === 'magazine' && '▣'}
                {l.id === 'minimal' && '—'}
                {l.id === 'card' && '▢'}
              </div>
              <div>
                <div className="layout-label">{l.label}</div>
                <div className="layout-desc">{l.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Preview Component ──────────────────────────────── */
function BlogPreview({ draft }) {
  const theme = getTheme(draft.theme);
  const fonts = getFontPair(draft.fontPair);
  const coverCSS = getCoverCSS(draft.coverGradient);

  const previewStyle = {
    background: theme.bg,
    color: theme.text,
    fontFamily: fonts.body,
    borderRadius: draft.layout === 'card' ? '16px' : '16px',
    overflow: 'hidden',
    boxShadow: draft.layout === 'card' ? '0 8px 40px rgba(0,0,0,0.12)' : 'none',
    maxWidth: draft.layout === 'minimal' ? '600px' : '100%',
    margin: draft.layout === 'minimal' ? '0 auto' : '0',
  };

  return (
    <div className="blog-preview" style={{ padding: draft.layout === 'card' ? '2rem' : '0' }}>
      <div style={previewStyle}>
        {/* Cover */}
        {(draft.layout === 'magazine' || draft.layout === 'classic') && (
          <div
            className="blog-preview-cover"
            style={{
              background: coverCSS,
              height: draft.layout === 'magazine' ? '240px' : '160px',
            }}
          >
            <div className="cover-content">
              <h1 style={{ fontFamily: fonts.heading, fontSize: draft.layout === 'magazine' ? '1.8rem' : '1.4rem' }}>
                {draft.title || 'Untitled Post'}
              </h1>
              {draft.subtitle && <p>{draft.subtitle}</p>}
            </div>
          </div>
        )}

        {/* For minimal/card layout — title inside body */}
        {(draft.layout === 'minimal' || draft.layout === 'card') && (
          <div style={{ padding: '2rem 1.5rem 0' }}>
            {/* Small cover bar */}
            <div style={{
              height: '6px', borderRadius: '3px', background: coverCSS,
              marginBottom: '1.5rem', width: '80px',
            }} />
            <h1 style={{
              fontFamily: fonts.heading, fontSize: '1.6rem', fontWeight: 700,
              color: theme.text, lineHeight: 1.2, marginBottom: '6px',
            }}>
              {draft.title || 'Untitled Post'}
            </h1>
            {draft.subtitle && (
              <p style={{
                fontFamily: fonts.body, fontSize: '0.95rem',
                color: theme.mutedText, marginBottom: '0',
              }}>
                {draft.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Meta */}
        <div className="blog-preview-meta" style={{ color: theme.mutedText, marginTop: draft.layout === 'minimal' || draft.layout === 'card' ? '1rem' : '0' }}>
          <span>{draft.mood}</span>
          <span>·</span>
          <span>{draft.hobby}</span>
          <span>·</span>
          <span>{estimateReadTime(draft.content)}</span>
          <span>·</span>
          <span>{formatJournalDate()}</span>
        </div>

        {/* Body */}
        <div
          className="blog-preview-body"
          style={{ fontFamily: fonts.body, color: theme.text }}
          dangerouslySetInnerHTML={{ __html: draft.content || '<p style="opacity:0.4;font-style:italic">Your story will appear here…</p>' }}
        />

        {/* Tags */}
        {draft.tags?.length > 0 && (
          <div className="blog-preview-tags">
            {draft.tags.map((t) => (
              <span key={t} className="blog-tag" style={{ background: `${theme.accent}20`, color: theme.accent }}>
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN — JournalPage (Blog Studio)
   ═══════════════════════════════════════════════════════ */
export default function JournalPage() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState(BLOG_POSTS);
  const [selectedId, setSelectedId] = useState(BLOG_POSTS[0]?.id);
  const [draft, setDraft] = useState(emptyPost());
  const [isNew, setIsNew] = useState(false);
  const [showDesign, setShowDesign] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [search, setSearch] = useState('');
  const [mobileView, setMobileView] = useState('feed'); // 'feed' | 'editor'
  const editorRef = useRef(null);

  const selected = posts.find((p) => p.id === selectedId);

  /* Load selected post into draft */
  useEffect(() => {
    if (selected && !isNew) {
      setDraft({
        title: selected.title,
        subtitle: selected.subtitle || '',
        hobby: selected.hobby,
        mood: selected.mood,
        tags: [...(selected.tags || [])],
        content: selected.content,
        coverGradient: selected.coverGradient || 'amber',
        theme: selected.theme || 'warm',
        fontPair: selected.fontPair || 'editorial',
        layout: selected.layout || 'classic',
        published: selected.published || false,
      });
    }
  }, [selectedId, selected, isNew]);

  /* Sync draft content into contentEditable */
  useEffect(() => {
    if (editorRef.current && !previewMode) {
      editorRef.current.innerHTML = draft.content;
    }
  }, [selectedId, isNew, previewMode]);

  /* Filter posts */
  const filteredPosts = posts.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.subtitle?.toLowerCase().includes(q) ||
      p.hobby.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.includes(q))
    );
  });

  const startNew = () => {
    setIsNew(true);
    setSelectedId(null);
    const newDraft = emptyPost();
    setDraft(newDraft);
    setPreviewMode(false);
    setMobileView('editor');
    // Clear editor
    setTimeout(() => {
      if (editorRef.current) editorRef.current.innerHTML = '';
    }, 0);
  };

  const selectPost = (id) => {
    setIsNew(false);
    setSelectedId(id);
    setPreviewMode(false);
    setMobileView('editor');
  };

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      setDraft((d) => ({ ...d, content: editorRef.current.innerHTML }));
    }
  }, []);

  const handleSave = () => {
    const content = editorRef.current?.innerHTML || draft.content;
    const post = {
      id: isNew ? Date.now() : selectedId,
      title: draft.title || 'Untitled Post',
      subtitle: draft.subtitle,
      hobby: draft.hobby,
      mood: draft.mood,
      tags: draft.tags,
      content,
      coverGradient: draft.coverGradient,
      theme: draft.theme,
      fontPair: draft.fontPair,
      layout: draft.layout,
      published: draft.published,
      date: formatJournalDate(),
      readingTime: estimateReadTime(content),
    };

    if (isNew) {
      setPosts((prev) => [post, ...prev]);
      setSelectedId(post.id);
    } else {
      setPosts((prev) => prev.map((p) => (p.id === selectedId ? { ...p, ...post } : p)));
    }

    setIsNew(false);
    showToast(draft.published ? 'Post published! 🚀' : 'Draft saved ✨');
  };

  const handleDelete = () => {
    if (!selectedId && !isNew) return;
    setPosts((prev) => prev.filter((p) => p.id !== selectedId));
    setSelectedId(posts[0]?.id !== selectedId ? posts[0]?.id : posts[1]?.id || null);
    setIsNew(false);
    setMobileView('feed');
    showToast('Post deleted 🗑️');
  };

  return (
    <PageMotion style={{ padding: 'clamp(1rem, 2vw, 2rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--ink)', margin: 0 }}>
          Blog Studio ✍️
        </h1>
        {mobileView === 'editor' && (
          <button type="button" className="btn btn-ghost btn-sm hide-desktop" onClick={() => setMobileView('feed')}>
            ← Posts
          </button>
        )}
      </div>

      <div className={`blog-studio${showDesign ? ' design-open' : ''}`}>
        {/* ─── LEFT: Post Feed ─────────────────────────── */}
        <aside className={`blog-feed${mobileView === 'editor' ? ' hide-mobile' : ''}`}>
          <div className="blog-feed-header">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ width: '100%', justifyContent: 'center', marginBottom: '10px' }}
              onClick={startNew}
            >
              + New Post
            </button>
            <div className="blog-search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="blog-search-input"
                placeholder="Search posts…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="blog-feed-scroll">
            {filteredPosts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                active={selectedId === p.id && !isNew}
                onClick={() => selectPost(p.id)}
              />
            ))}
            {filteredPosts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
                No posts found
              </div>
            )}
          </div>
        </aside>

        {/* ─── CENTER: Editor / Preview ────────────────── */}
        <section className={`blog-editor-panel${mobileView === 'feed' ? ' hide-mobile' : ''}`}>
          {(selected || isNew) ? (
            <>
              {/* Editor header */}
              <div className="blog-editor-header">
                <div className="editor-actions">
                  <button
                    type="button"
                    className={`btn btn-sm ${!previewMode ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => {
                      if (previewMode && editorRef.current) {
                        // Going back to edit: sync content
                        setDraft((d) => ({ ...d }));
                      }
                      setPreviewMode(false);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${previewMode ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => {
                      // Capture content before previewing
                      if (editorRef.current) {
                        setDraft((d) => ({ ...d, content: editorRef.current.innerHTML }));
                      }
                      setPreviewMode(true);
                    }}
                  >
                    👁️ Preview
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${showDesign ? 'btn-gold' : 'btn-ghost'}`}
                    onClick={() => setShowDesign((v) => !v)}
                  >
                    🎨 Design
                  </button>
                  <div style={{ flex: 1 }} />
                  <button type="button" className="btn btn-sm btn-ghost" style={{ color: '#DC2626', borderColor: '#DC2626' }} onClick={handleDelete}>
                    🗑️
                  </button>
                  <button type="button" className="btn btn-sm btn-gold" onClick={handleSave}>
                    {draft.published ? '🚀 Publish' : '💾 Save Draft'}
                  </button>
                </div>

                {!previewMode && (
                  <>
                    <input
                      className="blog-title-input"
                      placeholder="Post title…"
                      value={draft.title}
                      onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                    />
                    <input
                      className="blog-subtitle-input"
                      placeholder="Add a subtitle…"
                      value={draft.subtitle}
                      onChange={(e) => setDraft((d) => ({ ...d, subtitle: e.target.value }))}
                    />

                    <div className="blog-editor-meta">
                      {/* Mood */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {MOODS.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setDraft((d) => ({ ...d, mood: m }))}
                            style={{
                              fontSize: '1.1rem', padding: '4px 6px', borderRadius: '8px',
                              border: 'none', cursor: 'pointer',
                              background: draft.mood === m ? 'var(--gold-pale)' : 'transparent',
                              boxShadow: draft.mood === m ? '0 0 0 2px var(--gold)' : 'none',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {m}
                          </button>
                        ))}
                      </div>

                      <div className="blog-toolbar-divider" />

                      {/* Hobby select */}
                      <select
                        className="form-input"
                        value={draft.hobby}
                        onChange={(e) => setDraft((d) => ({ ...d, hobby: e.target.value }))}
                        style={{ width: 'auto', padding: '6px 10px', fontSize: '0.82rem' }}
                      >
                        {HOBBY_TAGS.map((h) => <option key={h} value={h}>{h}</option>)}
                      </select>

                      <div className="blog-toolbar-divider" />

                      {/* Publish toggle */}
                      <label style={{
                        display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                        fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--ink-soft)',
                      }}>
                        <input
                          type="checkbox"
                          checked={draft.published}
                          onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))}
                        />
                        Public
                      </label>

                      <div style={{ flex: 1 }} />

                      {/* Tags */}
                      <div style={{ minWidth: '120px', flex: 1 }}>
                        <TagInput tags={draft.tags} setTags={(tags) => setDraft((d) => ({ ...d, tags }))} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Toolbar + Editor or Preview */}
              {!previewMode ? (
                <>
                  <Toolbar editorRef={editorRef} />
                  <div
                    ref={editorRef}
                    className="blog-content-editable"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleContentChange}
                    onBlur={handleContentChange}
                  />
                </>
              ) : (
                <BlogPreview draft={draft} />
              )}
            </>
          ) : (
            <div className="blog-empty-state">
              <div className="empty-icon">✍️</div>
              <p>Select a post or create a new one</p>
              <p style={{ fontSize: '0.78rem' }}>Your blog stories live here</p>
            </div>
          )}
        </section>

        {/* ─── RIGHT: Design Panel ─────────────────────── */}
        <AnimatePresence>
          {showDesign && (selected || isNew) && (
            <>
              {/* Mobile backdrop */}
              <div className="blog-design-backdrop hide-desktop" onClick={() => setShowDesign(false)} />
              <DesignPanel
                draft={draft}
                setDraft={setDraft}
                onClose={() => setShowDesign(false)}
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </PageMotion>
  );
}
