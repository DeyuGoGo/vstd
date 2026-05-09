# Handoff: VS-TD Battle MVP (Vertical Tower Defense + Level-Up Blessings)

## Overview
A portrait-orientation, mobile-first action / tower-defense battle screen ("VStarTD") featuring a single hero who auto-attacks waves of incoming enemies. On level-up, the run is interrupted by a Vampire-Survivors-style blessing-card pick. This bundle is the design MVP for the core battle loop and the level-up modal.

## About the Design Files
The files in this bundle are **design references built as an interactive HTML/React prototype** (rendered with Babel-standalone in the browser). They are not production code to ship as-is. The task is to **recreate these designs in the target codebase's existing environment** — most likely a real React + bundler setup, or a game engine (Unity / Cocos / Godot / PixiJS) for the actual battle layer — using established patterns, asset pipelines, and state management of that codebase. If no environment exists yet, pick what best fits the team (we suggest Unity 2D or PixiJS + React HUD for the production version).

## Fidelity
**High-fidelity** for layout, typography, color, spacing, HUD chrome, and the level-up modal. Hex codes, sizes, and animation timings below should be reproduced pixel-perfectly. The combat itself (enemy AI, projectile homing, balance numbers) is illustrative — replace with the team's gameplay design.

---

## Screens / Views

### 1. Battle HUD (in-game, portrait 402 × 874)

**Purpose:** Active combat. Hero auto-attacks; player watches stats, may tap skill icons.

**Layout (top → bottom):**
- Status / safe area: 60 px (iOS notch).
- Top bar (z 30): pause button (left) · boss HP bar (flex center) · gold pill (right). Padding 0 14, items gap 10, top 12.
- Wave card (absolute top 64, left 14): WAVE 12/20 · skull · kill count.
- Battle field: full-bleed background image (`assets/arena-bg.png`), with a radial vignette overlay.
- Hero sprite (`assets/hero.png`, 150 px wide), absolutely positioned at (GAME_W/2, GAME_H − 245). HP bar floats 84 px above hero.
- Enemies: free-floating, z = floor(y) for depth sort; descend from top toward hero.
- Projectiles: 32 px star sprites, drop-shadow glow.
- Bottom bar (z 30, bottom 0):
  - Lv badge (52 × 52 round, gold-rim) overlapping EXP bar (chevron-right shape, height 22).
  - Skill row: 3 × 64 × 64 rounded squares, gap 18, each with a "Lv.N" tab below.

**Components & exact tokens:**
- Pause button: 42 × 42, radius 12, bg `rgba(12,6,22,0.78)`, stroke `rgba(180,140,255,0.35)`, backdrop-blur 6 px.
- Boss HP bar: height 18, radius 999, bg `rgba(0,0,0,0.55)`, stroke `rgba(180,140,255,0.35)`. Fill: `linear-gradient(180deg,#ff5b78,#c81f3d)`. Centered skull medallion 26 × 26, stroke `#e23b5a`, glow `rgba(226,59,90,0.6)`.
- Gold pill: height 36, padding 0 12 0 8, radius 999, gold text `#f5c95c`, font Sora 700 15.
- Wave card: padding 8 14 9, radius 12, font Sora 700 11 letter-spacing 1.4. "WAVE" tag uses `#b388ff` for number, white "/20".
- Hero HP bar: 96 × 12, radius 6; fill `linear-gradient(180deg,#7df09a,#2fb255)`; numeric label Sora 800 10 white with shadow.
- EXP banner: clip-path arrow `polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)`, fill `linear-gradient(180deg,#7aa6ff,#2a55c8)`. Text "EXP {n}%" Sora 700 11, letter-spacing 1.5.
- Skill icon: 64 × 64, radius 14, border `rgba(180,140,255,0.35)` (white when active), shadow `0 4px 10px rgba(0,0,0,0.5)`. On cooldown: black 65 % overlay + Sora 800 22 countdown. "Lv.N" tab is a 22 px chip protruding −12 below.

**Typography:** Single family `Sora` (Google Fonts) at 400/500/600/700/800.

### 2. Level Up Modal (overlay)

**Purpose:** Whenever EXP fills, the run pauses and the player picks 1 of 3 random "blessings" (Vampire Survivors style).

**Layout:**
- Full-screen scrim: `rgba(5,2,12,0.55)` + backdrop-blur 3 px.
- Title block (vertically centered, then offset upward by cards):
  - "LEVEL UP!" — Sora 800 36, letter-spacing 4, color `#fff`, glow `0 0 14px #ffd17a, 0 0 28px #f5c95caa, 0 0 4px #fff`.
  - Subtitle "Select a blessing" — Sora 500 14, color `#f5c95c`, letter-spacing 2.
  - Tiny Lv label above title: "LV.{n−1} → LV.{n}" Sora 700 11, color `#d4af6a`, letter-spacing 2.
