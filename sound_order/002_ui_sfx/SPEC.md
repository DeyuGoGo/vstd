# 工單 002 — UI 音效 Pack

## 用途

升級 modal、reroll 按鈕、設定按鈕等 UI 互動目前完全靜默。手機遊戲的「點擊回饋」直接影響操作信任感——點下去沒聲音，玩家會懷疑「點了沒？」進而連點。本票補上 UI 互動的最少必要音效。

不在本票範圍：戰鬥情境音效（[001_battle_sfx_core](../001_battle_sfx_core/SPEC.md)）、BGM、角色語音。

## 規格

同 [README.md](../README.md) 預設：OGG mono 22 kHz 16-bit -3 dBFS，交付到 `app/public/audio/sfx/`。

## 音效清單（5 條）

| # | 檔名 | 情境 | 長度 | 風格描述 |
|---|------|------|------|---------|
| 1 | `sfx_ui_card_hover.ogg` | 升級卡片 hover / 觸控按下 | 40–80 ms | 極輕微的「滴」/ 星塵點亮聲，**非常短**避免反覆刺耳 |
| 2 | `sfx_ui_card_pick.ogg` | 確認選擇祝福卡片 | 250–500 ms | 上揚確認 + 微神聖光感，比 hover 強但不要蓋過 sfx_level_up 的延伸 |
| 3 | `sfx_ui_reroll.ogg` | 點 Reroll 重抽 | 300–500 ms | 骰子滾動 / 卡牌洗動 / 星塵重組感；有「重新發牌」的識別度 |
| 4 | `sfx_ui_button_tap.ogg` | 通用按鈕點擊（暫停、退出大廳等） | 60–120 ms | 中性短點擊，類似輕磁吸聲；不要太「電子感」 |
| 5 | `sfx_ui_pause.ogg` | 暫停 / 恢復 | 150–250 ms | 短促「凝固」感，可加極輕的時間停滯感共振 |

## 風格一致性

UI pack 應該與 [001_battle_sfx_core](../001_battle_sfx_core/SPEC.md) 屬於**同一個音色家族**——星塵 + 輕魔法的調性，避免變成「網頁工具的音效」。

## 觸發頻率注意

`sfx_ui_card_hover`（#1）會在玩家滑動 / 觸碰升級卡時頻繁觸發，如果太強會疲勞。**寧可偏輕、頻率允許聽不到**，也不要做成大張力的音效。

## 交付方式

5 個 OGG 放到 `app/public/audio/sfx/`，並回報。工程會在 [BlessingCard.tsx](app/src/battle/components/BlessingCard.tsx)、[LevelUpOverlay.tsx](app/src/battle/components/LevelUpOverlay.tsx)、[PauseOverlay.tsx](app/src/battle/components/PauseOverlay.tsx) 等元件內掛上對應呼叫。
