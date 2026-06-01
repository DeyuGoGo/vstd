// Battle scene z-index layers. Keep all stage-level zIndex values here so the
// stacking order stays easy to reason about. Local sub-element ordering inside
// a single component (e.g. Hero's body parts) is not centralized.
//
//   0 ─────────── background image, vignette
//   5 ─────────── WALL_BACK       (defense wall, behind everything in the arena)
//  20 ─────────── PROJECTILE
//  40 ─────────── DMG_POP
// 100~900 ────── ENEMY            (dynamic, depth-sorted by Y)
// 905 ─────────── WALL_FRONT      (occludes enemy feet piled at the wall)
// 910 ─────────── HERO            (wall's inner side — drawn above the front wall)
// 1000 ────────── HUD             (TopBar, BottomBar)
// 1500 ────────── OVERLAY         (Pause / LevelUp / GameOver / Victory)
export const Z = {
  WALL_BACK: 5,
  PROJECTILE: 20,
  DMG_POP: 40,
  ENEMY_MAX: 900, // clamp for dynamic enemy zIndex
  WALL_FRONT: 905,
  HERO: 910,
  HUD: 1000,
  OVERLAY: 1500,
} as const;
