import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageMotion from '../../components/PageMotion';
import { useToast } from '../../context/ToastContext';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const INITIAL_GROUPS = [
  {
    id: 1,
    name: 'Guitar Growers',
    emoji: '🎸',
    description: 'A cozy pod for beginner and intermediate guitarists growing together.',
    memberCount: 12,
    members: [
      { id: 1, name: 'Marcus T.', initials: 'MT', color: '#A8C4D4', stage: 'Sprout', hobby: 'Guitar' },
      { id: 2, name: 'Demo User', initials: 'DU', color: '#8A7E70', stage: 'Sprout', hobby: 'Guitar', isYou: true },
    ],
    sharedHobbies: [
      {
        name: 'D Major Chord',
        emoji: '🎸',
        members: [
          { name: 'Marcus T.', initials: 'MT', color: '#A8C4D4', progress: 65 },
          { name: 'Demo User', initials: 'DU', color: '#8A7E70', progress: 45 },
        ],
      },
    ],
    messages: [
      { id: 1, from: 'Marcus T.', initials: 'MT', color: '#A8C4D4', text: 'Finally got the D chord clean!', time: '2h ago' },
      { id: 2, from: 'Nina P.', initials: 'NP', color: '#C9920A', text: "I'm still struggling with it", time: '1h ago' },
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
      { id: 2, name: 'Demo User', initials: 'DU', color: '#8A7E70', stage: 'Sprout', hobby: 'Watercolor', isYou: true },
    ],
    sharedHobbies: [],
    messages: [],
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

function ChatTab({ group, socket }) {
  const [messages, setMessages] = useState(group.messages || []);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);
  const { user } = useAuth();
  const userName = user?.name || 'Demo User';

  useEffect(() => {
    setMessages(group.messages || []);
  }, [group.id, group.messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    
    // Listen for real-time messages
    const handleReceive = (msg) => {
      setMessages(prev => {
        // Prevent duplicate messages if it's the one we just sent
        if (prev.find(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on('receive-message', handleReceive);
    return () => socket.off('receive-message', handleReceive);
  }, [socket]);

  const send = () => {
    if (!text.trim() || !socket) return;
    
    const newMsg = {
      id: Date.now(),
      from: userName,
      initials: userName.substring(0, 2).toUpperCase(),
      color: '#8A7E70',
      text: text.trim(),
      time: 'just now',
    };

    // Optimistic UI update
    setMessages(prev => [...prev, newMsg]);
    
    // Emit to socket
    socket.emit('send-message', { groupId: group.id, message: newMsg });
    setText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '300px', maxHeight: '420px' }}>
        {messages.map(m => {
          const isMe = m.from === userName;
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
          placeholder={`Message ${group.name}...`}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          style={{ flex: 1 }}
        />
        <button type="button" className="btn btn-primary btn-sm" onClick={send} disabled={!text.trim()}>Send</button>
      </div>
    </div>
  );
}

function MembersTab({ group }) {
  const { showToast } = useToast();
  return (
    <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
      {group.members.map(m => (
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
              onClick={() => showToast(`Opening chat with ${m.name} 💬`)}
            >
              Message
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function SharedHobbiesTab({ group, socket }) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const userName = user?.name || 'Demo User';
  const [hobbies, setHobbies] = useState(group.sharedHobbies || []);

  useEffect(() => {
    setHobbies(group.sharedHobbies || []);
  }, [group.id, group.sharedHobbies]);

  useEffect(() => {
    if (!socket) return;
    const handleProgress = ({ sharedHobbyName, progress, user: pUser }) => {
      setHobbies(prev => prev.map(h => {
        if (h.name !== sharedHobbyName) return h;
        return {
          ...h,
          members: h.members.map(m => m.name === pUser ? { ...m, progress } : m)
        };
      }));
    };
    socket.on('update-progress', handleProgress);
    return () => socket.off('update-progress', handleProgress);
  }, [socket]);

  const completeTask = (hobby) => {
    showToast(`Completed task for "${hobby.name}"! 🌸`, 'points');
    setHobbies(prev => prev.map(h => {
      if (h.name !== hobby.name) return h;
      return {
        ...h,
        members: h.members.map(m => m.name === userName ? { ...m, progress: Math.min(100, m.progress + 15) } : m)
      };
    }));
    
    const myProgress = hobby.members.find(m => m.name === userName)?.progress || 0;
    socket.emit('sync-progress', { groupId: group.id, sharedHobbyName: hobby.name, progress: Math.min(100, myProgress + 15), user: userName });
  };

  return (
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {hobbies.map((hobby, i) => (
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
              onClick={() => completeTask(hobby)}
            >
              Complete Task Together
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {hobby.members.map((m, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Avatar initials={m.initials} color={m.color} size={28} />
                <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-body)', color: 'var(--ink-soft)', width: '80px', flexShrink: 0 }}>{m.name}</span>
                <div style={{ flex: 1, height: '6px', background: 'var(--cream-dark)', borderRadius: '99px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: m.progress + '%' }}
                    transition={{ duration: 0.8 }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, var(--gold), var(--gold-light))', borderRadius: '99px' }}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)', width: '36px', textAlign: 'right' }}>{m.progress}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
      {hobbies.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌱</div>
          <p>No shared hobbies yet. Start one together!</p>
        </div>
      )}
    </div>
  );
}

// ─── WebRTC Voice / Video Channel ──────────────────────────────────────────
const VideoFeed = ({ stream, isLocal }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={{ 
      position: 'relative', 
      background: '#1A110B', 
      borderRadius: '12px', 
      overflow: 'hidden',
      aspectRatio: '16/9',
      width: '100%',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
    }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

function VoiceChannel({ group, onLeave, socket }) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const peersRef = useRef({});
  const streamRef = useRef();
  const { user } = useAuth();
  const userName = user?.name || 'Demo User';

  useEffect(() => {
    if (!socket) return;
    
    const initVoice = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        streamRef.current = stream;

        // TODO (PRODUCTION/WEBRTC): ~30% of users will fail to connect with only STUN.
        // You MUST add a TURN server here (e.g. Twilio Network Traversal, Stunner.io, or Coturn).
        const rtcConfig = { 
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            // { urls: 'turn:global.turn.twilio.com:3478?transport=udp', username: '...', credential: '...' }
          ] 
        };

        // Join signaling room
        socket.emit('join-voice', { groupId: group.id, user: userName });

        socket.on('user-connected', async ({ socketId, user: remoteUser }) => {
          console.log('User connected:', socketId);
          const peer = new RTCPeerConnection(rtcConfig);
          peersRef.current[socketId] = peer;
          
          stream.getTracks().forEach(t => peer.addTrack(t, stream));

          peer.onicecandidate = e => {
            if (e.candidate) socket.emit('webrtc-ice-candidate', { to: socketId, candidate: e.candidate });
          };

          peer.ontrack = e => {
            setRemoteStreams(prev => ({ ...prev, [socketId]: { stream: e.streams[0], user: remoteUser } }));
          };

          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          socket.emit('webrtc-offer', { to: socketId, offer, fromUser: userName });
        });

        socket.on('webrtc-offer', async ({ from, offer, fromUser }) => {
          console.log('Received offer from:', from);
          const peer = new RTCPeerConnection(rtcConfig);
          peersRef.current[from] = peer;
          
          stream.getTracks().forEach(t => peer.addTrack(t, stream));

          peer.onicecandidate = e => {
            if (e.candidate) socket.emit('webrtc-ice-candidate', { to: from, candidate: e.candidate });
          };

          peer.ontrack = e => {
            setRemoteStreams(prev => ({ ...prev, [from]: { stream: e.streams[0], user: fromUser } }));
          };

          await peer.setRemoteDescription(offer);
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          socket.emit('webrtc-answer', { to: from, answer });
        });

        socket.on('webrtc-answer', async ({ from, answer }) => {
          if (peersRef.current[from]) {
            await peersRef.current[from].setRemoteDescription(answer);
          }
        });

        socket.on('webrtc-ice-candidate', async ({ from, candidate }) => {
          if (peersRef.current[from]) {
            await peersRef.current[from].addIceCandidate(candidate);
          }
        });

        socket.on('user-disconnected', ({ socketId }) => {
          if (peersRef.current[socketId]) {
            peersRef.current[socketId].close();
            delete peersRef.current[socketId];
            setRemoteStreams(prev => {
              const next = { ...prev };
              delete next[socketId];
              return next;
            });
          }
        });

      } catch (err) {
        console.error('Failed to get media:', err);
      }
    };

    initVoice();

    return () => {
      socket.emit('leave-voice', { groupId: group.id });
      socket.off('user-connected');
      socket.off('webrtc-offer');
      socket.off('webrtc-answer');
      socket.off('webrtc-ice-candidate');
      socket.off('user-disconnected');
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      Object.values(peersRef.current).forEach(p => p.close());
    };
  }, [group.id, userName, socket]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#2C1A0E' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: '#F5E6D3', fontFamily: 'var(--font-heading)' }}>📹 Live Session</h3>
        <button className="btn btn-primary btn-sm" style={{ background: '#DC2626', borderColor: '#DC2626' }} onClick={onLeave}>
          Disconnect
        </button>
      </div>
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {/* Local User */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <VideoFeed stream={localStream} isLocal={true} />
            <span style={{ color: '#C8B8A8', fontSize: '0.8rem', textAlign: 'center' }}>{userName} (You)</span>
          </div>
          
          {/* Remote Users */}
          {Object.entries(remoteStreams).map(([socketId, data]) => (
            <div key={socketId} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <VideoFeed stream={data.stream} isLocal={false} />
              <span style={{ color: '#C8B8A8', fontSize: '0.8rem', textAlign: 'center' }}>{data.user}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ─── Modals ────────────────────────────────────────────────────────────────
function CreatePodModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const submit = () => {
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
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="modal-box"
        style={{ padding: '1.75rem' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '1.25rem' }}>Create a Server</h2>
        <label className="form-label">Server Name</label>
        <input className="form-input" placeholder="e.g. Guitar Growers" value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: '1rem' }} />
        <label className="form-label">Description</label>
        <textarea className="form-input" rows={3} placeholder="What will your pod grow together?" value={desc} onChange={e => setDesc(e.target.value)} style={{ marginBottom: '1.25rem', resize: 'none' }} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn btn-gold" style={{ flex: 1, justifyContent: 'center' }} onClick={submit} disabled={!name.trim()}>Create Server</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Groups/Servers Page ──────────────────────────────────────────────
export default function GroupsPage() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const userName = user?.name || 'Demo User';
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [selectedId, setSelectedId] = useState(INITIAL_GROUPS[0].id);
  const [activeTab, setActiveTab] = useState('chat'); // chat | members | hobbies | voice
  const [showCreate, setShowCreate] = useState(false);
  const [socket, setSocket] = useState(null);

  const selected = groups.find(g => g.id === selectedId) || groups[0];

  useEffect(() => {
    // Initialize Socket cleanly and disconnect on unmount
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    const handleReceiveInvite = ({ targetUser, fromUser, group }) => {
      // If we are the target user, we show a toast and optionally auto-join
      if (targetUser === userName) {
        showToast(`📬 ${fromUser} invited you to ${group.name}!`, 'points');
        // Auto add the group if we don't have it
        setGroups(prev => {
          if (prev.find(g => g.id === group.id)) return prev;
          return [...prev, group];
        });
      }
    };

    socket.on('receive-invite', handleReceiveInvite);
    
    // Join all group rooms for chat
    groups.forEach(g => newSocket.emit('join-group', g.id));

    return () => {
      newSocket.off('receive-invite', handleReceiveInvite);
      newSocket.disconnect();
    };
  }, [groups, userName, showToast]);

  const handleCreate = (data) => {
    const newGroup = {
      id: Date.now(),
      name: data.name,
      emoji: '🌱',
      description: data.description,
      memberCount: 1,
      members: [{ id: 1, name: userName, initials: userName.substring(0,2).toUpperCase(), color: '#8A7E70', stage: 'Sprout', hobby: 'Various', isYou: true }],
      sharedHobbies: [],
      messages: [],
    };
    setGroups(prev => [...prev, newGroup]);
    setSelectedId(newGroup.id);
    socket.emit('join-group', newGroup.id);
    showToast(`Server "${data.name}" created!`);
  };

  const TABS = [
    { key: 'chat', label: '💬 Text Channel' },
    { key: 'members', label: '👥 Members' },
    { key: 'hobbies', label: '🌱 Shared Hobbies' },
  ];

  return (
    <PageMotion style={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        {/* Left Sidebar (Servers) */}
        <div style={{
          width: '260px', flexShrink: 0,
          background: '#2C1A0E',
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ padding: '1.25rem 1rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#F5E6D3', marginBottom: '0.75rem' }}>
              My Servers
            </h2>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              style={{
                width: '100%', padding: '8px 10px', borderRadius: '8px',
                background: 'rgba(201,146,10,0.2)', border: '1px solid rgba(201,146,10,0.4)',
                color: '#E8C84A', fontSize: '0.8rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}
            >
              + Create Server
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {groups.map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => { setSelectedId(g.id); setActiveTab('chat'); }}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 12px',
                  borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: selectedId === g.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: selectedId === g.id ? '#F5E6D3' : '#C8B8A8',
                  fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600,
                  transition: 'all 0.15s', marginBottom: '2px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                  {g.emoji}
                </div>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</span>
              </button>
            ))}
          </div>

          {/* Voice Channels Section (Inside Server) */}
          {selected && (
            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.72rem', color: '#8A7A6A', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Voice Channels
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('voice')}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: '8px',
                  background: activeTab === 'voice' ? 'rgba(45, 106, 79, 0.4)' : 'transparent',
                  border: '1px solid transparent',
                  color: activeTab === 'voice' ? '#40916C' : '#C8B8A8',
                  fontSize: '0.8rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => { if (activeTab !== 'voice') e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                onMouseOut={e => { if (activeTab !== 'voice') e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: '1.1rem' }}>🔊</span> General
              </button>
            </div>
          )}
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
              </div>

              {activeTab !== 'voice' && (
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--white)', padding: '0 1rem' }}>
                  {TABS.map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
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
                  ))}
                </div>
              )}

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
                    {activeTab === 'chat' && <ChatTab group={selected} socket={socket} />}
                    {activeTab === 'members' && <MembersTab group={selected} />}
                    {activeTab === 'hobbies' && <SharedHobbiesTab group={selected} socket={socket} />}
                    {activeTab === 'voice' && <VoiceChannel group={selected} onLeave={() => setActiveTab('chat')} socket={socket} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </React.Fragment>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'var(--ink-muted)' }}>
              <div style={{ fontSize: '3rem' }}>🌿</div>
              <p style={{ fontFamily: 'var(--font-body)' }}>Select a server to start</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCreate && <CreatePodModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      </AnimatePresence>
    </PageMotion>
  );
}
