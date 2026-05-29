import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageMotion from '../../components/PageMotion';
import { useToast } from '../../context/ToastContext';

const MOCK_GROUPS = [
  {
    id: 1,
    name: 'Guitar Growers',
    emoji: '🎸',
    description: 'A cozy pod for beginner and intermediate guitarists growing together.',
    memberCount: 12,
    members: [
      { id: 1, name: 'Marcus T.', initials: 'MT', color: '#A8C4D4', stage: 'Sprout', hobby: 'Guitar' },
      { id: 2, name: 'Demo User', initials: 'DU', color: '#8A7E70', stage: 'Sprout', hobby: 'Guitar', isYou: true },
      { id: 3, name: 'Nina P.', initials: 'NP', color: '#C9920A', stage: 'Seed', hobby: 'Guitar' },
      { id: 4, name: 'Omar S.', initials: 'OS', color: '#A67C5B', stage: 'Sprout', hobby: 'Guitar' },
    ],
    sharedHobbies: [
      {
        name: 'D Major Chord',
        emoji: '🎸',
        members: [
          { name: 'Marcus T.', initials: 'MT', color: '#A8C4D4', progress: 65 },
          { name: 'Demo User', initials: 'DU', color: '#8A7E70', progress: 45 },
          { name: 'Nina P.', initials: 'NP', color: '#C9920A', progress: 20 },
        ],
      },
      {
        name: 'Strumming Patterns',
        emoji: '🎵',
        members: [
          { name: 'Marcus T.', initials: 'MT', color: '#A8C4D4', progress: 80 },
          { name: 'Demo User', initials: 'DU', color: '#8A7E70', progress: 55 },
        ],
      },
    ],
    messages: [
      { id: 1, from: 'Marcus T.', initials: 'MT', color: '#A8C4D4', text: 'Finally got the D chord clean!', time: '2h ago' },
      { id: 2, from: 'Nina P.', initials: 'NP', color: '#C9920A', text: "I'm still struggling with it", time: '1h ago' },
      { id: 3, from: 'Marcus T.', initials: 'MT', color: '#A8C4D4', text: 'Keep at it! The trick is to arch your fingers more.', time: '1h ago' },
      { id: 4, from: 'Demo User', initials: 'DU', color: '#8A7E70', text: 'Same here Nina! We will get there', time: '45m ago' },
    ],
  },
  {
    id: 2,
    name: 'Watercolor Wanderers',
    emoji: '🎨',
    description: 'Exploring watercolor together — messy, beautiful, and honest.',
    memberCount: 8,
    members: [
      { id: 1, name: 'Priya S.', initials: 'PS', color: '#C9920A', stage: 'Bud', hobby: 'Watercolor' },
      { id: 2, name: 'Leo K.', initials: 'LK', color: '#6B4226', stage: 'Bloom', hobby: 'Watercolor' },
      { id: 3, name: 'Demo User', initials: 'DU', color: '#8A7E70', stage: 'Sprout', hobby: 'Watercolor', isYou: true },
    ],
    sharedHobbies: [
      {
        name: 'Wet-on-Wet Technique',
        emoji: '🎨',
        members: [
          { name: 'Priya S.', initials: 'PS', color: '#C9920A', progress: 70 },
          { name: 'Leo K.', initials: 'LK', color: '#6B4226', progress: 90 },
          { name: 'Demo User', initials: 'DU', color: '#8A7E70', progress: 30 },
        ],
      },
    ],
    messages: [
      { id: 1, from: 'Priya S.', initials: 'PS', color: '#C9920A', text: 'Attempt 7 at painting leaves. Still messy. Still going', time: '3h ago' },
      { id: 2, from: 'Leo K.', initials: 'LK', color: '#6B4226', text: 'That is the spirit! Attempt 7 is where it starts clicking.', time: '2h ago' },
    ],
  },
];

function Avatar({ initials, color, size }) {
  const s = size || 36;
  return (
    <div style={{
      width: s, height: s, borderRadius: '50%',
      background: color, color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: Math.max(10, Math.floor(s * 0.3)) + 'px', flexShrink: 0,
    }}>{initials}</div>
  );
}

