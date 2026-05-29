const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');
  return new GoogleGenerativeAI(apiKey);
}

// 'flash' = gemini-2.5-flash (quality, lower quota)
// 'lite'  = gemini-2.5-flash-lite (faster, higher quota) — default
function getModel(quality = 'lite') {
  const genAI = getGenAI();
  const name = quality === 'flash' ? 'gemini-2.5-flash' : 'gemini-2.5-flash-lite';
  return genAI.getGenerativeModel({ model: name });
}

// Retry once on 429/503 — but cap total wait at 15s so UI doesn't hang forever
async function generateWithRetry(model, prompt, retries = 1) {
  try {
    return await model.generateContent(prompt);
  } catch (err) {
    const is429 = err.message?.includes('429');
    const is503 = err.message?.includes('503');
    if (retries > 0 && (is429 || is503)) {
      const wait = is429 ? 15000 : 5000;
      console.log(`Gemini ${is429 ? '429' : '503'} — retrying in ${wait/1000}s...`);
      await new Promise(r => setTimeout(r, wait));
      return generateWithRetry(model, prompt, retries - 1);
    }
    throw err;
  }
}

function parseJsonFromText(text) {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

// POST /api/ai/suggest-hobby
router.post('/suggest-hobby', async (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: 'Input is required.' });
  try {
    const model = getModel('lite');
    const prompt = `The user wants to start a new hobby. Their input is: "${input}". 
Suggest the single best hobby for them and return ONLY valid JSON (no markdown, no code blocks):
{ "hobbyName": "string", "emoji": "single emoji", "reason": "2-3 sentence explanation", "estimatedTimePerDay": "e.g. 30 mins/day", "difficulty": "beginner|intermediate|advanced", "perfectFor": "short phrase" }`;
    const result = await generateWithRetry(model, prompt);
    res.json(parseJsonFromText(result.response.text().trim()));
  } catch (err) {
    console.error('suggest-hobby error:', err.message);
    res.json({ hobbyName: 'Journaling', emoji: '📓', reason: 'A quiet, reflective hobby that costs nothing.', estimatedTimePerDay: '20 mins/day', difficulty: 'beginner', perfectFor: 'Reflective thinkers' });
  }
});

// POST /api/ai/suggest-hobbies — 4 ranked suggestions
router.post('/suggest-hobbies', async (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: 'Input is required.' });
  try {
    const model = getModel('lite');
    const prompt = `The user wants to start a hobby. Input: "${input}".
Suggest 4 hobbies ranked by fit. Return ONLY valid JSON array (no markdown):
[{ "hobbyName": "string", "emoji": "single emoji", "reason": "2 sentences", "estimatedTimePerDay": "e.g. 30 mins/day", "difficulty": "beginner|intermediate|advanced", "perfectFor": "short phrase" }]
Be creative and specific to their input.`;
    const result = await generateWithRetry(model, prompt);
    const parsed = parseJsonFromText(result.response.text().trim());
    const hobbies = Array.isArray(parsed) ? parsed : [parsed];
    res.json({ hobbies: hobbies.slice(0, 4) });
  } catch (err) {
    console.error('suggest-hobbies error:', err.message);
    res.json({ hobbies: [
      { hobbyName: 'Urban Sketching', emoji: '✏️', reason: 'Sketch anywhere with just a notebook.', estimatedTimePerDay: '25 mins/day', difficulty: 'beginner', perfectFor: 'Creative souls' },
      { hobbyName: 'Acoustic Guitar', emoji: '🎸', reason: 'Making music is deeply satisfying.', estimatedTimePerDay: '30 mins/day', difficulty: 'beginner', perfectFor: 'Tactile learners' },
      { hobbyName: 'Watercolor', emoji: '🎨', reason: 'Soft and meditative.', estimatedTimePerDay: '40 mins/day', difficulty: 'beginner', perfectFor: 'Visual thinkers' },
      { hobbyName: 'Film Photography', emoji: '📷', reason: 'Slows you down and teaches light.', estimatedTimePerDay: '20 mins/day', difficulty: 'intermediate', perfectFor: 'Mindful observers' },
    ]});
  }
});

// POST /api/ai/generate-path — full 5-chapter path
router.post('/generate-path', async (req, res) => {
  const { hobbyName } = req.body;
  if (!hobbyName) return res.status(400).json({ error: 'Hobby name is required.' });

  const prompt = `Create a beginner learning path for the hobby: "${hobbyName}".

Return ONLY valid JSON (no markdown, no code blocks) with this EXACT structure:
{
  "hobbyName": "${hobbyName}",
  "totalDuration": "3 months",
  "chapters": [
    {
      "chapterNumber": 1,
      "chapterTitle": "Chapter title",
      "chapterDescription": "What this chapter covers in 1-2 sentences",
      "estimatedDuration": "2 weeks",
      "tasks": [
        {
          "taskNumber": 1,
          "taskTitle": "Task title",
          "taskDescription": "What to do and why in 2-3 sentences",
          "estimatedTime": "30 mins",
          "difficulty": "Easy",
          "status": "current",
          "proTip": "One insider tip most beginners don't know",
          "commonChallenges": [
            { "challenge": "A common problem beginners face", "solution": "Specific practical solution", "upvotes": 5 }
          ],
          "youtubeSearch": "${hobbyName} task-title beginner tutorial"
        }
      ]
    }
  ]
}

Create exactly 5 chapters with 2-3 tasks each. ONLY the very first task (chapter 1, task 1) should have status "current". All other tasks must have status "upcoming". Be specific and practical for a complete beginner.`;

  // Try lite first, fall back to flash
  for (const quality of ['lite', 'flash']) {
    try {
      const model = getModel(quality);
      const result = await generateWithRetry(model, prompt);
      const parsed = parseJsonFromText(result.response.text().trim());
      return res.json(parsed);
    } catch (err) {
      console.error(`generate-path ${quality} error:`, err.message);
    }
  }
  res.status(500).json({ error: 'Failed to generate learning path. Please try again in a moment.' });
});

