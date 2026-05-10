export type EnemyKind = 'minion' | 'brute';

export interface Enemy {
  id: number;
  kind: EnemyKind;
  isBoss?: boolean;
  x: number;
  y: number;
  vy: number;
  hp: number;
  hpMax: number;
  hitT: number;
  dyingT: number;
}

export interface Projectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  life: number;
  target: number; // enemy id
  dmg: number;
  crit: boolean;
  pierce: number; // remaining pierces; 0 = stop on first hit
  hits: number[]; // enemy ids already hit (avoid re-hitting on retarget)
}

export interface Pop {
  id: number;
  x: number;
  y: number;
  t: number;
  amount: number | string;
  crit: boolean;
}

export interface Mods {
  projSpeedMul: number;
  fireCdMul: number;
  projPerCast: number;
  projPierce: number;
  critBonus: number;
  hpMaxBonus: number;
  goldGainMul: number;
  // Forward Y-distance the hero will engage enemies within. Belongs to the
  // character/skill, not a global rule — different heroes/abilities will set
  // this differently (close-range AoE vs long-range freeze).
  attackRange: number;
}

export const initialMods = (): Mods => ({
  projSpeedMul: 1,
  fireCdMul: 1,
  projPerCast: 1,
  projPierce: 0,
  critBonus: 0,
  hpMaxBonus: 0,
  goldGainMul: 1,
  attackRange: 515,
});

export interface BattleStateRef {
  enemies: Enemy[];
  projectiles: Projectile[];
  pops: Pop[];
  nextEnemyId: number;
  nextProjId: number;
  nextPopId: number;
  spawnT: number;
  fireT: number;
  lastTs: number;
  bossSpawned: boolean;
  bossId: number | null;
}

export const createInitialState = (): BattleStateRef => ({
  enemies: [],
  projectiles: [],
  pops: [],
  nextEnemyId: 1,
  nextProjId: 1,
  nextPopId: 1,
  spawnT: 0,
  fireT: 0,
  lastTs: 0,
  bossSpawned: false,
  bossId: null,
});

export type Outcome = 'running' | 'gameover' | 'victory';
