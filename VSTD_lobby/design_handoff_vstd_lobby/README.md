# Handoff: VSTD 大廳 (Game Lobby — V1)

## Overview
A high-fidelity portrait mobile game lobby screen ("主城") for VSTD. The UI overlays a dark gothic illustration (white-haired character on a moonlit balcony) and provides player status, resources, and navigation entry points to the major game systems (events, tasks, achievements, shop, storage, memory, ranking, and four bottom-nav destinations).

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype of the intended look, layout, and feel. They are **not** production code to ship as-is. The task is to **recreate these designs in the target codebase's existing environment** (e.g., Unity UGUI, Unreal UMG, React, SwiftUI, Jetpack Compose, etc.) using that codebase's established components, theming system, asset pipeline, and localization. If no environment exists yet, pick the most appropriate framework for the project and implement there.

The HTML/CSS shown here uses inline SVG for icons and CSS for layout — translate these to the equivalent primitives in the target stack (e.g., 9-slice sprites for pill backgrounds, sprite atlases for icons, anchored RectTransforms for positioning).

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and component states are decided. Recreate pixel-perfectly within the target framework's idioms. The art (background image) is final reference art; replace with the actual game art asset of the same composition.

## Files
- `VSTD 大廳 V1.html` — runnable prototype (open in a browser)
- `lobby.jsx` — React component source for the lobby (icons + layout)
- `lobby.css` — all styles (positioning, colors, typography, states)
- `assets/bg-clean.png` — clean background art (1023×1537)
- `assets/bg-reference.png` — annotated reference (the original brief)

---

## Canvas / Aspect Ratio
- **Design canvas**: 640 × 960 px (2:3 portrait, mobile)
- Background art is set with `background-size: cover; background-position: center` — content should be authored to safely fit a 2:3 portrait window. For wider/taller devices, letterbox or extend the background; never crop UI.
- **Safe padding** from canvas edges: `22px` on left/right/top/bottom for major elements (`--pad-x`, `--pad-y`).

## Design Tokens

### Colors
| Token | Value | Usage |
|---|---|---|
| `--gold` | `#d4b07a` | Default icon stroke, borders, dividers |
| `--gold-bright` | `#f0d49a` | Active states, highlights, XP fill mid-stop |
| `--gold-dim` | `#a8865a` | Reserved for muted gold (currently unused on V1) |
| Text primary | `#f4ead8` (warm off-white) | Player name, menu zh labels, nav zh labels |
| Text secondary | `rgba(244,234,216,0.7–0.85)` | XP text, en labels |
| Pill ink | `linear-gradient(180deg, rgba(20,12,30,0.78) → rgba(8,4,16,0.85))` | Resource pill background |
| Notification pip | `#ff6b6b` with `0 0 6px rgba(255,107,107,0.8)` glow | Mail badge, nav red dot |
| XP bar fill | `linear-gradient(90deg, #f6c97a 0%, #ffe6a3 50%, #f6c97a 100%)` | Level progress |

### Typography
- **Stack**: `"Inter", "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif`
- **Player name (`星奈的指揮官`)**: 17px, weight 500, letter-spacing 0.02em, text-shadow `0 1px 2px rgba(0,0,0,0.7)`
- **Lv.48 label**: 11px, weight 600, letter-spacing 0.06em, color `--gold-bright`
- **XP text (5680 / 7200)**: 10px, `tabular-nums`, letter-spacing 0.04em, color `rgba(244,234,216,0.7)`
- **Resource value**: 13px, weight 500, `tabular-nums`, center-aligned within pill
- **Avatar level badge ("48")**: 10px, weight 600, letter-spacing 0.04em, color `--gold-bright`
- **Menu zh (e.g. `活動`)**: 18px, weight 500, letter-spacing **0.12em**
- **Menu en (e.g. `EVENT`)**: 9px, letter-spacing **0.22em**, color `rgba(212,176,122,0.85)`, 3px below zh
- **Side shortcut zh (`回憶`/`排行`)**: 13px, letter-spacing 0.1em
- **Side shortcut en**: 8px, letter-spacing 0.22em
- **Nav zh (`主城` etc.)**: 14px, letter-spacing 0.16em, color `rgba(244,234,216,0.85)`; active = `--gold-bright` + `text-shadow: 0 0 6px rgba(240,212,154,0.5)`
- **Nav en**: 8px, letter-spacing 0.24em, color `rgba(212,176,122,0.7)`; active = `--gold-bright`

