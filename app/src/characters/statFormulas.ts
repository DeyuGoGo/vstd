import type { CharacterBaseStats, Stats } from './types';

export const XP_PER_EXP_ITEM = 50;
export const STAT_POINTS_PER_LEVEL = 3;
export const LEVEL_CAP = 50;

export function xpMax(level: number): number {
  return level * 100;
}

export interface EffectiveBattleStats {
  hpMax: number;
  fireCdMul: number;
  projSpeed: number;
  projSpeedCap: number;
  critBase: number;
  attackRange: number;
  dmgMin: number;
  dmgMax: number;
}

export function computeEffectiveBattleStats(
  base: CharacterBaseStats,
  stats: Stats
): EffectiveBattleStats {
  return {
    hpMax: base.hpBase + stats.vit * 30,
    fireCdMul: Math.max(0.5, 1 - stats.agi * 0.005),
    projSpeed: base.projSpeedBase + stats.dex * 4,
    projSpeedCap: base.projSpeedCap,
    critBase: base.critBase + stats.luk * 0.003,
    attackRange: base.attackRange,
    dmgMin: base.dmgMinBase + stats.int * 2 + stats.str + stats.dex,
    dmgMax: base.dmgMaxBase + stats.int * 2 + stats.str + stats.dex,
  };
}