function ChatTab({ group }) {
  const [messages, setMessages] = useState(group.messages);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    setMessages(function(prev) {
      return prev.concat({
        id: Date.now(),
        from: 'Demo User',
        initials: 'DU',
        color: '#8A7E70',
        text: text.trim(),
        time: 'just now',
      });
    });
    setText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '300px', maxHeight: '420px' }}>
        {messages.map(function(m) {
          var isMe = m.from === 'Demo User';
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', gap: '10px', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end' }}
            >
              {!isMe && <Avatar initials={m.initials} color={m.color} size={32} />}
              <div style={{ maxWidth: '70%' }}>
                {!isMe && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', marginBottom: '3px', fontFamily: 'var(--font-body)', paddingLeft: '4px' }}>{m.from}</div>
                )}
                <div style={{
                  padding: '8px 12px',
                  borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: isMe ? 'var(--brown-coffee)' : 'var(--cream-dark)',
                  color: isMe ? 'white' : 'var(--ink)',
                  fontSize: '0.88rem', fontFamily: 'var(--font-body)', lineHeight: 1.5,
                }}>
                  {m.text}
                  <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '3px', textAlign: 'right' }}>{m.time}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
        <input
          className="form-input"
          placeholder={'Message ' + group.name + '...'}
          value={text}
          onChange={function(e) { setText(e.target.value); }}
          onKeyDown={function(e) { if (e.key === 'Enter') send(); }}
          style={{ flex: 1 }}
        />
        <button type="button" className="btn btn-primary btn-sm" onClick={send} disabled={!text.trim()}>Send</button>
      </div>
    </div>
  );
}