// POST /api/ai/answer-doubt
router.post('/answer-doubt', async (req, res) => {
  const { question, description, hobbyName } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required.' });
  try {
    const model = getModel('lite');
    const hobby = hobbyName || 'their hobby';
    const prompt = `You are a warm mentor helping a beginner learn ${hobby}.
Question: "${question}"${description ? `\nContext: "${description}"` : ''}

Answer in 3-4 sentences. Start with empathy, give a clear solution, end with encouragement.`;
    const result = await generateWithRetry(model, prompt);
    res.json({ answer: result.response.text().trim() });
  } catch (err) {
    console.error('answer-doubt error:', err.message);
    res.status(500).json({ error: 'Failed to get answer.' });
  }
});

// POST /api/ai/transcribe-handwriting — uses lite, falls back to flash
router.post('/transcribe-handwriting', async (req, res) => {
  const { imageBase64, mimeType } = req.body;
  if (!imageBase64) return res.status(400).json({ error: 'Image data is required.' });
  const base64Clean = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  const promptParts = [
    { text: 'This is a handwritten note from a hobby learning journal. Transcribe exactly what is written. Return ONLY the transcribed text, nothing else. If nothing is written, return exactly: [blank]' },
    { inlineData: { mimeType: mimeType || 'image/png', data: base64Clean } },
  ];

  // Try lite first, fall back to flash
  for (const quality of ['lite', 'flash']) {
    try {
      const model = getModel(quality);
      const result = await generateWithRetry(model, promptParts);
      return res.json({ text: result.response.text().trim() });
    } catch (err) {
      console.error(`transcribe-handwriting ${quality} error:`, err.message);
    }
  }
  res.status(500).json({ error: 'Transcription failed. Please try again in a moment.' });
});

// POST /api/ai/journal-insight
router.post('/journal-insight', async (req, res) => {
  const { summary } = req.body;
  if (!summary) return res.status(400).json({ error: 'Summary is required.' });
  try {
    const model = getModel('lite');
    const prompt = `Based on these journal entries from a hobby learner: ${summary}
Give one short, warm, encouraging insight about their learning pattern. Max 2 sentences. Be specific.`;
    const result = await generateWithRetry(model, prompt);
    res.json({ insight: result.response.text().trim() });
  } catch (err) {
    console.error('journal-insight error:', err.message);
    res.json({ insight: 'You keep showing up even on hard days — that consistency is what turns practice into real skill.' });
  }
});

// POST /api/ai/pace-message
router.post('/pace-message', async (req, res) => {
  const { hobbyName, completed, total, days, daysSinceLast } = req.body;
  try {
    const model = getModel('lite');
    const prompt = `A learner is learning ${hobbyName || 'a hobby'}. Completed ${completed}/${total} tasks in ${days} days. Last activity ${daysSinceLast} days ago. Give one warm, motivating message in 1-2 sentences.`;
    const result = await generateWithRetry(model, prompt);
    res.json({ message: result.response.text().trim() });
  } catch (err) {
    console.error('pace-message error:', err.message);
    const msg = daysSinceLast > 3
      ? `It's been ${daysSinceLast} days — even 10 minutes of ${hobbyName} today would restart your momentum.`
      : `${completed} of ${total} tasks done — steady progress like yours is how real bloom happens.`;
    res.json({ message: msg });
  }
});

// POST /api/ai/bloom-prediction
router.post('/bloom-prediction', async (req, res) => {
  const { hobbyName, percent, days, pace } = req.body;
  try {
    const model = getModel('lite');
    const prompt = `A learner completed ${percent}% of their ${hobbyName || 'hobby'} path in ${days} days at a ${pace || 'steady'} pace. Return ONLY valid JSON: { "probability": number, "message": "one encouraging sentence" }`;
    const result = await generateWithRetry(model, prompt);
    res.json(parseJsonFromText(result.response.text().trim()));
  } catch (err) {
    console.error('bloom-prediction error:', err.message);
    res.json({ probability: Math.min(95, Math.round((percent || 0) * 1.05 + 15)), message: `At ${percent || 0}% through your path, you're building lasting habits.` });
  }
});

