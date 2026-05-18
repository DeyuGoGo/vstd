import type { CharacterBaseConfig } from './types';

// 劍士 — 基礎職（Lv 10 可一轉火劍士 / 冰盾戰，二轉待定）
// 數值定位：近戰、攻擊範圍短、攻速慢、單擊高傷、HP 偏厚
// 主屬性：STR + VIT；副 DEX
//
// ⚠️ 素材尚未到位 — 此檔已寫好數值，但 index.ts 暫不掛載。
// 素材清單見 /img_order/swordsman.md，到齊後在 index.ts 解除註解。
export const swordsman: CharacterBaseConfig = {
  id: 'swordsman',
  displayName: '劍士',
  playerNameDefault: '劍士的指揮官',
  baseStats: {
    hpBase: 3800,         // 比星奈 (3200) 厚
    attackRange: 180,     // 近戰，比星奈 (515) 短很多
    fireCdBase: 0.55,     // 揮劍重，比星奈 (0.42) 慢
    projSpeedBase: 480,   // 飛得快（劍氣近距離快速衝擊）
    projSpeedCap: 600,
    critBase: 0.15,       // 比星奈 (0.18) 略低
    dmgMinBase: 90,       // 單擊高傷
    dmgMaxBase: 140,
  },
  startingStats: {
    str: 3,   // 主屬性
    agi: 1,
    vit: 3,   // 副屬性 — 肉
    dex: 2,   // 普攻命中加成
    luk: 1,
    int: 1,
  },
  assets: {
    battleBaseIdle: 'img/swordsman/base_idle.png',
    battleBaseAttack: 'img/swordsman/base_attack.png',
    battleWeapon: 'img/swordsman/weapon_blade.png',
    battleHeadgear: 'img/swordsman/headgear_circlet.png',
    battleHandCover: 'img/swordsman/hand_cover.png',
    lobbyAvatar: 'img/swordsman/avatar.png',
    lobbyVideo: 'video/swordsman-idle.mp4',
    layout: {
      // 暫沿用星奈的座標 — 素材到位後實機微調
      idle: {
        base: [24, 15],
        weapon: [30, 11, 57],
        headgear: [40, 8],
        hand: [46, 58],
      },
      attack: {
        base: [26, 14],
        weapon: [38, 6, 61],
        headgear: [43, 7],
        hand: [53, 52],
      },
    },
  },
};