- Three cards: 108 px wide, padding 18 10 16, radius 14, gap 10, bg `linear-gradient(180deg, rgba(38,22,72,0.92), rgba(14,6,28,0.95))`.
- Reroll pill below: padding 7 16 7 12, radius 999, gold border `rgba(212,175,106,0.55)`, contains dice icon · "Reroll (N)" · coin icon. Disabled (opacity 0.45) when N = 0.

**Card anatomy (per card):**
1. Four 10 × 10 gold L-bracket corner accents (`#d4af6a`, 1.5 px stroke).
2. Top-edge gem: 12 × 12 rotated 45°, fill = card tint, gold border, glow.
3. Title: Sora 700 11, letter-spacing 1.2, color `#fff`, glow uses card tint at 40 % alpha.
4. Glyph (90 px tall): unique SVG per blessing (see Pool below).
5. Description: Sora 500 10, color `#e6dcf2`, value highlight in `#7df09a` Sora 800. Min-height 44 px.
6. Hover/focus: `translateY(-6px) scale(1.03)` + glow `0 0 24px {tint}88`. Transition 0.2 s.

**Animations:**
- Scrim fade-in 0.25 s.
- Title pop: scale 0.6 → 1.08 → 1, 0.5 s, `cubic-bezier(.2,1.4,.4,1)`.
- Cards: stagger entry 0.1 s + 0.08 s × index, `translateY(40px) scale(0.9)` → identity, `cubic-bezier(.2,1.2,.4,1)`.

### 3. Pause Overlay
Tap anywhere to resume. `rgba(5,2,12,0.78)` + blur 6, centered "PAUSED" Sora 800 28 letter-spacing 4, sub-line "TAP TO RESUME" Sora 500 12 in `rgba(244,236,255,0.62)` letter-spacing 2.

---

## Interactions & Behavior

### Combat loop
- `requestAnimationFrame` driven, dt-clamped to 0.05 s.
- **Spawn:** every 1.6 s spawn 2–3 enemies (18 % brutes, 82 % minions) until total ≥ 30. Spawn x = 60 + rand × (W−120), y = −30…−70.
- **Enemy speed:** minion vy = 8–10 px/s logical, brute vy = 5.
- **Hero auto-attack:** every 0.42 s pick the 1–2 most-advanced enemies and fire a homing star.
- **Projectile:** initial speed 380 px/s, accel toward target 200 px/s², capped 460. Hits when within 18 px. Damage 60–100 (× 2.2 on 18 % crit).
- **Enemy death:** scale & fade 0.25 s. Awards gold (minion 6, brute 25), kills +1, EXP (minion 2, brute 8).
- **Hero damage:** enemy reaches y > heroY − 60 → hero loses 12 (minion) / 40 (brute), enemy despawns.

### Skills (manual)
| ID | Name | CD | Effect |
|---|---|---|---|
| starlight | Starlight Burst | 4 s | 6 sequential homing stars (180–240 dmg) |
| orbit     | Astral Orbit    | 6 s | Damages all on-screen enemies (120–170 dmg) |
| rain      | Arrow Rain      | 8 s | 16 area pulses, radius 60, 80–130 dmg each |

Tap-to-cast; while on CD show black overlay + countdown. Casting briefly scales the icon 1.08 with white border for 350 ms.

### Level-up flow
- When EXP reaches 100, level += 1, EXP carries remainder, modal opens with 3 cards pulled from `BLESSING_POOL` via Fisher-Yates pick.
- Game loop checks `!paused && !levelUp` to halt sim.
- **Picking** a card closes the modal (currently logs id; upgrade engine should apply effect — see Pool below).
- **Reroll** consumes 1 of 2 starting charges; replaces with a fresh `pickThree()` shuffle. Disabled at 0.

### Wave logic
Demo bumps wave when running kill counter exceeds threshold. Production: drive from a wave script with timed spawns and boss waves.

---

## State Management

- **Hero state:** hp / hpMax (3200), level, exp (0–99).
- **Run state:** wave (1–20), kills, gold, paused, levelUp ({choices, level} | null), rerolls (start 2), pickedLog (string[]).
- **Entities (refs, not React state, to keep rAF cheap):**
  - enemies: `{id, kind, x, y, vy, hp, hpMax, hitT, dyingT}`
  - projectiles: `{id, x, y, vx, vy, rot, life, target, dmg, crit}`
  - pops: floating numbers `{id, x, y, t, amount, crit}`
  - skills: `{id, name, lv, cd, cdMax, …}`

Mirror to React via a lightweight `force` state bumped each frame. In production, use a proper ECS (or game-engine entity loop) and only push HUD numbers into React state.

---

## Design Tokens

