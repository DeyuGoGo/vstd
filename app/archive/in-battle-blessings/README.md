# 戰鬥內升等祝福系統備份（In-Battle Blessings）

來源：主線分支 cleanup 階段，把「戰鬥中每次升等彈窗讓玩家三選一祝福」的整套機制下架，
保留檔案以便未來重啟此設計或抽出共用視覺資產。

## 為什麼留著

這套「戰鬥內 LevelUp → 三選一祝福」流程目前已從主線移除，但相關設計概念（祝福資料、
隨機抽選、卡片動畫、icon 視覺）對未來迭代仍有參考價值：

- 重新評估後可能改成「戰前選祝福」「跨戰持續祝福樹」等變體，資料結構（`Blessing`、`Mods` 套用函式）
  可以原樣沿用，不需要重畫。
- `BlessingGlyph` 內含 8 組 SVG icon（star8 / arrows / hourglass / eye / heart / echo / coin / aura），
  本身就是可獨立複用的視覺資產，做技能樹節點 / 道具圖示 / Buff 條 icon 都用得上。
- 卡片 hover / pick 動畫（`battle-card-in` keyframe、tint glow shadow）已調過手感，
  之後想做其他選單卡片可以直接搬樣式。

## 每個檔案的用途

- `blessings.ts` — 8 個祝福資料定義（`id` / `name` / `desc` / `desc2` / `val` / `glyph` / `tint` / `art` / `apply`），
  以 `active` flag 區分上場與占位（如 `aura`），對外暴露 `ACTIVE_BLESSINGS` filtered 陣列。
  `apply(mods, ctx)` 直接改 `Mods`（如 `projSpeedMul`、`fireCdMul`、`critBonus`、`hpMaxBonus` 等）
  或透過 `ctx.healHp` 回血。
- `pickThree.ts` — 從 `ACTIVE_BLESSINGS` 用 Fisher-Yates 洗牌後抽前 3 個，純函式無外部依賴。
- `LevelUpOverlay.tsx` — 戰鬥內升等彈窗：標題 `LEVEL UP!`、`LV.x → LV.y` 字串、3 張 `BlessingCard`、
  底部 Reroll 按鈕（含 `DiceIcon` + `SmallCoin`）。透過 `Z.OVERLAY` 疊在戰場之上，
  帶 backdrop blur + fade-in 動畫。
- `BlessingCard.tsx` — 單張祝福卡片（480×132），含左側 art 圖（`b.art`）或 fallback 的 `BlessingGlyph`、
  右側 name / desc / val 字串，hover/focus/touch 觸發抬升縮放與 tint glow，pick 時播 `ui_card_hover` 音效。
- `glyphs.tsx` — 8 個祝福對應的 SVG icon set（star8 / arrows / hourglass / eye / heart / echo / coin / aura），
  唯一消費者是 `BlessingCard`。SVG 畫法（漸層光暈、雙層描邊、tint 配色）可重用於未來技能樹節點視覺。

## 依賴的素材

`BlessingCard` 嘗試載入 `b.art` 指向的 PNG，目前 repo 仍保留：

- `app/public/img/blessings/arcane.png`
- `app/public/img/blessings/haste.png`
- `app/public/img/blessings/crit.png`
- `app/public/img/blessings/crystal.png`
- `app/public/img/blessings/echo.png`
- `app/public/img/blessings/gold.png`
- `app/public/img/blessings/pierce.png`
- `app/public/img/blessings/aura.png`（占位）

若 `b.art` 缺失，卡片會 fallback 到 `BlessingGlyph` SVG，不會破版。

音效：`ui_card_hover`（由 `app/src/audio.ts` 註冊）。

## 還原時的對接點

這套機制原本掛在戰鬥流程的「升等 callback」上，搬離時也同步移除了呼叫端。未來重啟時：

1. 把這 5 個檔案搬回原位（或放新位置）：
   ```
   cp app/archive/in-battle-blessings/blessings.ts       app/src/battle/data/blessings.ts
   cp app/archive/in-battle-blessings/pickThree.ts       app/src/battle/engine/pickThree.ts
   cp app/archive/in-battle-blessings/LevelUpOverlay.tsx app/src/battle/components/LevelUpOverlay.tsx
   cp app/archive/in-battle-blessings/BlessingCard.tsx   app/src/battle/components/BlessingCard.tsx
   cp app/archive/in-battle-blessings/glyphs.tsx         app/src/battle/glyphs.tsx
   ```
2. 在戰鬥主迴圈的升等事件補回：開啟 overlay、呼叫 `pickThree()`、把選中的 `Blessing.apply` 套到當前 `Mods` 上。
3. 確認 `Mods` interface（`app/src/battle/engine/types.ts`）仍包含 `projSpeedMul` / `fireCdMul` / `critBonus`
   / `hpMaxBonus` / `projPerCast` / `goldGainMul` / `projPierce` 這些欄位；若已刪則需補回或重新對應。
4. Reroll 機制需要外部狀態餵 `rerolls` 數量與 `onReroll` callback（原本掛在玩家貨幣系統上）。
5. `BlessingGlyph` 元件的 SVG 圖形可獨立抽出當技能 icon 用 — 不一定要連同祝福系統整套還原，
   想做技能樹 / 道具圖鑑時可以只搬 `glyphs.tsx` 過去。

## Git 歷史對照

- `6e9b708 chore(assets): add lobby live rig + starina sprite layers, retire SPEC 001` — Lobby 資產整理
- `1faeedd refactor(battle): centralize zIndex and drop unused overlays` — 戰鬥 zIndex 集中，移除未用 overlay
- 本次搬移：把戰鬥內三選一祝福（LevelUpOverlay / BlessingCard / blessings / pickThree / glyphs）整套下架到 archive
