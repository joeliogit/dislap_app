/* ============================================
   DISSLAPP — XP Calculator Utilities
   ============================================ */

export function getXPForNextLevel(xp) {
  if (xp < 500) return 500;
  if (xp < 1500) return 1500;
  if (xp < 3500) return 3500;
  if (xp < 7000) return 7000;
  if (xp < 10000) return 10000;
  return 15000;
}

export function getXPPercent(xp) {
  const levels = [0, 500, 1500, 3500, 7000, 10000];
  for (let i = 0; i < levels.length - 1; i++) {
    if (xp < levels[i + 1]) {
      return ((xp - levels[i]) / (levels[i + 1] - levels[i])) * 100;
    }
  }
  return 100;
}

export function getLevelInfo(xp) {
  const levels = [
    { min: 0, max: 499, level: 1, name: 'Explorador', emoji: '🌱' },
    { min: 500, max: 1499, level: 2, name: 'Aventurero', emoji: '🌟' },
    { min: 1500, max: 3499, level: 3, name: 'Constructor', emoji: '🚀' },
    { min: 3500, max: 6999, level: 4, name: 'Narrador', emoji: '🦁' },
    { min: 7000, max: 9999, level: 5, name: 'Maestro', emoji: '📖' },
    { min: 10000, max: Infinity, level: 6, name: 'Maestro Disslapp', emoji: '🏆' },
  ];
  return levels.find(l => xp >= l.min && xp <= l.max) || levels[0];
}