```ts
// Color
const C = {
  bg:           '#07030f', // page
  panel:        'rgba(12,6,22,0.78)',
  panelStroke:  'rgba(180,140,255,0.35)',
  ink:          '#f4ecff',
  inkDim:       'rgba(244,236,255,0.62)',
  red:          '#e23b5a',
  green:        '#5cd87a',
  blue:         '#3a7af0',
  gold:         '#f5c95c',
  goldEdge:     '#d4af6a',
  purple:       '#b388ff',
  purpleDeep:   '#7c4dff',
  hpFill:       'linear-gradient(180deg,#7df09a,#2fb255)',
  bossFill:     'linear-gradient(180deg,#ff5b78,#c81f3d)',
  expFill:      'linear-gradient(180deg,#7aa6ff,#2a55c8)',
  cardBg:       'linear-gradient(180deg,rgba(38,22,72,0.92),rgba(14,6,28,0.95))',
};

// Spacing — multiples of 2
// 4, 6, 8, 10, 12, 14, 18, 22, 26 used throughout.

// Radius
// 6 (hp bar), 12 (panel/pause), 14 (skill / card), 999 (pill), 50% (badge).

// Type — Sora only
// 800 36/1 LS 4   — modal title
// 800 22/1        — CD countdown
// 700 15/1        — gold count
// 700 13/1 LS 0.6 — reroll
// 700 11/1 LS 1.2-2 — labels (WAVE / LV / EXP / SKILL.LV)
// 500 14/1 LS 2   — modal subtitle
// 500 12/1 LS 2   — pause subtitle
// 500 10/1.35     — card body
// 800 10/1        — hp number

// Shadows
// panel:  0 4px 12px rgba(0,0,0,0.4)
// card:   0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)
// glow:   0 0 24px <tint>88
```

---

## Blessing Pool (`BLESSING_POOL`)

| id | Name | Tint | Glyph | Effect (apply on pick) |
|---|---|---|---|---|
| arcane  | ARCANE SHARD     | #9ec5ff | star8     | projectile speed +20 % |
| mana    | MANA ORB         | #c8a4ff | orb       | EXP gain +15 % |
| pierce  | PIERCING BOLTS   | #d6a4ff | arrows    | +1 pierce |
| haste   | STARFALL HASTE   | #a4ffe0 | hourglass | attack CD −12 % |
| crit    | CRITICAL EYE     | #ffd17a | eye       | crit chance +8 % |
| crystal | CRYSTAL HEART    | #ff9aae | heart     | max HP +500 |
| echo    | ECHO BOLT        | #9ec5ff | echo      | +1 projectile per cast |
| gold    | GREEDY MOON      | #f5c95c | coin      | gold gain +25 % |
| aura    | VOID AURA        | #c8a4ff | aura      | unlocks proximity damage aura (NEW) |

Each glyph is a hand-rolled SVG in `levelup-glyphs.jsx`; recreate in the target stack as inline SVG components keyed off `kind`.

---

## Assets
- `assets/hero.png` — silver-haired chibi mage, back-view, transparent PNG. Provided by design.
- `assets/arena-bg.png` — top-down purple stone corridor with crystal columns. Provided by design.
- All other visuals (HUD chrome, enemies, projectiles, glyphs) are SVG drawn inline. Enemy art is a stylized placeholder — replace with real chibi-armor sprite sheets when art lands.

---

## Files in this bundle

- `index.html` — boots React 18 + Babel-standalone and loads scripts in order: `ios-frame.jsx`, `levelup-glyphs.jsx`, `levelup-overlay.jsx`, `game.jsx`. Imports Sora from Google Fonts.
- `game.jsx` — main `VStarTD` component (HUD, sim loop, skill cast, hero/enemies/projectiles, popups). Wraps the screen in an `IOSDevice` frame for presentation.
- `levelup-overlay.jsx` — `LevelUpOverlay` and `BlessingCard` components.
- `levelup-glyphs.jsx` — SVG glyph factory + `BLESSING_POOL` data + `pickThree()` shuffle helper.
- `ios-frame.jsx` — iOS device frame (status bar, dynamic island, home indicator). Pure presentation; not part of the game itself.
- `assets/hero.png`, `assets/arena-bg.png` — provided art.

## Implementation notes for production

1. Move the simulation off React state. Use a game engine or canvas/WebGL loop; React should own only the HUD chrome + level-up modal.
2. Treat blessing definitions as data so designers can iterate without code changes.
3. The level-up modal hard-pauses the loop. If gameplay needs the world to keep moving (e.g. for visual polish), only freeze the spawner & player input.
4. Replace illustrative numbers (HP, dmg, drop rates, CDs) with values from the gameplay design doc.
5. The art for enemies is placeholder SVG; swap for sprite sheets driven by an animation system.