function MembersTab({ group }) {
  var toast = useToast();
  var showToast = toast.showToast;
  return (
    <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
      {group.members.map(function(m) {
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{ padding: '1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <div style={{ position: 'relative' }}>
              <Avatar initials={m.initials} color={m.color} size={48} />
              {m.isYou && (
                <span style={{
                  position: 'absolute', bottom: -2, right: -2,
                  background: 'var(--gold)', color: 'var(--ink)',
                  fontSize: '0.55rem', fontWeight: 700, padding: '1px 5px',
                  borderRadius: '99px', fontFamily: 'var(--font-body)',
                }}>You</span>
              )}
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>{m.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>{m.stage}</div>
            {!m.isYou && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem', padding: '4px 12px' }}
                onClick={function() { showToast('Opening chat with ' + m.name + ' 💬'); }}
              >
                Message
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function SharedHobbiesTab({ group }) {
  var toast = useToast();
  var showToast = toast.showToast;
  return (
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {group.sharedHobbies.map(function(hobby, i) {
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card"
            style={{ padding: '1.25rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>{hobby.emoji}</span>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--ink)' }}>{hobby.name}</h4>
              </div>
              <button
                type="button"
                className="btn btn-gold btn-sm"
                onClick={function() { showToast('Completed "' + hobby.name + '" together! 🌸', 'points'); }}
              >
                Complete Together
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {hobby.members.map(function(m, j) {
                return (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar initials={m.initials} color={m.color} size={28} />
                    <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-body)', color: 'var(--ink-soft)', width: '80px', flexShrink: 0 }}>{m.name}</span>
                    <div style={{ flex: 1, height: '6px', background: 'var(--cream-dark)', borderRadius: '99px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: m.progress + '%' }}
                        transition={{ duration: 0.8, delay: j * 0.1 }}
                        style={{ height: '100%', background: 'linear-gradient(90deg, var(--gold), var(--gold-light))', borderRadius: '99px' }}
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)', width: '36px', textAlign: 'right' }}>{m.progress}%</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
      {group.sharedHobbies.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌱</div>
          <p>No shared hobbies yet. Start one together!</p>
        </div>
      )}
    </div>
  );
}

function CreatePodModal({ onClose, onCreate }) {
  var toast = useToast();
  var showToast = toast.showToast;
  var [name, setName] = useState('');
  var [desc, setDesc] = useState('');

  var submit = function() {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), description: desc.trim() });
    onClose();
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="modal-box"
        style={{ padding: '1.75rem' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={function(e) { e.stopPropagation(); }}
      >
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '1.25rem' }}>Create a Pod</h2>
        <label className="form-label">Pod Name</label>
        <input
          className="form-input"
          placeholder="e.g. Guitar Growers"
          value={name}
          onChange={function(e) { setName(e.target.value); }}
          style={{ marginBottom: '1rem' }}
        />
        <label className="form-label">Description</label>
        <textarea
          className="form-input"
          rows={3}
          placeholder="What will your pod grow together?"
          value={desc}
          onChange={function(e) { setDesc(e.target.value); }}
          style={{ marginBottom: '1.25rem', resize: 'none' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn btn-gold" style={{ flex: 1, justifyContent: 'center' }} onClick={submit} disabled={!name.trim()}>
            Create Pod
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function JoinPodModal({ onClose }) {
  var toast = useToast();
  var showToast = toast.showToast;
  var [code, setCode] = useState('');

  var join = function() {
    if (!code.trim()) return;
    showToast('Joined pod with code "' + code + '"');
    onClose();
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="modal-box"
        style={{ padding: '1.75rem' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={function(e) { e.stopPropagation(); }}
      >
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '1.25rem' }}>Join a Pod</h2>
        <label className="form-label">Pod Invite Code</label>
        <input
          className="form-input"
          placeholder="Enter invite code..."
          value={code}
          onChange={function(e) { setCode(e.target.value); }}
          style={{ marginBottom: '1.25rem' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={join} disabled={!code.trim()}>
            Join Pod
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GroupsPage() {
  var toast = useToast();
  var showToast = toast.showToast;
  var [groups, setGroups] = useState(MOCK_GROUPS);
  var [selectedId, setSelectedId] = useState(MOCK_GROUPS[0].id);
  var [activeTab, setActiveTab] = useState('chat');
  var [showCreate, setShowCreate] = useState(false);
  var [showJoin, setShowJoin] = useState(false);

  var selected = groups.find(function(g) { return g.id === selectedId; }) || groups[0];

  var handleCreate = function(data) {
    var newGroup = {
      id: Date.now(),
      name: data.name,
      emoji: '🌱',
      description: data.description,
      memberCount: 1,
      members: [{ id: 1, name: 'Demo User', initials: 'DU', color: '#8A7E70', stage: 'Sprout', hobby: 'Various', isYou: true }],
      sharedHobbies: [],
      messages: [],
    };
    setGroups(function(prev) { return prev.concat(newGroup); });
    setSelectedId(newGroup.id);
    showToast('Pod "' + data.name + '" created!');
  };

  var TABS = [
    { key: 'chat', label: 'Chat' },
    { key: 'members', label: 'Members' },
    { key: 'hobbies', label: 'Shared Hobbies' },
  ];

  return (
    <PageMotion style={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <div style={{
          width: '240px', flexShrink: 0,
          background: '#2C1A0E',
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ padding: '1.25rem 1rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#F5E6D3', marginBottom: '0.75rem' }}>
              My Pods
            </h2>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={function() { setShowCreate(true); }}
                style={{
                  flex: 1, padding: '6px 10px', borderRadius: '8px',
                  background: 'rgba(201,146,10,0.2)', border: '1px solid rgba(201,146,10,0.4)',
                  color: '#E8C84A', fontSize: '0.75rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                }}
              >
                + Create Pod
              </button>
              <button
                type="button"
                onClick={function() { setShowJoin(true); }}
                style={{
                  flex: 1, padding: '6px 10px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#C8B8A8', fontSize: '0.75rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                }}
              >
                Join Pod
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {groups.map(function(g) {
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={function() { setSelectedId(g.id); setActiveTab('chat'); }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 12px',
                    borderRadius: '8px', border: 'none', cursor: 'pointer',
                    background: selectedId === g.id ? 'rgba(201,146,10,0.2)' : 'transparent',
                    color: selectedId === g.id ? '#E8C84A' : '#C8B8A8',
                    fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600,
                    transition: 'all 0.15s', marginBottom: '2px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{g.emoji}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</span>
                </button>
              );
            })}
          </div>

          <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', color: '#8A7A6A', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Voice
            </div>
            <button
              type="button"
              onClick={function() { showToast('Voice sessions coming soon!'); }}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#C8B8A8', fontSize: '0.8rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              Start Voice Session
            </button>
          </div>
        </div>

        {/* Main area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--cream)' }}>
          {selected ? (
            <React.Fragment>
              <div style={{
                padding: '1rem 1.5rem',
                background: 'var(--white)',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <span style={{ fontSize: '1.8rem' }}>{selected.emoji}</span>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '2px' }}>
                    {selected.name}
                  </h2>
                  <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>
                    {selected.memberCount} members · {selected.description}
                  </p>
                </div>
                <div style={{ display: 'flex' }}>
                  {selected.members.slice(0, 4).map(function(m, i) {
                    return (
                      <div key={m.id} style={{ marginLeft: i > 0 ? '-8px' : 0, zIndex: 4 - i }}>
                        <Avatar initials={m.initials} color={m.color} size={28} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--white)', padding: '0 1rem' }}>
                {TABS.map(function(tab) {
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={function() { setActiveTab(tab.key); }}
                      style={{
                        padding: '12px 16px', border: 'none', background: 'none',
                        cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600,
                        fontSize: '0.85rem',
                        color: activeTab === tab.key ? 'var(--brown-coffee)' : 'var(--ink-muted)',
                        borderBottom: activeTab === tab.key ? '2px solid var(--brown-coffee)' : '2px solid transparent',
                        transition: 'all 0.15s',
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selected.id + '-' + activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    style={{ height: '100%' }}
                  >
                    {activeTab === 'chat' && <ChatTab group={selected} />}
                    {activeTab === 'members' && <MembersTab group={selected} />}
                    {activeTab === 'hobbies' && <SharedHobbiesTab group={selected} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </React.Fragment>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'var(--ink-muted)' }}>
              <div style={{ fontSize: '3rem' }}>🌿</div>
              <p style={{ fontFamily: 'var(--font-body)' }}>Select a pod to start</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCreate && <CreatePodModal onClose={function() { setShowCreate(false); }} onCreate={handleCreate} />}
      </AnimatePresence>
      <AnimatePresence>
        {showJoin && <JoinPodModal onClose={function() { setShowJoin(false); }} />}
      </AnimatePresence>
    </PageMotion>
  );
}
