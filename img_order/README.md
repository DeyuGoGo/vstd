# 美術工單 (img_order)

此資料夾用來放遊戲內缺少的美術素材需求單。

## 使用方式

1. 每個工單一個資料夾，命名為 `編號_主題`（例：`001_blessing_gold`）
2. 資料夾內固定放兩個東西：
   - `SPEC.md` — 工單說明（規格、用途、參考、交付路徑）
   - `references/` — 風格參考圖（同系列現有作品）
3. 美術完工後，把產出的檔案放在 `SPEC.md` 中註明的「交付路徑」對應位置即可。

## 待辦工單

| 編號 | 主題 | 用途 |
|------|------|------|
| 009 | 劍士（swordsman）全套素材 | 第二隻角色 — 5 張戰鬥 sprite + avatar + lobby video。詳見 [009_swordsman/SPEC.md](009_swordsman/SPEC.md) |

## 命名規約

角色 / Boss 美術會交付兩種版本：

- **無後綴**（如 `hero_aoe.png`） = **Q版 chibi**，給戰鬥場景小尺寸渲染用（~150 px 寬）
- **`_cel` 後綴**（如 `hero_aoe_cel.png`） = **立繪 cel-shaded 全身**，給大廳選角 / 過場 / 選單大圖用

工程預設用無後綴版（Q版）做戰鬥 sprite；_cel 版只有在 lobby UI 加入角色切換時才會被使用。Boss 兩版差異不大（皆為全身比例），目前戰鬥用 `boss.png`（Q版）。

## 已完成（保留紀錄）

| 編號 | 主題 | 交付檔案 | 工程整合狀態 |
|------|------|---------|------|
| 001 | 貪婪之月 blessing icon | `blessings/gold.png` | ✅ 已掛 art 欄位 |
| 002 | 穿刺彈 blessing icon | `blessings/pierce.png` | ✅ 已掛 art 欄位 |
| 003 | Boss 立繪 | `boss.png` + `boss_cel.png` | ✅ Enemy.tsx 已 swap 用 boss.png；⏳ 獨特行為待做（priority #4）|
| 004 | AoE 角色 | `hero_aoe.png`（Q版）+ `hero_aoe_cel.png`（立繪） | ⏳ 檔案備齊，roster 整合在 priority #5 |
| 005 | 控場角色 | `hero_frost.png`（Q版）+ `hero_frost_cel.png`（立繪） | ⏳ 檔案備齊，roster 整合在 priority #6 |
| 006 | 戰鬥背景低飽和重繪 | `arena-bg.png`（覆蓋舊圖） | ✅ 直接生效 |
| 007 | 小兵 / 重甲兵立繪化 | `enemy_minion.png` + `enemy_brute.png` | ✅ Enemy.tsx 已從 SVG 換 PNG |
