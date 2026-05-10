# tools/

工程性腳本資料夾，放專案的內部工具（非執行期程式）。

## generate-sfx.mjs

程式化音效合成器。把 [sound_order/](../sound_order/) 工單裡的 14 個 SFX 直接用 sine / triangle / soft-square / noise + 鈴音 + 呼嘯原語合成出來，不依賴外部音源或委外。

### 為什麼程式合成而不是發包

- **可重現**：seed 固定（`0x51a7d05`），同一份 script 永遠產出 byte-identical 的 OGG
- **可調**：覺得 `boss_spawn` 太短、`hit_crit` 不夠脆？改幾行參數重跑即可，不用發新工單
- **無授權**：不引入第三方資源、無 CC 條款要追

### 用法

需要本機已裝 ffmpeg。

```bash
FFMPEG_PATH=/path/to/ffmpeg node tools/generate-sfx.mjs
```

或 Windows PowerShell：

```powershell
$env:FFMPEG_PATH = "C:\path\to\ffmpeg.exe"; node tools\generate-sfx.mjs
```

腳本會：
1. 把每個音合成為 mono 22.05 kHz 16-bit WAV，寫到 `app/public/audio/.tmp-sfx/`
2. 用 ffmpeg 轉 OGG Vorbis 到 `app/public/audio/sfx/`
3. 清掉暫存

執行時間約 5-10 秒。

### 何時應該重跑

- 修改 [sound_order](../sound_order/) 工單內容後（spec 變了→改腳本→重跑）
- 想調整某個 SFX 的長度 / 響度 / 音色
- 重新平衡 pack 內各音的相對響度（peak 由 `PEAK = -3 dBFS` 控制，整體 -3 dBFS 已對齊 spec）

### 內部架構

| 原語 | 用途 |
|---|---|
| `addSine(buf, {from, to, attack, decay, wave})` | 純音 / 滑音；wave 可選 sine / triangle / soft-square |
| `addNoise(buf, {tone, attack, decay})` | 寬頻雜訊；tone 控制低通強度（0=白噪、1=低頻擊聲）|
| `addBell(buf, start, midi, duration, amp)` | 鈴音；以 MIDI note 指定基頻、自動加 2x / 3x 倍音 |
| `addWhoosh(buf, start, duration, amp, upward)` | 上揚或下行掃頻 + 噪音層 |

每個 SFX 在 `sounds` map 裡用 3-7 行原語疊加而成，例如 `boss_spawn` 是「低頻 sub bass + 中頻 triangle + 高頻 sine + 寬頻 noise + 末段低音鈴」。

## 未來

之後若加入新 SFX（例如新角色 hero_aoe 的射擊音），在 `generate-sfx.mjs` 裡的 `sounds` map 加一個 entry、重跑腳本即可——同步更新 [audio/index.ts](../app/src/audio/index.ts) 的 `SFX_FILES` 名單。
