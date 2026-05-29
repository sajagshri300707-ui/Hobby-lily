export const HOBBY_TAGS = ['Guitar', 'Watercolor', 'Photography'];

export const BLOOM_STAGES = {
  seed: { emoji: '🌰', label: 'Seed' },
  sprout: { emoji: '🌱', label: 'Sprout' },
  bud: { emoji: '🪴', label: 'Bud' },
  bloom: { emoji: '🌺', label: 'Bloom' },
  full_bloom: { emoji: '🌸', label: 'Full Bloom' },
};

export function stageLabel(stageKey) {
  const s = BLOOM_STAGES[stageKey];
  return s ? `${s.emoji} ${s.label}` : stageKey;
}

export function formatJournalDate(d = new Date()) {
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
