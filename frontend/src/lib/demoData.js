/** Original Phase 1 mock / seed data */

export const JOURNAL_ENTRIES = [
  {
    id: 1,
    date: 'May 16, 2026',
    hobby: 'Guitar',
    mood: '😊',
    title: 'Finally got D major clean!',
    content:
      'Practiced for 25 minutes today and finally nailed the D major chord cleanly 3 times in a row. My fingertips are sore but I don\'t care. This feels like a real breakthrough after 5 days of struggle.',
    stickers: [],
    mode: 'type',
    public: false,
  },
  {
    id: 2,
    date: 'May 14, 2026',
    hobby: 'Watercolor',
    mood: '😤',
    title: 'Ruined another painting',
    content:
      'Tried wet-on-wet with too much water. The whole thing bled into a muddy mess. I\'m keeping it anyway as proof that I showed up. Tomorrow I\'ll try again with drier paper.',
    stickers: [],
    mode: 'type',
    public: false,
  },
  {
    id: 3,
    date: 'May 12, 2026',
    hobby: 'Guitar',
    mood: '🌸',
    title: 'Played C and G smoothly for the first time',
    content:
      'The chord transition finally clicked. I played C → G → C for 3 minutes without stopping. It\'s such a small thing, but I felt genuinely proud.',
    stickers: [],
    mode: 'type',
    public: false,
  },
];

/* ─── Cover gradient presets ─────────────────────────── */
export const COVER_GRADIENTS = [
  { id: 'sunset', label: 'Sunset', css: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)' },
  { id: 'ocean', label: 'Ocean', css: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)' },
  { id: 'forest', label: 'Forest', css: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)' },
  { id: 'lavender', label: 'Lavender', css: 'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)' },
  { id: 'amber', label: 'Amber', css: 'linear-gradient(135deg, #F6D365 0%, #FDA085 100%)' },
  { id: 'midnight', label: 'Midnight', css: 'linear-gradient(135deg, #0C3483 0%, #A2B6DF 100%)' },
  { id: 'rose', label: 'Rosé', css: 'linear-gradient(135deg, #FECFEF 0%, #FF9A9E 100%)' },
  { id: 'charcoal', label: 'Charcoal', css: 'linear-gradient(135deg, #434343 0%, #000000 100%)' },
];

/* ─── Blog theme presets ─────────────────────────────── */
export const BLOG_THEMES = [
  { id: 'warm', label: 'Warm', accent: '#E07A5F', bg: '#FFF8F0', text: '#3D2C2E', mutedText: '#8A7168' },
  { id: 'cool', label: 'Cool', accent: '#457B9D', bg: '#F1FAEE', text: '#1D3557', mutedText: '#6B8BA4' },
  { id: 'pastel', label: 'Pastel', accent: '#B5838D', bg: '#FFF0F5', text: '#4A3040', mutedText: '#9B7A87' },
  { id: 'dark', label: 'Dark', accent: '#E8C84A', bg: '#1A1A2E', text: '#E8E8F0', mutedText: '#9090A8' },
  { id: 'mono', label: 'Mono', accent: '#555555', bg: '#FAFAFA', text: '#1A1A1A', mutedText: '#888888' },
  { id: 'garden', label: 'Garden', accent: '#6B8F4E', bg: '#F5F9F0', text: '#2D3B1F', mutedText: '#7A8E6B' },
];

/* ─── Font pairing presets ───────────────────────────── */
export const FONT_PAIRS = [
  { id: 'editorial', label: 'Editorial', heading: "'Playfair Display', Georgia, serif", body: "'DM Sans', system-ui, sans-serif" },
  { id: 'modern', label: 'Modern', heading: "'DM Sans', system-ui, sans-serif", body: "'DM Sans', system-ui, sans-serif" },
  { id: 'classic', label: 'Classic', heading: "Georgia, 'Times New Roman', serif", body: "Georgia, 'Times New Roman', serif" },
  { id: 'technical', label: 'Technical', heading: "'DM Sans', system-ui, sans-serif", body: "'Courier New', Courier, monospace" },
];

/* ─── Layout presets ─────────────────────────────────── */
export const LAYOUT_STYLES = [
  { id: 'classic', label: 'Classic', description: 'Traditional blog layout' },
  { id: 'magazine', label: 'Magazine', description: 'Full-width cover, editorial feel' },
  { id: 'minimal', label: 'Minimal', description: 'Clean, centered, distraction-free' },
  { id: 'card', label: 'Card', description: 'Contained in an elevated card' },
];

