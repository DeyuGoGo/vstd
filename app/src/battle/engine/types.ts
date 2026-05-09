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
}

export interface Pop {
  id: number;
  x: number;
  y: number;
  t: number;
  amount: number | string;
  crit: boolean;
}

export interface Skill {
  id: 'starlight' | 'orbit' | 'rain';
  name: string;
  lv: number;
  cd: number;
  cdMax: number;
  bg: string;
}

export interface Mods {
  projSpeedMul: number;
  fireCdMul: number;
  projPerCast: number;
  critBonus: number;
  hpMaxBonus: number;
  goldGainMul: number;
  killGoalMul: number;
}

export const initialMods = (): Mods => ({
  projSpeedMul: 1,
  fireCdMul: 1,
  projPerCast: 1,
  critBonus: 0,
  hpMaxBonus: 0,
  goldGainMul: 1,
  killGoalMul: 1,
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
