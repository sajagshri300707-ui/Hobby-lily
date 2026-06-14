import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PageMotion from '../../components/PageMotion';
import { useToast } from '../../context/ToastContext';
import api from '../../lib/api';
import { HOBBY_TAGS } from '../../lib/constants';
import { DOUBT_QUESTIONS } from '../../lib/demoData';

const MOCK_QUESTIONS = DOUBT_QUESTIONS;

const FILTERS = ['All', ...HOBBY_TAGS];

export default function DoubtGardenPage() {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const lang = localStorage.getItem('hl_language') || 'en';
  const [questions, setQuestions] = useState(MOCK_QUESTIONS);
  const [selectedId, setSelectedId] = useState(MOCK_QUESTIONS[0].id);
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [modalForm, setModalForm] = useState({ hobby: 'Guitar', title: '', description: '' });
  const [modalAiAnswer, setModalAiAnswer] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [answerText, setAnswerText] = useState('');

  const filtered = questions.filter((q) => filter === 'All' || q.hobby === filter);
  const selected = questions.find((q) => q.id === selectedId) || filtered[0];

  const handleAiFirst = async () => {
    if (!modalForm.title.trim()) return;
    setModalLoading(true);
    setModalAiAnswer('');
    try {
      const res = await api.post('/ai/answer-doubt', {
        question: modalForm.title.trim(),
        description: modalForm.description.trim(),
        hobbyName: modalForm.hobby,
        language: lang,
      });
      setModalAiAnswer(res.data.answer);
    } catch {
      setModalAiAnswer('That\'s a great question — every learner wonders about this. Keep experimenting and trust that confusion is part of the journey.');
    } finally {
      setModalLoading(false);
    }
  };

  const postToCommunity = () => {
    const q = {
      id: Date.now(),
      title: modalForm.title,
      hobby: modalForm.hobby,
      author: 'You',
      stage: '🌱 Sprout',
      ago: 'just now',
      upvotes: 0,
      answerCount: 0,
      aiAnswer: modalAiAnswer,
      answers: [],
    };
    setQuestions((prev) => [q, ...prev]);
    setSelectedId(q.id);
    setShowModal(false);
    setModalForm({ hobby: 'Guitar', title: '', description: '' });
    setModalAiAnswer('');
    showToast('+5 points for asking 🌱', 'points');
  };

  const postAnswer = () => {
    if (!answerText.trim() || !selected) return;
    const ans = {
      id: Date.now(),
      name: 'Demo User',
      initials: 'DU',
      color: '#8A7E70',
      stage: '🌱 Sprout',
      text: answerText,
      upvotes: 0,
      best: false,
      fullBloom: false,
    };
    setQuestions((prev) => prev.map((q) => q.id === selected.id
      ? { ...q, answers: [...q.answers, ans], answerCount: q.answerCount + 1 }
      : q));
    setAnswerText('');
    showToast('+15 points for helping 🌸', 'points');
  };

  const upvoteAnswer = (qId, aId) => {
    setQuestions((prev) => prev.map((q) => q.id !== qId ? q : {
      ...q,
      answers: q.answers.map((a) => a.id === aId ? { ...a, upvotes: a.upvotes + 1 } : a),
    }));
  };

  return (
    <PageMotion style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--ink)' }}>
          {t('doubts.title')}
        </h1>
        <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>{t('doubts.askDoubt')}</button>
      </div>
      <div className="filter-tabs" style={{ marginBottom: '1.5rem' }}>
        {FILTERS.map((f) => (
          <button key={f} type="button" className={`filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="doubt-layout">
        <div className="doubt-list">
          {filtered.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setSelectedId(q.id)}
              className={`journal-list-item${selected?.id === q.id ? ' active' : ''}`}
              style={{ width: '100%', textAlign: 'left' }}
            >
              <div style={{ fontWeight: 600, fontFamily: 'var(--font-body)', color: 'var(--ink)', marginBottom: '4px' }}>{q.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>
                {q.author} · {q.stage} · {q.ago}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '0.75rem' }}>
                <span style={{ padding: '2px 8px', background: 'var(--brown-pale)', borderRadius: 99, color: 'var(--brown-coffee)' }}>{q.hobby}</span>
                <span>❤️ {q.upvotes}</span>
                <span>{q.answerCount} answers</span>
              </div>
            </button>
          ))}
        </div>
        {selected && (
          <div className="doubt-detail card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>{selected.title}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', marginBottom: '1rem', fontFamily: 'var(--font-body)' }}>
              {selected.author} · {selected.stage} · {selected.ago} · ❤️ {selected.upvotes}
            </p>
            {selected.aiAnswer && (
              <div className="ai-answer-card" style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>{t('doubts.aiSays')}</p>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, fontFamily: 'var(--font-body)', color: 'var(--ink-soft)' }}>{selected.aiAnswer}</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', flexWrap: 'wrap' }}>
                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${selected.hobby} ${selected.title} tutorial`)}&hl=${lang}`} target="_blank" rel="noopener noreferrer" style={{ background: '#FEE2E2', color: '#991B1B', padding: '6px 14px', borderRadius: '99px', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}>📺 Watch on YouTube →</a>
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(`${selected.hobby} ${selected.title} beginner guide`)}&hl=${lang}`} target="_blank" rel="noopener noreferrer" style={{ background: '#EBF4F8', color: '#1565C0', padding: '6px 14px', borderRadius: '99px', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}>📖 {t('path.readArticles')}</a>
                </div>
              </div>
            )}
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: '1rem' }}>{t('doubts.communityAnswers')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {[...selected.answers].sort((a, b) => (b.best ? 1 : 0) - (a.best ? 1 : 0)).map((a) => (
                <div
                  key={a.id}
                  className="card"
                  style={{
                    padding: '1rem',
                    border: a.best ? '2px solid var(--gold)' : '1px solid var(--border)',
                    background: a.best ? 'var(--gold-pale)' : 'var(--white)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', background: a.color,
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.75rem',
                    }}>{a.initials}</div>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', fontFamily: 'var(--font-body)' }}>{a.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginLeft: '8px' }}>{a.stage}</span>
                      {a.fullBloom && <span style={{ marginLeft: '6px' }}>🌸</span>}
                      {a.best && <span style={{ marginLeft: '8px', fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 700 }}>{t('doubts.bestAnswer')}</span>}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, fontFamily: 'var(--font-body)', color: 'var(--ink-soft)', marginBottom: '8px' }}>{a.text}</p>
                  <button type="button" onClick={() => upvoteAnswer(selected.id, a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
                    ❤️ {a.upvotes}
                  </button>
                </div>
              ))}
            </div>
            <textarea className="form-input" rows={3} placeholder={t('doubts.shareExperience')} value={answerText} onChange={(e) => setAnswerText(e.target.value)} style={{ marginBottom: '0.75rem', resize: 'vertical' }} />
            <button type="button" className="btn btn-primary btn-sm" onClick={postAnswer}>{t('doubts.postAnswer')}</button>
          </div>
        )}
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div className="modal-box modal-mobile-full" style={{ padding: '1.75rem' }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '1rem' }}>{t('doubts.askDoubt')}</h2>
              <select className="form-input" value={modalForm.hobby} onChange={(e) => setModalForm((f) => ({ ...f, hobby: e.target.value }))} style={{ marginBottom: '0.75rem' }}>
                {HOBBY_TAGS.map((h) => <option key={h}>{h}</option>)}
              </select>
              <input className="form-input" maxLength={100} placeholder="Question title (max 100 chars)" value={modalForm.title} onChange={(e) => setModalForm((f) => ({ ...f, title: e.target.value }))} style={{ marginBottom: '0.75rem' }} />
              <textarea className="form-input" rows={3} placeholder="More details (optional)" value={modalForm.description} onChange={(e) => setModalForm((f) => ({ ...f, description: e.target.value }))} style={{ marginBottom: '1rem', resize: 'none' }} />
              <button type="button" className="btn btn-primary btn-sm" style={{ width: '100%', marginBottom: '1rem', justifyContent: 'center' }} onClick={handleAiFirst} disabled={modalLoading || !modalForm.title.trim()}>
                {modalLoading ? t('doubts.thinking') : t('doubts.aiFirst')}
              </button>
              {modalAiAnswer && (
                <div className="ai-answer-card" style={{ marginBottom: '1rem' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px' }}>{t('doubts.aiSays')}</p>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--ink-soft)', whiteSpace: 'pre-wrap' }}>{modalAiAnswer}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${modalForm.hobby} ${modalForm.title} tutorial`)}&hl=${lang}`} target="_blank" rel="noopener noreferrer" style={{ background: '#FEE2E2', color: '#991B1B', padding: '6px 14px', borderRadius: '99px', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}>📺 Watch on YouTube →</a>
                    <a href={`https://www.google.com/search?q=${encodeURIComponent(`${modalForm.hobby} ${modalForm.title} beginner guide`)}&hl=${lang}`} target="_blank" rel="noopener noreferrer" style={{ background: '#EBF4F8', color: '#1565C0', padding: '6px 14px', borderRadius: '99px', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}>📖 {t('path.readArticles')}</a>
                  </div>
                </div>
              )}
              {modalAiAnswer && (
                <button type="button" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }} onClick={postToCommunity}>
                  {t('doubts.postCommunity')}
                </button>
              )}
              <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: '0.75rem', width: '100%' }} onClick={() => setShowModal(false)}>{t('doubts.cancel')}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageMotion>
  );
}
