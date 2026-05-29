/**
 * Streak utilities for HobbyLily
 * Tracks daily login/activity streak using localStorage
 * Keys: hl_streak_count, hl_streak_last_date
 */

const STREAK_COUNT_KEY = 'hl_streak_count';
const STREAK_DATE_KEY = 'hl_streak_last_date';

/** Returns today's date string in YYYY-MM-DD format */
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/** Returns yesterday's date string in YYYY-MM-DD format */
function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Reads current streak data from localStorage.
 * @returns {{ count: number, lastDate: string|null }}
 */
export function getStreak() {
  const count = parseInt(localStorage.getItem(STREAK_COUNT_KEY) || '0', 10);
  const lastDate = localStorage.getItem(STREAK_DATE_KEY) || null;
  return { count, lastDate };
}

/**
 * Updates the streak based on today's date.
 * - If already visited today: no change
 * - If visited yesterday: increment streak
 * - Otherwise: reset to 1
 * @returns {{ count: number, isNew: boolean, milestone: number|null }}
 */
export function updateStreak() {
  const today = todayStr();
  const yesterday = yesterdayStr();
  const { count, lastDate } = getStreak();

  // Already visited today — no change
  if (lastDate === today) {
    return { count, isNew: false, milestone: null };
  }

  let newCount;
  if (lastDate === yesterday) {
    // Consecutive day — increment
    newCount = count + 1;
  } else {
    // Missed a day (or first visit) — reset
    newCount = 1;
  }

  localStorage.setItem(STREAK_COUNT_KEY, String(newCount));
  localStorage.setItem(STREAK_DATE_KEY, today);

  const MILESTONES = [3, 7, 14, 30];
  const milestone = MILESTONES.includes(newCount) ? newCount : null;

  return { count: newCount, isNew: true, milestone };
}

/**
 * Returns a flame emoji intensity based on streak count
 */
export function streakFlame(count) {
  if (count >= 30) return '🔥🔥🔥';
  if (count >= 14) return '🔥🔥';
  if (count >= 7) return '🔥';
  if (count >= 3) return '🔥';
  return '✨';
}

/**
 * Returns a motivational message for the streak
 */
export function streakMessage(count) {
  if (count >= 30) return 'Legendary gardener! 30+ day streak!';
  if (count >= 14) return 'Two weeks strong! You\'re unstoppable!';
  if (count >= 7) return 'One full week! Your garden is thriving!';
  if (count >= 3) return 'Three days in a row! Keep it up!';
  if (count === 1) return 'Day 1 — every bloom starts here!';
  return `${count} day streak!`;
}
