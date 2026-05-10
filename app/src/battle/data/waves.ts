export interface WaveConfig {
  spawnInterval: number;
  perSpawnMin: number;
  perSpawnMax: number;
  enemyHpMul: number;
  enemySpeedMul: number;
  brutePct: number;
  killGoal: number;
  isBossWave?: boolean;
}

// 20 waves; each wave clear (1-19) triggers a level-up modal → 19 total levelups.
// Pacing tightened: spawnIntervals shortened ~30% across all waves and
// ENEMY_BASE.vy bumped ~55% so the front line approaches with momentum.
export const WAVES: WaveConfig[] = [
  // 1
  { spawnInterval: 1.05, perSpawnMin: 2, perSpawnMax: 3, enemyHpMul: 1.0,  enemySpeedMul: 1.0,  brutePct: 0.10, killGoal: 5 },
  // 2-3
  { spawnInterval: 0.95, perSpawnMin: 2, perSpawnMax: 3, enemyHpMul: 1.15, enemySpeedMul: 1.05, brutePct: 0.15, killGoal: 7 },
  { spawnInterval: 0.95, perSpawnMin: 2, perSpawnMax: 3, enemyHpMul: 1.15, enemySpeedMul: 1.05, brutePct: 0.15, killGoal: 7 },
  // 4-6
  { spawnInterval: 0.85, perSpawnMin: 2, perSpawnMax: 3, enemyHpMul: 1.35, enemySpeedMul: 1.1,  brutePct: 0.20, killGoal: 9 },
  { spawnInterval: 0.85, perSpawnMin: 2, perSpawnMax: 3, enemyHpMul: 1.35, enemySpeedMul: 1.1,  brutePct: 0.20, killGoal: 9 },
  { spawnInterval: 0.85, perSpawnMin: 2, perSpawnMax: 3, enemyHpMul: 1.35, enemySpeedMul: 1.1,  brutePct: 0.20, killGoal: 9 },
  // 7-10
  { spawnInterval: 0.7,  perSpawnMin: 3, perSpawnMax: 4, enemyHpMul: 1.7,  enemySpeedMul: 1.18, brutePct: 0.25, killGoal: 12 },
  { spawnInterval: 0.7,  perSpawnMin: 3, perSpawnMax: 4, enemyHpMul: 1.7,  enemySpeedMul: 1.18, brutePct: 0.25, killGoal: 12 },
  { spawnInterval: 0.7,  perSpawnMin: 3, perSpawnMax: 4, enemyHpMul: 1.7,  enemySpeedMul: 1.18, brutePct: 0.25, killGoal: 12 },
  { spawnInterval: 0.7,  perSpawnMin: 3, perSpawnMax: 4, enemyHpMul: 1.7,  enemySpeedMul: 1.18, brutePct: 0.25, killGoal: 12 },
  // 11-15
  { spawnInterval: 0.6,  perSpawnMin: 3, perSpawnMax: 4, enemyHpMul: 2.2, enemySpeedMul: 1.3,  brutePct: 0.30, killGoal: 16 },
  { spawnInterval: 0.6,  perSpawnMin: 3, perSpawnMax: 4, enemyHpMul: 2.2, enemySpeedMul: 1.3,  brutePct: 0.30, killGoal: 16 },
  { spawnInterval: 0.6,  perSpawnMin: 3, perSpawnMax: 4, enemyHpMul: 2.2, enemySpeedMul: 1.3,  brutePct: 0.30, killGoal: 16 },
  { spawnInterval: 0.6,  perSpawnMin: 3, perSpawnMax: 4, enemyHpMul: 2.2, enemySpeedMul: 1.3,  brutePct: 0.30, killGoal: 16 },
  { spawnInterval: 0.6,  perSpawnMin: 3, perSpawnMax: 4, enemyHpMul: 2.2, enemySpeedMul: 1.3,  brutePct: 0.30, killGoal: 16 },
  // 16-19
  { spawnInterval: 0.45, perSpawnMin: 3, perSpawnMax: 5, enemyHpMul: 2.9, enemySpeedMul: 1.45, brutePct: 0.35, killGoal: 20 },
  { spawnInterval: 0.45, perSpawnMin: 3, perSpawnMax: 5, enemyHpMul: 2.9, enemySpeedMul: 1.45, brutePct: 0.35, killGoal: 20 },
  { spawnInterval: 0.45, perSpawnMin: 3, perSpawnMax: 5, enemyHpMul: 2.9, enemySpeedMul: 1.45, brutePct: 0.35, killGoal: 20 },
  { spawnInterval: 0.45, perSpawnMin: 3, perSpawnMax: 5, enemyHpMul: 2.9, enemySpeedMul: 1.45, brutePct: 0.35, killGoal: 20 },
  // 20 — boss wave
  { spawnInterval: 0.85, perSpawnMin: 1, perSpawnMax: 2, enemyHpMul: 4.0, enemySpeedMul: 1.0,  brutePct: 0.0, killGoal: 9999, isBossWave: true },
];

// Base enemy stats (multiplied by wave's enemyHpMul / enemySpeedMul on spawn).
export const ENEMY_BASE = {
  minion: { hp: 180, vy: 14 },
  brute: { hp: 600, vy: 8 },
};

// Boss multipliers applied on top of wave 20's enemyHpMul.
export const BOSS_MUL = {
  hpMul: 8,
  speedMul: 0.5,
  scale: 2.5,
};
