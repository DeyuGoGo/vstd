// Battle scene z-index layers. Keep all stage-level zIndex values here so the
// stacking order stays easy to reason about. Local sub-element ordering inside
// a single component (e.g. Hero's body parts) is not centralized.
//
//   0 ─────────── background image, vignette
//  10 ─────────── HERO            (intentionally below projectiles/pops)
//  20 ─────────── PROJECTILE
//  40 ─────────── DMG_POP
// 100~900 ────── ENEMY            (dynamic, depth-sorted by Y)
// 1000 ────────── HUD             (TopBar, BottomBar)
// 1500 ────────── OVERLAY         (Pause / LevelUp / GameOver / Victory)
export const Z = {
  HERO: 10,
  PROJECTILE: 20,
  DMG_POP: 40,
  ENEMY_MAX: 900, // clamp for dynamic enemy zIndex
  HUD: 1000,
  OVERLAY: 1500,
} as const;