### Spacing & Sizing
- Outer padding: 22px
- Top-bar avatar: 56×56, 1.5px gold border, inner image inset 4px
- Avatar level badge: bottom-right, `1px 6px` padding, 8px radius, 1px gold border
- Resource pill: `min-width: 110px`, padding `5px 8px`, gap 8px, fully rounded (`border-radius: 999px`)
- Pill `+` button: 20×20 circle, 1px gold border
- Util icon row (mail/friends/settings): 34×34 buttons, 14px gap, top offset 70px from top edge
- Left menu: vertical, 22px gap between items, vertical-centered (`top: 50%; transform: translateY(-50%)`)
- Left menu rail: 1px-wide vertical line at `left: 14px` with fade at top/bottom
- Menu-item diamond marker: 5×5 rotated square, 1px gold border, `#1a0f24` fill, sits 8px left of icon
- Side shortcuts (right): bottom: 145px, 18px gap, centered column
- Bottom nav: full-width, 12px top / 14px bottom padding, items in `space-around` with 8% horizontal padding
- Bottom-nav top divider: 1px gradient line `10%–90%`, with diamond endcaps (7×7 at each end)
- Active nav item: 5×5 gold diamond pip 8px above the icon

### Effects
- Drop shadow on icons: `drop-shadow(0 1px 2px rgba(0,0,0,0.6–0.7))`
- Pill: `box-shadow: 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,180,0.06)`
- XP fill glow: `box-shadow: 0 0 6px rgba(255, 200, 120, 0.6)`
- Vignette overlay (full canvas): radial fade to `rgba(0,0,0,0.55)` at corners + top/bottom darkening bands; pointer-events: none

---

## Screens / Views

### Single screen: 主城 Lobby

#### Purpose
Hub screen the player lands on. Shows identity (name/level/xp), wallet balances, primary action buttons (events/tasks/etc.), and bottom nav between the four major modes.

#### Layout (z-stacked, top-to-bottom in document order)
1. **Background** — full-bleed art (`assets/bg-clean.png`)
2. **Vignette** — radial + linear darkening overlay
3. **Player block** — top-left
4. **Resources** — top-right (3 pills)
5. **Util icons** — top-right under resources
6. **Left menu** — vertically centered, 5 items
7. **Side shortcuts** — right side, above bottom nav
8. **Bottom nav** — fixed bottom, 4 destinations

#### Component Specs

##### 1. Player Block (top-left)
- Position: `left: 22px; top: 22px;` flex row, gap 14px
- **Avatar (56×56)**:
  - Inner image circular, inset 4px
  - 1.5px solid gold (`#d4b07a`) ring
  - Inner shadow `inset 0 0 0 1px rgba(0,0,0,0.4)`, outer glow `0 0 8px rgba(212,176,122,0.35)`
  - **Level pill** (`48`) at bottom-right corner: dark purple gradient `#4a2c5e→#2a1638`, 1px gold border, 10px font
- **Player meta** (column, gap 4px):
  - Name `星奈的指揮官` (17px / 500)
  - XP row: `Lv.48` label · 130×5px XP bar (78.9% filled, gold gradient) · `5680 / 7200`

##### 2. Resources (top-right) — 3 pills, 10px gap
Each pill: `[icon] [value] [+]`, fully rounded, dark glass background, gold 1px border.

| Pill | Icon | Value |
|---|---|---|
| Stamina | Purple star (linear gradient `#e9a8ff → #7a3fb5`) | `24/120` |
| Gold | Coin with G monogram (radial gradient `#ffe7a6 → #a8723b`) | `328,450` |
| Gem | Purple gem (linear gradient `#c79bff → #5a25a0`) | `8,860` |

##### 3. Util Icons (mail / friends / settings)
- Position: `right: 22px; top: 70px;` flex row, gap 14px
- 34×34 transparent buttons with 22px thin-line gold SVG icons
- Mail icon has a `6×6` red pip at top-right (unread indicator)
- Hover: `transform: translateY(-1px)`

##### 4. Left Main Menu
- Position: `left: 22px; top: 50%; translateY(-50%)`, column, gap 22px
- Vertical rail (1px gold gradient) sits behind icons at `left: 14px`
- Each item: `[diamond marker] [28px gold icon] [zh / EN labels]`
- Items (top → bottom):
  1. `活動` / EVENT — ornate star + chevron glyph
  2. `任務` / TASK — folded scroll/document
  3. `成就` / ACHIEVEMENT — crown over chalice
  4. `商城` / SHOP — awning storefront
  5. `倉庫` / STORAGE — chest
- Hover: `translateX(2px)` + gold drop-shadow glow

##### 5. Side Shortcuts (right edge)
- Position: `right: 22px; bottom: 145px;` column, gap 18px
- Each: 26×26 icon stacked over zh label (13px) over EN label (8px)
- Items: `回憶 / MEMORY` (book), `排行 / RANKING` (trophy)

##### 6. Bottom Navigation
- Full-width container at `bottom: 0`, padding `12px 0 14px`
- **Top divider**: 1px horizontal gold gradient line spanning 10%–90%, with 7×7 rotated-square gold diamonds at each end
- **Items** (4): `space-around`, padding `0 8%`
  - `主城 / HOME` — **active** (gold-bright label + 5×5 diamond pip 8px above icon, glowing)
  - `冒險 / ADVENTURE` — has red unread dot (6×6) at top-right of icon area
  - `星城 / STARFIELD`
  - `公會 / GUILD`
