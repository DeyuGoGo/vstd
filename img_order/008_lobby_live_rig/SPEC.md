# 工單 008 — 大廳角色 Live Rig（眼動 + 眨眼 + 手臂分件）

## 用途

大廳主視角立繪「Starina（星奈）」做到卡厄斯 / NIKKE 風格的 idle live feel：
眼睛會眨會看、頭微浮、髮飄、披風飄、胸口呼吸、**手臂微微擺動**。

頭 / 髮 / 披風 / 裙擺 / 軀幹 5 層**已切好**（`lobby-starina-{head,hair,veil,train,core}.png`），
本工單補齊缺的 **眼睛 overlay × 2** 與 **手臂分件 × 2**，並重新導出 `core` 去掉手臂。

## 整體分層結構（給工程實作參考，不必管）

```
背景 (lobby-bg-plate.png)
 └─ train（裙擺）         ── trainSway ±3px rotate ±0.2°
 └─ veil（披風 / 面紗）   ── veilDrift
 └─ arm_back（後手臂）    ── 本工單新增，armSwayBack
 └─ core（軀幹，無手臂）  ── 本工單重切，coreBreath
 └─ arm_front（前手臂）   ── 本工單新增，armSwayFront
 └─ head（頭部，靜態臉）  ── headFloat
 └─ pupils（瞳孔）        ── 本工單新增，跟滑鼠/saccade 位移 ±3px
 └─ eyes_closed（閉眼）   ── 本工單新增，opacity 0↔1 眨眼
 └─ hair（頭髮）          ── hairSway
 └─ sparkles（粒子）      ── sparkleTwinkle
```

## 交付資產（共 5 張同尺寸 PNG）

**所有圖必須與 `lobby-starina-head.png` 完全同尺寸、同畫布、同對齊位置**（直接從原 PSD 導出，不要重新縮放對位）。透明區用 alpha=0。

| # | 檔名 | 內容 | 交付路徑 |
|---|------|------|---------|
| 1 | `lobby-starina-pupils.png` | 只畫兩顆瞳孔 + 虹膜 + 高光，其他 100% 透明 | `app/public/img/lobby-starina-pupils.png` |
| 2 | `lobby-starina-eyes-closed.png` | 只畫閉眼眼皮 + 睫毛，其他 100% 透明 | `app/public/img/lobby-starina-eyes-closed.png` |
| 3 | `lobby-starina-arm-back.png` | 只畫**身體背後那隻手臂**（連手肘 + 肩膀根部），其他透明 | `app/public/img/lobby-starina-arm-back.png` |
| 4 | `lobby-starina-arm-front.png` | 只畫**身體前面那隻手臂**（連手肘 + 肩膀根部），其他透明 | `app/public/img/lobby-starina-arm-front.png` |
| 5 | `lobby-starina-core.png`（**覆蓋現有**） | 軀幹 + 衣服主體，**把手臂的部分挖掉變透明**（手臂根部被肩膀蓋住即可，不必整隻挖乾淨） | `app/public/img/lobby-starina-core.png`（覆蓋） |

### 關於手臂分件（最關鍵）

- 兩隻手臂各自為一層，是為了它們能**各自小幅旋轉**做出 idle sway。動畫會以肩膀為旋轉軸（`transform-origin`），旋轉幅度約 ±0.6°、平移 ±1.5px、週期 5~7 秒，**極微小**，目的是讓畫面不死板，不是要做大動作。
- 切割時請確保**肩膀根部仍留一些重疊**到 core 那層（避免旋轉後肩膀露出縫隙）。
- 如果原 CG 是雙手交叉、握法器、抱胸這種**手臂高度交疊**的 pose，手臂很難獨立切——這時直接回報，我們改用「整個上半身 sway」的退路方案。

### 關於瞳孔層

- 瞳孔層會被位移 ±3px。請確保 `lobby-starina-head.png` 的**眼白範圍夠大**，瞳孔位移後不會穿出眼眶。
- 如果原 head 眼白偏小，請順便回頭把 `lobby-starina-head.png` 的眼白擴一點（眼眶內留多一點淺色底）。
- 瞳孔層的瞳孔位置請對齊原 head 的瞳孔，這樣 `--pupil-x: 0` 時看起來一致。

### 關於閉眼層

- 閉眼的眼皮 / 睫毛弧線必須對齊原 head 睜眼狀態同一條睫毛位置。
- 透明區邊緣稍微 feather，避免 opacity 切換時硬邊閃爍。

## 風格參考

- 唯一基準：現有 `lobby-starina-head.png` / `lobby-starina-core.png`（同一張 CG 切下來的）
- 不要改變整體美術風格、配色、明暗

## 交付方式

5 張 PNG 直接丟到 `app/public/img/` 對應路徑（其中 `lobby-starina-core.png` 是覆蓋），回報一聲即可。工程那邊會：

1. 在 `Lobby.tsx` 把現有單張 `<img class=lobbyCg>` 改成多層 `<img>`，依上面分層結構疊
2. 接上既有 `.rig-head / .rig-hair / .rig-veil / .rig-train / .rig-core` 動畫
3. 新增 `.rig-arm-back / .rig-arm-front` 動畫（各自的肩膀旋轉軸 + 微擺）
4. 新增 mouse listener + saccade interval → 寫到 CSS `--pupil-x / --pupil-y`
5. 新增眨眼 keyframe → 隨機 3~6 秒一次

## 後續（不在本工單範圍）

- 嘴型 overlay（`mouth-open.png`，搭配語音對白）
- 表情切換 overlay（笑 / 害羞 / 驚訝）
- 手指獨立分件（極致版，通常不必）