// POST /api/ai/generate-chapter — generate ONE chapter at a time (infinite path)
router.post('/generate-chapter', async (req, res) => {
  const { hobbyName, chapterNumber, completedChapters = [], language = 'en', culturalContext = '' } = req.body;
  if (!hobbyName || !chapterNumber) return res.status(400).json({ error: 'hobbyName and chapterNumber required.' });

  const level = chapterNumber <= 5  ? 'complete beginner (no prior knowledge)'
    : chapterNumber <= 15 ? 'beginner (knows the basics, building fundamentals)'
    : chapterNumber <= 30 ? 'intermediate (comfortable with basics, developing real skill)'
    : chapterNumber <= 50 ? 'advanced intermediate (solid foundation, refining technique)'
    : 'advanced (deep expertise, exploring nuance and mastery)';

  const langMap = { en:'English', hi:'Hindi', es:'Spanish', fr:'French', de:'German', ja:'Japanese', zh:'Chinese (Simplified)', ar:'Arabic', pt:'Portuguese', ko:'Korean' };
  const langName = langMap[language] || 'English';
  const langInstruction = language !== 'en'
    ? `IMPORTANT: Write ALL text (titles, descriptions, tips, challenges) in ${langName}. Adapt all cultural references, song recommendations, artists, and examples to be relevant to ${culturalContext || langName + '-speaking cultures'}.`
    : culturalContext ? `Adapt cultural references and examples to: ${culturalContext}.` : '';

  let curriculumContext = '';
  if (completedChapters.length > 0) {
    const summary = completedChapters.map(c =>
      `Ch${c.chapterNumber}: "${c.chapterTitle}" — ${(c.tasks || []).map(t => t.taskTitle).join(', ')}`
    ).join('\n');
    curriculumContext = `\nCURRICULUM SO FAR (do NOT repeat any of these):\n${summary}\n\nThe next chapter MUST build on previous chapters, introduce genuinely new concepts, and be harder than all previous chapters.`;
  }

  const prompt = `You are designing chapter ${chapterNumber} of an infinite learning curriculum for: "${hobbyName}".
Skill level: ${level}.
${langInstruction}
${curriculumContext}

End with a REWARD TASK (task 15) — a real satisfying milestone the learner can show off (e.g. perform a song, complete a painting, print a photo).

Return ONLY valid JSON (no markdown):
{
  "chapterNumber": ${chapterNumber},
  "chapterTitle": "Specific chapter title",
  "chapterDescription": "1-2 sentences on what new ground this covers",
  "estimatedDuration": "1-2 weeks",
  "reward": { "title": "Reward title", "description": "What they achieve — be specific", "emoji": "🎸" },
  "tasks": [{
    "taskNumber": 1,
    "taskTitle": "Task title",
    "taskDescription": "What to do and why in 2-3 sentences",
    "estimatedTime": "30 mins",
    "difficulty": "Easy|Medium|Hard",
    "status": "upcoming",
    "proTip": "One insider tip",
    "commonChallenges": [{ "challenge": "Common problem", "solution": "Specific solution", "upvotes": 5 }],
    "youtubeSearch": "${hobbyName} task-topic tutorial"
  }]
}

Create exactly 15 tasks. Task 15 = reward task. Chapter 1 task 1 = status "current", all others = "upcoming".`;

  for (const quality of ['lite', 'flash']) {
    try {
      const model = getModel(quality);
      const result = await generateWithRetry(model, prompt);
      const parsed = parseJsonFromText(result.response.text().trim());
      return res.json(parsed);
    } catch (err) {
      console.error(`generate-chapter ${quality} error:`, err.message);
    }
  }
  res.status(500).json({ error: 'Failed to generate chapter. Please try again.' });
});

// GET /api/ai/youtube-search?q=<query>
router.get('/youtube-search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query parameter q is required.' });
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'YOUTUBE_API_KEY not configured.' });
  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&q=${encodeURIComponent(q)}&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) {
      console.error('YouTube API error:', searchRes.status, await searchRes.text());
      return res.status(503).json({ error: 'YouTube search failed.' });
    }
    const searchData = await searchRes.json();
    const items = searchData.items || [];
    if (items.length === 0) return res.json({ videos: [] });

    const videoIds = items.map(i => i.id.videoId).join(',');
    const detailsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`);
    const detailsData = detailsRes.ok ? await detailsRes.json() : { items: [] };

    const durationMap = {};
    (detailsData.items || []).forEach(v => {
      const m = v.contentDetails.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (m) {
        const h = parseInt(m[1] || 0), min = parseInt(m[2] || 0), s = parseInt(m[3] || 0);
        durationMap[v.id] = h > 0 ? `${h}:${String(min).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${min}:${String(s).padStart(2,'0')}`;
      }
    });

    res.json({ videos: items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      author: item.snippet.channelTitle,
      duration: durationMap[item.id.videoId] || '',
      thumbnail: item.snippet.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${item.id.videoId}/mqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }))});
  } catch (err) {
    console.error('youtube-search error:', err.message);
    res.status(503).json({ error: 'YouTube search unavailable.' });
  }
});

module.exports = router;