- Active: gold-bright text + text-shadow glow + diamond above
- Inactive: warm off-white text, gold dim icon

---

## Interactions & Behavior

| Element | Behavior |
|---|---|
| Avatar | Tap → open profile sheet |
| Resource pill `+` | Tap → open shop scoped to that resource (stamina recovery / gold pack / gem pack) |
| Mail | Tap → mailbox modal; pip clears when opened |
| Friends | Tap → friends list |
| Settings | Tap → settings page |
| Left menu items | Tap → push corresponding sub-screen; back button returns to lobby |
| Memory / Ranking | Tap → respective full-screen view |
| Bottom nav | Tap → switch hub. Selected item gets the gold treatment + diamond pip |
| `冒險` red dot | Shows when there's a new chapter/event chapter unread; clears when player enters Adventure |

### Hover / Press
- Buttons & menu items: subtle translate (1–2px) + gold drop-shadow glow on hover
- Pressed state: scale 0.97 (recommended; not currently in CSS, add per platform conventions)

### Transitions
- Use 150ms ease for hover transforms
- Recommended entry animation (optional polish): stagger fade+slide for left menu items (40ms apart, 240ms duration, ease-out)

---

## State Management

| State | Type | Notes |
|---|---|---|
| `player.name` | string | "星奈的指揮官" |
| `player.level` | int | 48 |
| `player.xp` / `player.xpMax` | int / int | 5680 / 7200 → bar fill = xp / xpMax |
| `wallet.stamina` / `wallet.staminaMax` | int / int | 24 / 120 |
| `wallet.gold` | int | display with thousands separator |
| `wallet.gem` | int | display with thousands separator |
| `mail.unreadCount` | int | drives mail pip visibility |
| `nav.activeTab` | enum: home/adventure/starfield/guild | drives active styling |
| `notifications.adventure` | bool | drives red dot on `冒險` |

Data fetching: lobby boots once on app entry; resources & mail count poll or push-update via socket.

---

## Assets

| Asset | Status | Notes |
|---|---|---|
| `assets/bg-clean.png` (1023×1537) | **Reference / placeholder** | Replace with the game's actual background illustration of the same composition. Avatar art (white-haired character) is part of this single illustration, not a separate sprite. |
| Avatar thumbnail | **Placeholder** | Currently a CSS radial-gradient fallback in the prototype — replace with the actual character portrait crop. Square or circle, 56×56 minimum, ideally 112×112 for retina. |
| All UI icons (resource, util, menu, side, nav) | **Placeholder geometry** | Drawn inline as SVG with simple gold-stroke shapes. Game art team should supply final ornamental icons in a consistent gothic/heraldic line style. The placeholder strokes are 1–1.2px on a 24×24 (resource/util) or 32×32 (menu/nav) viewBox. |
| Fonts | Google Fonts (Inter + Noto Sans TC) | OK to use as-is, or substitute the codebase's existing Latin + CJK pair. |

---

## Localization

The screen mixes Traditional Chinese (zh-TW) and English. Treat both as separate string resources; do not hardcode. The English label sits below the Chinese in a smaller, wide-tracked style as a stylistic accent — if your localization framework can't render two stacked strings per button cleanly, drop the EN sub-label rather than auto-translating the zh.

Strings used:
```
player.title           = "星奈的指揮官"
menu.event             = "活動"        / "EVENT"
menu.task              = "任務"        / "TASK"
menu.achievement       = "成就"        / "ACHIEVEMENT"
menu.shop              = "商城"        / "SHOP"
menu.storage           = "倉庫"        / "STORAGE"
side.memory            = "回憶"        / "MEMORY"
side.ranking           = "排行"        / "RANKING"
nav.home               = "主城"        / "HOME"
nav.adventure          = "冒險"        / "ADVENTURE"
nav.starfield          = "星城"        / "STARFIELD"
nav.guild              = "公會"        / "GUILD"
```

---

## Implementation Checklist

- [ ] Set up 2:3 portrait canvas with safe-area handling
- [ ] Wire background art + vignette overlay
- [ ] Build player block with circular avatar, level pill, XP bar
- [ ] Build resource pill component (icon + value + plus); instantiate ×3
- [ ] Build util icon button row (mail/friends/settings) with notification pip
- [ ] Build left-menu component with vertical rail + diamond markers + zh/en label pair
- [ ] Build side-shortcut component (memory, ranking)
- [ ] Build bottom-nav with diamond-capped divider, 4 destinations, active treatment, red dot
- [ ] Hook all buttons to navigation/modal targets
- [ ] Verify all values are data-driven and localizable
- [ ] Replace placeholder icons with finalized art
- [ ] QA hover/press/active states across platforms
