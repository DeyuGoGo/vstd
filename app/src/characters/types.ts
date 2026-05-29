export type StatKey = 'str' | 'agi' | 'vit' | 'dex' | 'luk' | 'int';

export interface Stats {
  str: number;
  agi: number;
  vit: number;
  dex: number;
  luk: number;
  int: number;
}

export type XY = readonly [number, number];
export type XYW = readonly [number, number, number]; // x, y, width

export interface CharacterSpriteLayout {
  idle: { base: XY; weapon: XYW; headgear: XY; hand: XY };
  attack: { base: XY; weapon: XYW; headgear: XY; hand: XY };
}

export interface CharacterAssets {
  battleBaseIdle: string;
  battleBaseAttack: string;
  battleWeapon: string;
  battleHeadgear: string;
  battleHandCover: string;
  layout: CharacterSpriteLayout;
  lobbyAvatar: string;
  lobbyVideo: string;
}

// 攻擊類型決定傷害吃哪條攻擊力軸：
//   physical → pAtk（STR/DEX/LUK 軸）；magical → mAtk（INT 軸）
// 物理職點 INT、法師點 STR 都不會增加傷害。
export type AttackType = 'physical' | 'magical';

export interface CharacterBaseStats {
  hpBase: number;
  attackRange: number;
  fireCdBase: number;
  projSpeedBase: number;
  projSpeedCap: number;
  critBase: number;
  dmgMinBase: number;
  dmgMaxBase: number;
  atkType: AttackType;
}

export interface CharacterBaseConfig {
  id: string;
  displayName: string;
  playerNameDefault: string;
  baseStats: CharacterBaseStats;
  startingStats: Stats;
  assets: CharacterAssets;
}

export interface CharacterProgress {
  level: number;
  xp: number;
  unspentPoints: number;
  stats: Stats;
}
