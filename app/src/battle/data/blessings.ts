import type { Mods } from '../engine/types';

export type BlessingId =
  | 'arcane'
  | 'mana'
  | 'pierce'
  | 'haste'
  | 'crit'
  | 'crystal'
  | 'echo'
  | 'gold'
  | 'aura';

export type BlessingGlyphKind =
  | 'star8'
  | 'orb'
  | 'arrows'
  | 'hourglass'
  | 'eye'
  | 'heart'
  | 'echo'
  | 'coin'
  | 'aura';

export interface BlessingCtx {
  healHp: (amount: number) => void;
}

export interface Blessing {
  id: BlessingId;
  name: string;
  desc: string;
  desc2: string;
  val: string;
  glyph: BlessingGlyphKind;
  tint: string;
  active: boolean;
  apply: (mods: Mods, ctx: BlessingCtx) => void;
}

const noop = () => {};

export const BLESSINGS: Blessing[] = [
  {
    id: 'arcane', name: '奧能碎片',
    desc: '投射物速度提升 ', desc2: '',
    val: '20%', glyph: 'star8', tint: '#9ec5ff',
    active: true,
    apply: (m) => { m.projSpeedMul *= 1.2; },
  },
  {
    id: 'mana', name: '魔力寶珠',
    desc: '本波擊殺需求 ', desc2: '',
    val: '-10%', glyph: 'orb', tint: '#c8a4ff',
    active: true,
    apply: (m) => { m.killGoalMul *= 0.9; },
  },
  {
    id: 'haste', name: '星墜疾速',
    desc: '攻擊冷卻縮短 ', desc2: '',
    val: '12%', glyph: 'hourglass', tint: '#a4ffe0',
    active: true,
    apply: (m) => { m.fireCdMul *= 0.88; },
  },
  {
    id: 'crit', name: '致命之眼',
    desc: '暴擊率提升 ', desc2: '',
    val: '8%', glyph: 'eye', tint: '#ffd17a',
    active: true,
    apply: (m) => { m.critBonus += 0.08; },
  },
  {
    id: 'crystal', name: '水晶之心',
    desc: '最大生命提升 ', desc2: '',
    val: '500', glyph: 'heart', tint: '#ff9aae',
    active: true,
    apply: (m, ctx) => {
      m.hpMaxBonus += 500;
      ctx.healHp(500);
    },
  },
  {
    id: 'echo', name: '星辰回響',
    desc: '每次攻擊額外發射 ', desc2: ' 顆',
    val: '+1', glyph: 'echo', tint: '#9ec5ff',
    active: true,
    apply: (m) => { m.projPerCast += 1; },
  },
  {
    id: 'gold', name: '貪婪之月',
    desc: '金幣獲取提升 ', desc2: '',
    val: '25%', glyph: 'coin', tint: '#f5c95c',
    active: true,
    apply: (m) => { m.goldGainMul *= 1.25; },
  },
  // Placeholders, not in the active draw pool.
  {
    id: 'pierce', name: '穿刺彈',
    desc: '投射物穿透 ', desc2: ' 個敵人',
    val: '+1', glyph: 'arrows', tint: '#d6a4ff',
    active: false, apply: noop,
  },
  {
    id: 'aura', name: '虛空光環',
    desc: '範圍內持續傷害 ', desc2: '',
    val: 'NEW', glyph: 'aura', tint: '#c8a4ff',
    active: false, apply: noop,
  },
];

export const ACTIVE_BLESSINGS = BLESSINGS.filter((b) => b.active);
