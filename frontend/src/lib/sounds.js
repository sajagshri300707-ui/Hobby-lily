/**
 * Sound effects using Web Audio API — no audio files needed.
 * All sounds are generated programmatically.
 */

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  try {
    return new (window.AudioContext || window.webkitAudioContext)();
  } catch {
    return null;
  }
}

/**
 * Play a cheerful ascending chime — used when a new hobby is planted.
 * Sounds like a magical "ding ding ding" rising sequence.
 */
export function playHobbyPlantedSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Check if user has interacted (required by browsers)
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  // Ascending notes: C5, E5, G5, C6 — a happy major arpeggio
  const notes = [523.25, 659.25, 783.99, 1046.50];
  const durations = [0.12, 0.12, 0.12, 0.3];
  const startTimes = [0, 0.13, 0.26, 0.39];

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTimes[i]);

    // Soft attack, quick decay
    gain.gain.setValueAtTime(0, ctx.currentTime + startTimes[i]);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + startTimes[i] + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTimes[i] + durations[i]);

    osc.start(ctx.currentTime + startTimes[i]);
    osc.stop(ctx.currentTime + startTimes[i] + durations[i] + 0.05);
  });

  // Add a soft sparkle layer on top
  setTimeout(() => {
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(2093, ctx.currentTime); // C7 sparkle
    gain2.gain.setValueAtTime(0.06, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.45);
  }, 380);
}

/**
 * Play a soft "level up" sound — used when chapters are skipped.
 */
export function playSkipSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});

  // Quick rising sweep
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.35);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.45);
}

/**
 * Play a soft task complete tick.
 */
export function playTaskCompleteSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.18);
}
