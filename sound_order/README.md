# 音效工單 (sound_order)

此資料夾用來放遊戲內缺少的音效素材需求單。結構與 [img_order](../img_order/) 平行。

## 使用方式

1. 每個工單一個資料夾，命名為 `編號_主題`（例：`001_battle_sfx_core`）
2. 資料夾內固定放：
   - `SPEC.md` — 工單說明（用途、規格、清單、交付路徑、風格參考）
   - `references/` — 風格參考音檔或描述（若有）
3. 音效完工後，把產出的檔案放在 `SPEC.md` 中註明的「交付路徑」對應位置即可。

## 音檔格式預設

- **格式**：OGG Vorbis（web 最佳，瀏覽器原生支援、檔案小、無授權問題）；可接受 MP3
- **採樣率**：22.05 kHz 或 44.1 kHz 皆可
- **聲道**：SFX 預設 mono（檔案減半），BGM 需 stereo
- **位元深度**：16-bit
- **音量正規化**：以 -3 dBFS 為目標峰值，避免削波；同一 pack 內各音相對響度要一致
- **命名規約**：`sfx_<情境>_<動作>.ogg`（例：`sfx_hero_shoot.ogg`、`sfx_ui_card_pick.ogg`）
- **交付路徑**：`app/public/audio/`（音效資料夾，工單會註明子資料夾）

## 待辦工單

| 編號 | 主題 | 狀態 |
|------|------|------|
| 001 | 戰鬥核心音效 pack（9 種戰鬥情境）| 待製作 |
| 002 | UI 音效 pack（卡片、按鈕）| 待製作 |

## 已完成（保留紀錄）

（無）

## 替代方案：CC0 免費資源

若委外時程吃緊，可先用 CC0 / public-domain 音源臨時上線，工程整合不變。推薦來源：

- **Kenney.nl** — `https://kenney.nl/assets/category:Audio` — 大量遊戲音效 CC0 包
- **freesound.org** — 篩選 License = CC0 即可商用免標註
- **OpenGameArt.org** — 篩選 CC0 / CC-BY 0
- **Sonniss GDC bundles** — 每年 GDC 釋出的免費音效包

委外品質仍會比 CC0 好（風格統一、與美術氣質貼合），但 CC0 可作為驗證 hook 的快速 placeholder。
