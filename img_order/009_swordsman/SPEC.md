# 009 — 劍士 (swordsman) 素材清單

對應角色資料：[app/src/characters/swordsman.ts](../../app/src/characters/swordsman.ts)
草稿參考：[references/draft_idle.png](references/draft_idle.png)（銀髮少女、藍斗篷、白絲襪 + 鎧甲短裙、長劍）

## 角色定位

- **基礎職**（Lv 10 可一轉火劍士 / 冰盾戰）
- **近戰**、攻速慢、單擊高傷、HP 厚
- **視覺氣質**：銀髮少女、藍色斗篷 + 白絲襪 + 鎧甲短裙、握長劍（已有的 Q 版立繪定調）

## 現況

| 已有 | 路徑 | 備註 |
|---|---|---|
| ✅ Q 版 idle 立繪（草稿） | `app/public/img/_drafts/swordswoman-idle.png` 與 `app/public/img/swordsman/_draft_idle.png` | 1024×1024，未去背。可參考設計 |

## 缺失素材（請依此清單補齊）

### 戰鬥用 — sprite layers

| 檔名 | 用途 | 建議尺寸（透明背景 PNG） | 備註 |
|---|---|---|---|
| `app/public/img/swordsman/base_idle.png` | 戰鬥角色軀體（站姿） | ~316×474（對齊星奈 base_idle.png） | 去背，含頭+身+腿 |
| `app/public/img/swordsman/base_attack.png` | 揮劍姿 | ~349×474（對齊星奈 base_attack.png） | 去背，動作幅度比 idle 大 |
| `app/public/img/swordsman/weapon_blade.png` | 武器（長劍） | ~269×484（對齊星奈 weapon） | 獨立圖層，可疊在 base 上 |
| `app/public/img/swordsman/headgear_circlet.png` | 頭飾（髮帶/小冠？） | ~272×244（對齊星奈 headgear） | 如果設計上不需要，可不出 |
| `app/public/img/swordsman/hand_cover.png` | 手部覆蓋（握劍手套） | ~99×135（對齊星奈 hand_cover） | 蓋住武器與身體交界，提升層次感 |

> 圖層 z-index 由前到後：base (z:2) → weapon (z:1) → headgear (z:4) → hand_cover (z:5)
> 在 Hero 元件中以 px 座標排版，座標可從 [app/src/characters/swordsman.ts](../../app/src/characters/swordsman.ts) 的 `assets.layout` 微調。
> 戰鬥內顯示在 120×135 的盒子裡，圖層 width 約 19-61px（縮放後）。

### Roster / CharacterDetail 用

| 檔名 | 用途 | 建議尺寸 | 備註 |
|---|---|---|---|
| `app/public/img/swordsman/avatar.png` | 頭像（Roster 卡片、CharacterDetail header、Lobby player block） | 512×512 | 圓框會 mask，重點放在臉部正面 |

### Lobby 用

| 檔名 | 用途 | 建議規格 | 備註 |
|---|---|---|---|
| `app/public/video/swordsman-idle.mp4` | Lobby 待機動畫（呼吸 / 髮絲飄動 / 眨眼） | 縱版、~720×1280，~3-5MB，10-30s loop | 跟星奈的 `lobby-idle.mp4` 同規格。若暫時沒影片，可放靜態大圖 `app/public/img/swordsman/lobby-still.png`，但要改 Lobby.tsx 支援 still fallback（另議） |

## 啟用流程（素材到位後）

1. 把上面所有檔案丟進對應路徑。
2. `app/src/characters/index.ts` 加入 swordsman：
   ```ts
   import { swordsman } from './swordsman';
   export const CHARACTERS = { starina, swordsman } satisfies Record<string, CharacterBaseConfig>;
   ```
3. 啟 dev server，進 Lobby → 星城 → Roster → 應看到「劍士」卡片。
4. 點劍士進 CharacterDetail，確認 6 素質、HP 上限、傷害區間等預覽正確。
5. 編入 Slot 1，進戰鬥，視覺檢查 sprite 4 圖層位置 — 若歪掉，調整 [app/src/characters/swordsman.ts](../../app/src/characters/swordsman.ts) 的 `layout` 座標即可（不用改程式邏輯）。

## 數值（已寫好，可後續微調）

| 項目 | 劍士 | 星奈（對比） |
|---|---|---|
| hpBase | 3800 | 3200 |
| attackRange | 180（近戰） | 515 |
| fireCdBase | 0.55（慢） | 0.42 |
| projSpeedBase | 480 | 380 |
| projSpeedCap | 600 | 460 |
| critBase | 0.15 | 0.18 |
| dmgMinBase | 90 | 60 |
| dmgMaxBase | 140 | 100 |
| startingStats | str3 / agi1 / vit3 / dex2 / luk1 / int1 | int3 / agi2 / vit2 / dex1 / luk1 / str1 |

## 後續（這次不做）

- **一轉火劍士**：STR 主、攻速更慢、傷害更高、攻擊範圍大（火劍氣 splash）
- **一轉冰盾戰**：VIT 主、傷害降低、命中附加緩速 debuff
- **二轉**：待定
- **轉職資料模型**：CharacterBaseConfig 加 `jobs: Record<string, JobConfig>`、`baseJobId`，CharacterProgress 加 `jobId`。詳見 master plan 的 Future / Job System 段（待補）
