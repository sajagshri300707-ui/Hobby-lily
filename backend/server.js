require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const hobbyRoutes = require('./routes/hobbies');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Real-time Sockets
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // Group Management
  socket.on('join-group', (groupId) => {
    socket.join(`group-${groupId}`);
  });

  // Text Chat
  socket.on('send-message', ({ groupId, message }) => {
    io.to(`group-${groupId}`).emit('receive-message', message);
  });

  // Shared Hobbies sync
  socket.on('sync-progress', ({ groupId, sharedHobbyName, progress, user }) => {
    socket.to(`group-${groupId}`).emit('update-progress', { sharedHobbyName, progress, user });
  });

  // Community Invites
  socket.on('invite-user', ({ targetUser, fromUser, group }) => {
    // Broadcast invite; frontend filters by username
    io.emit('receive-invite', { targetUser, fromUser, group });
  });

  // WebRTC Signaling
  socket.on('join-voice', ({ groupId, user }) => {
    const room = `voice-${groupId}`;
    socket.join(room);
    // Tell others in room that a user connected, they should initiate offer
    socket.to(room).emit('user-connected', { socketId: socket.id, user });
  });

  socket.on('webrtc-offer', ({ to, offer, fromUser }) => {
    io.to(to).emit('webrtc-offer', { from: socket.id, offer, fromUser });
  });

  socket.on('webrtc-answer', ({ to, answer }) => {
    io.to(to).emit('webrtc-answer', { from: socket.id, answer });
  });

  socket.on('webrtc-ice-candidate', ({ to, candidate }) => {
    io.to(to).emit('webrtc-ice-candidate', { from: socket.id, candidate });
  });

  socket.on('leave-voice', ({ groupId }) => {
    const room = `voice-${groupId}`;
    socket.leave(room);
    socket.to(room).emit('user-disconnected', { socketId: socket.id });
  });

  socket.on('disconnecting', () => {
    // Notify all rooms the socket was in about the disconnect
    socket.rooms.forEach((room) => {
      if (room.startsWith('voice-')) {
        socket.to(room).emit('user-disconnected', { socketId: socket.id });
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // raised for dev
  keyGenerator: (req) => {
    const id = req.user?.id;
    if (id) return String(id);
    // Normalize IPv6-mapped IPv4 (::ffff:127.0.0.1 → 127.0.0.1)
    const ip = req.ip || '';
    return ip.startsWith('::ffff:') ? ip.slice(7) : ip;
  },
  validate: { xForwardedForHeader: false, keyGeneratorIpFallback: false },
  message: { error: 'Too many AI requests. Please try again later.' }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hobbies', hobbyRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HobbyLily API is blooming 🌸' });
});

server.listen(PORT, () => {
  console.log(`🌸 HobbyLily backend running on port ${PORT}`);
});
