# 🌸 HobbyLily
### Grow Skills. Not Just Streaks.

An AI-powered hobby-learning ecosystem that transforms curiosity into mastery through personalized learning paths, intelligent mentorship, real-time collaboration, and adaptive skill progression.

---

## ✨ What is HobbyLily?

Learning a hobby is exciting. Sticking to it is not.

Most people start learning guitar, sketching, chess, photography, or coding with excitement — but eventually get lost, overwhelmed, or stuck.

**HobbyLily was built to solve exactly that.**

Using AI, real-time collaboration, and gamified progression systems, HobbyLily acts as a personalized mentor that helps users discover hobbies, learn them through adaptive curricula, and remain consistent over time.

---

## 🌱 Core Philosophy

Traditional learning platforms assume that everyone starts from zero. HobbyLily doesn't.

If you already know Guitar and decide to learn Ukulele, why should you repeat months of beginner content?

The platform understands transferable skills and adapts learning paths dynamically. We call this:

### 🧠 Knowledge Inheritance
> A learning system where previously acquired skills influence future learning journeys.

---

## 🚀 Features

### 🎯 AI Hobby Discovery
Tell HobbyLily what interests you. The platform uses Gemini AI to generate personalized hobby recommendations along with:
- Difficulty estimation
- Time commitment
- Learning expectations
- Why the hobby fits you

### 📚 Infinite AI Curriculum
Every hobby receives its own dynamically generated curriculum. Instead of static lessons:
- Chapters are generated on demand
- Difficulty increases naturally
- Content adapts to user progress
- Previously completed chapters influence future content
- No two learning journeys are exactly the same

### 🌿 Branch Learning System
Learning isn't linear. A Guitar learner may suddenly become obsessed with Fingerstyle, Guitar Riffs, Music Theory, or Improvisation.

HobbyLily allows users to create **learning branches** inside a hobby:

```
Guitar
├── Chords
├── Fingerstyle
├── Music Theory
└── Guitar Riffs
```

Branches can:
- Exist independently
- Become full learning paths
- Merge back into the parent hobby

This mimics how humans naturally learn.

### 🌸 Bloom Progression Engine
Every hobby begins as a seed. As users complete tasks and remain consistent, their hobby visually evolves through bloom stages:

**Seed → Sprout → Bud → Bloom**

Progress becomes something users can actually see.

### 🌼 Doubt Garden
A dedicated AI mentor for moments when learners get stuck. Users can ask questions naturally. The AI:
- Responds in the user's preferred language
- Provides clear explanations
- Encourages consistency
- Acts as a supportive mentor rather than a search engine

### ✍️ Smart Journaling
Track progress every day.

**Handwriting Recognition** — Users can write notes directly on a canvas. Gemini Vision automatically reads handwriting, converts notes to text, and stores progress logs.

**AI Insights** — The platform analyzes journals and generates personalized learning observations.

### 🎥 Automatic Learning Resources
Every task automatically fetches:
- Relevant YouTube tutorials
- Region-specific content
- Language-specific recommendations

Users spend less time searching and more time learning.

### 👥 Real-Time Community
Learning is easier together.

- **Group System** — Create groups, invite friends, share hobbies
- **Live Chat** — Real-time communication powered by Socket.io
- **WebRTC Voice Rooms** — Practice hobbies together through peer-to-peer voice channels

### 🏆 Gamification
Stay motivated through:
- Bloom Stages
- Progress Tracking
- Consistency Metrics
- Community Leaderboards

---

## 🏗️ Technical Architecture

### Frontend
- React 19
- Vite
- TailwindCSS
- Framer Motion
- GSAP
- React Router
- Context API

### Backend
- Node.js
- Express 5
- PostgreSQL
- Socket.io
- JWT Authentication

**Authentication Methods:** Email Login · Google OAuth · Phone Authentication

### AI Layer
Powered by **Gemini 2.5 Flash** and **Gemini 2.5 Flash Lite**

Capabilities:
- Hobby Recommendation
- Curriculum Generation
- Knowledge Inheritance
- Journal Analysis
- AI Mentorship
- Handwriting Recognition

### Infrastructure
Dockerized architecture using React Frontend · Express Backend · PostgreSQL Database, managed through Docker Compose.

---

## 🔥 Engineering Challenges

**AI Reliability** — Implemented retry mechanisms for 429 Rate Limits and 503 Service Unavailable errors. Automatic model fallback ensures uninterrupted user experience.

**Structured AI Outputs** — Curriculum generation requires strict JSON formatting. Custom parsing pipelines sanitize and validate model outputs before processing.

**Dynamic Curriculum Engine** — Learning paths consider user interests, existing skills, transferable knowledge, previous chapters, learning history, and language preferences.

**WebRTC Signaling** — Implemented peer-to-peer communication through Offers, Answers, ICE Candidates, and a Socket.io Signaling Server.

---

## 🌟 Why HobbyLily Exists

Most platforms teach skills. HobbyLily teaches people **how to stay curious**.

The goal isn't just completing lessons. The goal is helping users build lifelong hobbies and sustainable learning habits.

---

## 🚀 Built During BuildVerse Hackathon

From idea to implementation, HobbyLily was developed during BuildVerse with a vision of making learning more adaptive, human, and enjoyable.

---

> *"Every expert was once curious."*

🌸 **Keep Growing.**
