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
  // TD 防線機制：怪物穿越攻擊線後 attacking=true，停止移動，每 attackInterval 秒對 teamHp 扣血。
  attacking: boolean;
  attackT: number;
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
  straight?: boolean; // true = no homing; collides with any enemy in flight path
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
  // 物理減傷 0~0.5（cap），怪物撞擊扣血時 actualDmg = rawDmg × (1 - defReduction)。
  // 來源：VIT 公式（statFormulas.physicalDefense）。將來裝備 / buff 可疊加。
  defReduction: number;
  // 防線 HP regen，每秒貢獻給 teamHp 的回血量。多人 lineup 疊加。
  // 來源：VIT 公式（statFormulas.hpRegen）。將來裝備 / buff 可疊加。
  hpRegenPerSec: number;
  // Forward Y-distance the hero will engage enemies within. Belongs to the
  // character/skill, not a global rule — different heroes/abilities will set
  // this differently (close-range AoE vs long-range freeze).
  attackRange: number;
}

export interface InitialModsSeed {
  attackRange: number;
  fireCdMul: number;
  critBase: number;
  projSpeed: number;
  defReduction: number;
  hpRegenPerSec: number;
}

export const initialMods = (seed: InitialModsSeed): Mods => ({
  projSpeedMul: 1,
  fireCdMul: seed.fireCdMul,
  projPerCast: 1,
  projPierce: 0,
  critBonus: seed.critBase,
  hpMaxBonus: 0,
  goldGainMul: 1,
  defReduction: seed.defReduction,
  hpRegenPerSec: seed.hpRegenPerSec,
  attackRange: seed.attackRange,
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