/* ─── Blog post demo data ────────────────────────────── */
export const BLOG_POSTS = [
  {
    id: 1,
    date: 'May 28, 2026',
    title: 'The Day My Fingers Finally Obeyed',
    subtitle: 'A breakthrough moment with the D major chord',
    hobby: 'Guitar',
    mood: '😊',
    tags: ['guitar', 'breakthrough', 'practice'],
    readingTime: '3 min read',
    content: '<p>Practiced for 25 minutes today and <strong>finally nailed the D major chord</strong> cleanly 3 times in a row.</p><p>My fingertips are sore but I don\'t care. This feels like a real breakthrough after 5 days of struggle. There\'s something deeply satisfying about the moment your muscle memory kicks in — your fingers just <em>know</em> where to go.</p><h2>What I learned</h2><ul><li>Pressing closer to the fret wire makes a huge difference</li><li>Relaxing my thumb position helped with reach</li><li>Short, focused sessions beat long frustrated ones</li></ul><blockquote>The guitar is a small orchestra. It is polyphonic. Every string is a different color, a different voice. — Andrés Segovia</blockquote><p>Tomorrow: attempting the D → A transition. Wish me luck. 🎸</p>',
    coverGradient: 'amber',
    theme: 'warm',
    fontPair: 'editorial',
    layout: 'magazine',
    published: true,
  },
  {
    id: 2,
    date: 'May 26, 2026',
    title: 'Watercolor Disaster (That I\'m Keeping)',
    subtitle: 'Learning to embrace the beautiful mess',
    hobby: 'Watercolor',
    mood: '😤',
    tags: ['watercolor', 'failure', 'persistence'],
    readingTime: '4 min read',
    content: '<p>Tried wet-on-wet with too much water. The whole thing <strong>bled into a muddy mess</strong>.</p><p>I\'m keeping it anyway as proof that I showed up. Tomorrow I\'ll try again with drier paper. There\'s a certain beauty in chaos — the way colors blend when you lose control creates patterns you\'d never intentionally paint.</p><h2>Notes for next time</h2><ol><li>Use less water — the paper should be damp, not soaking</li><li>Work faster before the paper dries</li><li>Keep a test strip of the same paper nearby</li></ol><p>The frustration is real, but so is the progress. My color mixing is getting <em>so much better</em> even when the painting fails. That counts for something.</p>',
    coverGradient: 'lavender',
    theme: 'pastel',
    fontPair: 'classic',
    layout: 'classic',
    published: true,
  },
  {
    id: 3,
    date: 'May 24, 2026',
    title: 'C → G → C: The Sound of Progress',
    subtitle: 'When muscle memory finally clicks into place',
    hobby: 'Guitar',
    mood: '🌸',
    tags: ['guitar', 'chords', 'milestone'],
    readingTime: '2 min read',
    content: '<p>The chord transition finally clicked. I played <strong>C → G → C for 3 minutes</strong> without stopping.</p><p>It\'s such a small thing, but I felt genuinely proud. The kind of pride that makes you want to text someone about it at 11pm.</p><blockquote>Progress isn\'t always visible. Sometimes it\'s in the silence between the notes.</blockquote><p>I recorded a little clip and played it back. It\'s imperfect and beautiful and <em>mine</em>. That\'s all that matters right now. 🌸</p>',
    coverGradient: 'rose',
    theme: 'garden',
    fontPair: 'editorial',
    layout: 'minimal',
    published: false,
  },
  {
    id: 4,
    date: 'May 20, 2026',
    title: 'Golden Hour Photography Experiment',
    subtitle: 'Chasing the light with my phone camera',
    hobby: 'Photography',
    mood: '🔥',
    tags: ['photography', 'golden-hour', 'experiment'],
    readingTime: '5 min read',
    content: '<h2>The Setup</h2><p>Woke up at 5:30am (yes, really) to catch the golden hour. Armed with nothing but my phone and a lot of coffee.</p><p>The light was <em>incredible</em>. Everything looked like it was dipped in honey. I took about 80 photos in 40 minutes.</p><h2>What Worked</h2><ul><li><strong>Backlighting</strong> — shooting toward the sun created gorgeous silhouettes</li><li><strong>Reflections</strong> — puddles from last night\'s rain became mirrors</li><li><strong>Rule of thirds</strong> — finally understanding why this exists</li></ul><h2>What Didn\'t</h2><ul><li>Most close-ups were overexposed</li><li>My shadow kept photobombing</li></ul><p>Out of 80 shots, I got maybe 5 I\'m proud of. But those 5? <strong>Chef\'s kiss.</strong> 📸</p>',
    coverGradient: 'sunset',
    theme: 'warm',
    fontPair: 'modern',
    layout: 'magazine',
    published: true,
  },
];

