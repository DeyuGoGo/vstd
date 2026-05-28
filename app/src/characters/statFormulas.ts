import type { CharacterBaseStats, Stats } from './types';

export const XP_PER_EXP_ITEM = 50;
export const STAT_POINTS_PER_LEVEL = 3;
export const LEVEL_CAP = 50;

export function xpMax(level: number): number {
  return level * 100;
}

export interface EffectiveBattleStats {
  hpMax: number;
  fireCdMul: number;        // Battle.tsx 內部用：fire interval = fireCdBase × fireCdMul
  aspd: number;             // UI 顯示用：仿 RO 整數分（200 - interval × 100），interval 秒
  projSpeed: number;
  projSpeedCap: number;
  critBase: number;
  attackRange: number;
  dmgMin: number;
  dmgMax: number;
}

// ─── 仿 RO 攻速曲線 ────────────────────────────────────────────────
// aspdScore = AGI + DEX × 0.3            （AGI 主、DEX 副，符合 RO ASPD 邏輯）
// fireCdMul = max(0.4, 1 / (1 + score × 0.015 + score² × 0.0001))
//
// 邊際遞增：前期每點 AGI 微感、中後期平方項生效；接近 cap 收斂。
// 採樣：agi 0=1.0、agi 10=0.86、agi 30=0.65、agi 50=0.50、agi 87→cap 0.4
function aspdMultiplier(stats: Stats): number {
  const score = stats.agi + stats.dex * 0.3;
  const raw = 1 / (1 + score * 0.015 + score * score * 0.0001);
  return Math.max(0.4, raw);
}

// ─── 仿 RO StrATK 平方項 ──────────────────────────────────────────
// strAtk = STR + floor((STR/10)²)
// 每 10 點 STR 額外送 1²、2²、3²… 邊際遞增。
// 採樣：str 10=+11、str 30=+39、str 50=+75、str 87=+162
function statDamageBonus(stats: Stats): number {
  const strAtk = stats.str + Math.floor((stats.str / 10) ** 2);
  const intAtk = stats.int * 2;                    // 法傷保持線性 2x（caster 軸）
  const dexAtk = Math.floor(stats.dex * 0.5);      // DEX 副傷害（主貢獻在攻速 + projSpeed）
  return strAtk + intAtk + dexAtk;
}

export function computeEffectiveBattleStats(
  base: CharacterBaseStats,
  stats: Stats
): EffectiveBattleStats {
  const fireCdMul = aspdMultiplier(stats);
  // ASPD（RO 風整數）：interval 秒 = fireCdBase × fireCdMul，ASPD = 200 - interval × 100
  // 採樣：starina agi 0 → 158、agi 87 cap → 183；swordsman agi 0 → 145、agi 87 cap → 178
  const interval = base.fireCdBase * fireCdMul;
  const aspd = Math.round(200 - interval * 100);
  const dmgBonus = statDamageBonus(stats);

  return {
    hpMax: base.hpBase + stats.vit * 30,
    fireCdMul,
    aspd,
    projSpeed: base.projSpeedBase + stats.dex * 4,
    projSpeedCap: base.projSpeedCap,
    critBase: base.critBase + stats.luk * 0.003,
    attackRange: base.attackRange,
    dmgMin: base.dmgMinBase + dmgBonus,
    dmgMax: base.dmgMaxBase + dmgBonus,
  };
}
