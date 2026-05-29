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
  pAtk: number;             // 物理攻擊力 score：STR + DEX + LUK 軌（含平方項）
  mAtk: number;             // 魔法攻擊力 score：INT 軌（含平方項）
  defReduction: number;     // 物理減傷 0~0.5，被怪物撞擊時 actualDmg = rawDmg × (1 - defReduction)
  hpRegenPerSec: number;    // 防線 HP regen：teamHp 每秒回復量（VIT 來源，多人防線疊加）
  projSpeed: number;
  projSpeedCap: number;
  critBase: number;
  attackRange: number;
  dmgMin: number;
  dmgMax: number;
}

// ─── 四大職業 stat 軌（將來實作職業時對齊用）────────────────────────
// 弓箭手（遠程普攻）：DEX 主、LUK 副，吃 pAtk
// 劍士（近戰技能） ：STR 主、VIT 副，吃 pAtk
// 法師（遠程技能） ：INT 主、DEX 副，吃 mAtk
// 刺客（攻速 + 爆擊普攻）：AGI + STR + LUK 分散，主要吃 pAtk + 高 ASPD + 高 crit
//
// 共通公式（不依職業）：所有角色都依此公式計算 pAtk / mAtk。
// 推主屬性回報邊際遞增（平方項生效），對應 RO 的「練主屬性才划算」直覺。

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

// ─── 物理攻擊 pAtk（仿 RO StatATK）────────────────────────────────
// strBonus = STR + floor((STR/10)²)       — 劍士 / 刺客主軸
// dexBonus = DEX + floor((DEX/10)²)       — 弓箭手主軸
// luckBonus = floor(LUK × 0.5)            — 副屬性（刺客 / 弓箭手都需要）
//
// 採樣（87 點全押主）：strBonus 87 = 162、dexBonus 87 = 162、luckBonus 87 = 43
function physicalAtk(stats: Stats): number {
  const strBonus = stats.str + Math.floor((stats.str / 10) ** 2);
  const dexBonus = stats.dex + Math.floor((stats.dex / 10) ** 2);
  const luckBonus = Math.floor(stats.luk * 0.5);
  return strBonus + dexBonus + luckBonus;
}

// ─── 魔法攻擊 mAtk（仿 RO MAtk）───────────────────────────────────
// intBonus = INT × 2 + floor((INT/10)²)
// 法師獨吃此軌（base 2x 線性 + 平方項）。其他職業堆 INT 也有少量 mAtk 但不划算。
//
// 採樣：INT 0=0、10=21、30=69、50=125、87=249
function magicalAtk(stats: Stats): number {
  return stats.int * 2 + Math.floor((stats.int / 10) ** 2);
}

// ─── 物理減傷 defReduction（仿 RO VIT DEF）────────────────────────
// reduction = min(0.5, VIT × 0.005 + (VIT/30)² × 0.05)
// 線性 + 平方項組合，cap 50%。VIT 雙效：既加 HP 又減傷，TD 場景核心 tank 軌。
//
// 採樣：VIT 0=0%、10=5.6%、30=20%、50=39%、87=50%（cap）
function physicalDefense(stats: Stats): number {
  const linear = stats.vit * 0.005;
  const quad = (stats.vit / 30) ** 2 * 0.05;
  return Math.min(0.5, linear + quad);
}

// ─── HP regen（仿 RO VIT 自然回復）────────────────────────────────
// regenPerSec = VIT × 0.3 + (VIT/20)²
// 線性 + 平方項。每秒回 teamHp，多人防線疊加。
//
// 採樣：VIT 0=0、10=3.3、30=11.3、50=21.3、87=45.0
// vs 怪物 DPS：VIT 87 cap 45 HP/s 大約能 cover 7 minions 在線（6 HP/s each after 50% def）。
function hpRegen(stats: Stats): number {
  const linear = stats.vit * 0.3;
  const quad = (stats.vit / 20) ** 2;
  return linear + quad;
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

  const pAtk = physicalAtk(stats);
  const mAtk = magicalAtk(stats);
  const defReduction = physicalDefense(stats);
  const hpRegenPerSec = hpRegen(stats);
  // dmg 只吃對應攻擊類型的軸：物理職吃 pAtk、法師吃 mAtk。
  // 兩個 score 仍照常計算（CharacterDetail 顯示 + 未來混合傷害保留）。
  const dmgBonus = base.atkType === 'magical' ? mAtk : pAtk;

  return {
    hpMax: base.hpBase + stats.vit * 30,
    fireCdMul,
    aspd,
    pAtk,
    mAtk,
    defReduction,
    hpRegenPerSec,
    projSpeed: base.projSpeedBase + stats.dex * 4,
    projSpeedCap: base.projSpeedCap,
    critBase: base.critBase + stats.luk * 0.003,
    attackRange: base.attackRange,
    dmgMin: base.dmgMinBase + dmgBonus,
    dmgMax: base.dmgMaxBase + dmgBonus,
  };
}
