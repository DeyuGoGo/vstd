# Sprite Rig 備份（Lobby 星奈分層方案）

來源：commit `fd081ff` (`feat(lobby): add per-eye blink and mirrored sleeve sway`) 的 HEAD 狀態，
即「改用 `lobby-idle.mp4` 之前」的最後一版分層 sprite rig。

## 為什麼留著

主線（未 commit 的修改）已把 Lobby 改成單支 mp4：[../../Lobby.tsx](../../Lobby.tsx) 的 `<video>`。
此資料夾保留 sprite 方案，方便：
- 之後做第二隻角色時，若想回到 per-layer 動畫，可以對照這個結構。
- 想做「動態換裝 / 換頭飾 / 換武器」時，sprite 分層才做得到，mp4 做不到。

## 檔案

- `Lobby.tsx` — 含 `lobbyStarinaLayers` / `lobbyStarinaEyeLayers` 陣列、`rigEyesGroupBlinkLeft/Right`
  雙眼獨立眨眼、`rigFrontHair` 等結構。
- `Lobby.module.css` — 對應的 keyframe 動畫（`sleeveSway` 鏡像、`blink` 等）與每層 `transform-origin` / `z-index`。

## 依賴的素材

CSS / TSX 引用以下路徑（檔案目前仍在 repo 中）：

- `app/public/img/lobby-bg-plate.png` — 背景底
- `app/public/img/lobby-moon-glow.png` — 月光特效
- `app/public/img/lobby-warm-lights.png` — 暖光特效
- `app/public/img/lobby-starina-cutout/` — 分層 PNG（30+ 張：`back-hair`, `face`, `eyelash`,
  `eyewhite`, `irides`, `headwear`, `topwear`, `bottomwear`, `handwear-left/right`, `legwear`,
  `footwear`, `objects`, `neck`, `eyebrow`, `ears`, `earwear`, `mouth`, `nose`, `front-hair`...）
  另含 `info.json`、`layers.json`、`src-head.png`、`src-img.png` 等原始拆圖資料。
- 已不再使用但 repo 仍保留：`lobby-starina-arm-front/back.png`、`lobby-starina-core.png`、
  `lobby-starina-hair.png`、`lobby-starina-head*.png`、`lobby-starina-legs.png`、
  `lobby-starina-pupils.png`、`lobby-starina-sparkles.png`、`lobby-starina-train.png`、
  `lobby-starina-veil.png`、`lobby-starina-cutout.png`（單張合成）。

## 如何還原

```
cp app/archive/lobby-sprite-rig/Lobby.tsx        app/src/lobby/Lobby.tsx
cp app/archive/lobby-sprite-rig/Lobby.module.css app/src/lobby/Lobby.module.css
```

或直接 `git checkout HEAD -- app/src/lobby/Lobby.tsx app/src/lobby/Lobby.module.css`
（前提是 mp4 版本尚未 commit）。

## Git 歷史對照

- `df8ada9 fix(lobby): use recut layered Starina rig` — 改用 cutout 重切後的版本
- `fd081ff feat(lobby): add per-eye blink and mirrored sleeve sway` — 加入雙眼獨立眨眼、袖子鏡像擺動（= 本備份）
- `6e9b708 chore(assets): add lobby live rig + starina sprite layers, retire SPEC 001` — 上一個資產整理 commit
