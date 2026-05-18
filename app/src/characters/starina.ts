import type { CharacterBaseConfig } from './types';

export const starina: CharacterBaseConfig = {
  id: 'starina',
  displayName: '星奈',
  playerNameDefault: '星奈的指揮官',
  baseStats: {
    hpBase: 3200,
    attackRange: 515,
    fireCdBase: 0.42,
    projSpeedBase: 380,
    projSpeedCap: 460,
    critBase: 0.18,
    dmgMinBase: 60,
    dmgMaxBase: 100,
  },
  startingStats: {
    str: 1,
    agi: 2,
    vit: 2,
    dex: 1,
    luk: 1,
    int: 3,
  },
  assets: {
    battleBaseIdle: 'img/starina/base_idle.png',
    battleBaseAttack: 'img/starina/base_attack.png',
    battleWeapon: 'img/starina/weapon_stardust_staff.png',
    battleHeadgear: 'img/starina/headgear_star_crown.png',
    battleHandCover: 'img/starina/hand_cover.png',
    lobbyAvatar: 'img/starina/avatar.png',
    lobbyVideo: 'video/lobby-idle.mp4',
    layout: {
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