export const DOUBT_QUESTIONS = [
  {
    id: 1,
    title: 'Why do my watercolor edges look harsh?',
    hobby: 'Watercolor',
    author: 'Priya S.',
    stage: '🪴 Bud',
    ago: '2h ago',
    upvotes: 8,
    answerCount: 3,
    aiAnswer:
      'Harsh edges usually mean your paper dried too fast or your brush was too dry. Try a wetter brush on damp paper for soft blends, and let each layer dry fully before the next.',
    answers: [
      { id: 1, name: 'Leo K.', initials: 'LK', color: '#6B4226', stage: '🌺 Bloom', text: 'Soften the edge with a clean damp brush while the paint is still wet.', upvotes: 6, best: true, fullBloom: false },
    ],
  },
  {
    id: 2,
    title: 'How do I stop buzzing when pressing guitar strings?',
    hobby: 'Guitar',
    author: 'Marcus T.',
    stage: '🌱 Sprout',
    ago: '1d ago',
    upvotes: 14,
    answerCount: 7,
    aiAnswer:
      'Buzzing often means you\'re not pressing hard enough behind the fret or your finger is too far from the fret wire. Press closer to the fret and check your thumb position on the neck.',
    answers: [
      { id: 2, name: 'Demo User', initials: 'DU', color: '#8A7E70', stage: '🌱 Sprout', text: 'Lighter strings helped me a lot as a beginner.', upvotes: 4, best: true, fullBloom: false },
    ],
  },
  {
    id: 3,
    title: 'What camera setting is best for indoor portraits?',
    hobby: 'Photography',
    author: 'Aisha R.',
    stage: '🌰 Seed',
    ago: '3d ago',
    upvotes: 11,
    answerCount: 5,
    aiAnswer:
      'Start with a wide aperture (low f-number) for soft background blur, keep ISO as low as light allows, and face your subject toward the largest window in the room.',
    answers: [],
  },
];

export const COMMUNITY_POSTS = [
  {
    id: 1,
    user: 'Priya S.',
    initials: 'PS',
    color: '#C9920A',
    hobby: 'Watercolor',
    stage: '🪴 Bud',
    time: '2h ago',
    content:
      'My 7th attempt at painting leaves. Still messy. Still going. 🍃 The color mixing is getting more intuitive though — I can feel the difference.',
    reactions: { '🌸': 24, '💪': 18, '🥹': 11 },
    video: false,
  },
  {
    id: 2,
    user: 'Marcus T.',
    initials: 'MT',
    color: '#A8C4D4',
    hobby: 'Guitar',
    stage: '🌱 Sprout',
    time: '5h ago',
    content:
      "Finally recorded myself playing. It's... not great. My rhythm is off and my chord changes are slow. But I promised myself I'd share the ugly parts too. Here goes nothing.",
    reactions: { '🌸': 41, '💪': 33, '🥹': 27 },
    video: true,
    videoLabel: '1:24',
  },
  {
    id: 3,
    user: 'Aisha R.',
    initials: 'AR',
    color: '#A67C5B',
    hobby: 'Photography',
    stage: '🌰 Seed',
    time: '1d ago',
    content:
      "Day 6. Took 40 photos. 39 are trash. One made me go 'wait, that's actually good'. Keeping that feeling. 📷",
    reactions: { '🌸': 67, '💪': 45, '🥹': 38 },
    video: false,
  },
  {
    id: 4,
    user: 'Leo K.',
    initials: 'LK',
    color: '#6B4226',
    hobby: 'Pottery',
    stage: '🌺 Bloom',
    time: '2d ago',
    content:
      "3 months in. My first bowl that doesn't look like a wobbly pancake. Giving it to my mum. She cried. I cried. Worth every terrible piece before this.",
    reactions: { '🌸': 142, '💪': 89, '🥹': 96 },
    video: false,
  },
];

export const LEADERBOARD = [
  { rank: 1, name: 'Leo K.', initials: 'LK', color: '#C9920A', hobby: 'Pottery', stage: '🌺 Bloom', tasks: 89, days: 94, bloomometer: 94 },
  { rank: 2, name: 'Aisha R.', initials: 'AR', color: '#A8C4D4', hobby: 'Photography', stage: '🌸 Full Bloom', tasks: 76, days: 87, bloomometer: 87 },
  { rank: 3, name: 'Priya S.', initials: 'PS', color: '#A67C5B', hobby: 'Watercolor', stage: '🪴 Bud', tasks: 61, days: 67, bloomometer: 72 },
  { rank: 4, name: 'Marcus T.', initials: 'MT', color: '#6B4226', hobby: 'Guitar', stage: '🌱 Sprout', tasks: 52, days: 53, bloomometer: 60 },
  { rank: 5, name: 'Demo User', initials: 'DU', color: '#8A7E70', hobby: 'Guitar', stage: '🌱 Sprout', tasks: 47, days: 47, bloomometer: 54, isYou: true },
  { rank: 6, name: 'Nina P.', initials: 'NP', color: '#A8C4D4', hobby: 'Knitting', stage: '🌰 Seed', tasks: 34, days: 38, bloomometer: 40 },
  { rank: 7, name: 'Omar S.', initials: 'OS', color: '#C9920A', hobby: 'Chess', stage: '🌱 Sprout', tasks: 28, days: 31, bloomometer: 35 },
];
