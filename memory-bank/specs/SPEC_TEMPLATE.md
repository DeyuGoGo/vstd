# Spec Template

> 一份可執行的規格 = 動工前的合約。
> 寫 spec 多花 10 分鐘，省下 3 輪來回。
>
> 本 template 是「規格內容」，跟 `../feature-execution-template.md`（執行流程 P1-P8）互補：
> - **本檔**：寫「要做什麼」(P1 + P2 的輸出)
> - **execution template**：寫「怎麼做 + 怎麼驗」(P3-P8)

---

## 使用方式

### 流程

```
1. 想清楚要做什麼大功能（不是單一 task）
2. 依本 template 在 memory-bank/specs/<feature>.md 寫 spec
3. review 改細節 → 視為「凍結版本」
4. 把 spec 拆成 nowTasks/data/tasks/T-*.json（一單 ≤3 檔、≤200 行）
5. 動工：對 Claude 說「按 specs/<feature>.md 執行 T-001」
```

### Spec 檔案命名

```
memory-bank/specs/swordsman-integration.md     # 描述為主（小型 solo project 沒有 ticket 號）
memory-bank/specs/boss-unique-behavior.md
```

---

## Spec 內容六大要素（Template 主體）

> 動工前，下面六段都要填。任何一段填不出來，代表還沒想清楚。

---

```markdown
# <feature-slug> <一句話標題>

**狀態:** Draft / Frozen / In Progress / Done
**最後更新:** YYYY-MM-DD
**相關 tasks:** T-001, T-002, ...

---

## 1. Outcomes（完成後的樣子）

> 玩家視角，1-3 句話。不寫程式碼細節。

例：
- 玩家進 Roster 看到劍士卡片，編入 slot 1
- 戰鬥開場劍士站三角形前位，揮劍動畫每 0.55s 一次
- 攻擊範圍 180（近戰），單擊高傷（90-140）

---

## 2. Scope（範圍邊界）

### IN（要做）
- 劍士 5 張 sprite 圖層的整合
- swordsman 加進 CHARACTERS 物件
- Roster 卡片可顯示

### OUT（明確不做）
- 一轉職業（火劍士 / 冰盾戰）— 後續 spec
- 劍士的 lobby-idle.mp4 — 若 PNG 還沒到位，先用 fallback 圖
- 平衡性微調 — 先讓會跑，數值另開 spec

---

## 3. Constraints（技術限制）

| 類別 | 內容 |
|------|------|
| **既有模組** | `app/src/characters/`、`app/src/battle/components/Hero.tsx`、`app/src/roster/Roster.tsx` |
| **架構規則** | 角色資料只放 `characters/*.ts`；UI 元件不寫 magic number |
| **素材路徑** | `app/public/img/swordsman/*.png` + `app/public/video/swordsman-idle.mp4` |
| **資料合約** | swordsman.ts 已實作 `CharacterBaseConfig` interface（Session A 產出） |

---

## 4. Prior Decisions（為什麼選這個方向）

> 寫下「為什麼不這樣做」比「為什麼這樣做」更重要 — 防止後人回頭推翻。

- **不再做戰鬥內 blessing**：上一輪實驗過，已退役到 `app/archive/in-battle-blessings/`
- **lineup slot 0 = 前正中**：三角形站位用座標固定，不做隨機/拖拉
- **不引入 Phaser**：lobby/battle 都用純 React + DOM/CSS，避免 React + Canvas 同步問題

---

## 5. Tasks（原子任務清單）

> 對齊 G1-G3：單任務 ≤3 檔、≤200 行、只做一件事。
> 每項對應一張 nowTasks task JSON。

- [ ] **T-001**: swordsman 素材檔案到位（5 張 PNG + avatar + 可選 mp4）
- [ ] **T-002**: `characters/index.ts` 加入 swordsman 進 `CHARACTERS`
- [ ] **T-003**: Roster 卡片視覺確認可顯示劍士 avatar + 6 素質預覽
- [ ] **T-004**: 戰鬥場 slot 1 編入劍士，4 圖層座標微調

---

## 6. Verification（驗收條件）

完成後必須全部 ✅：

- [ ] `cd app && npx tsc -p tsconfig.app.json --noEmit` 通過
- [ ] dev server 啟動，lobby → 星城 → roster → 看得到劍士卡
- [ ] 點劍士進 CharacterDetail，6 素質顯示正確
- [ ] 編入 slot 1，進戰鬥，4 圖層位置不歪
- [ ] git log 每個 commit 都 follow `[branch]<msg>` 格式
- [ ] task 狀態翻 done
```

---

## 反例 — 寫了等於沒寫的 spec

❌ **Outcomes**: "讓戰鬥更好玩" → 太抽象，不可驗證
❌ **Scope**: "做劍士相關功能" → 沒邊界，scope creep
❌ **Constraints**: "用既有架構" → 沒指明哪個架構
❌ **Tasks**: "實作劍士" → 不是原子任務，沒辦法 commit
❌ **Verification**: "測試通過" → 哪些測試？怎麼算通過？

好 spec 的標準：**換另一個工程師（或 Claude）看，能照做出一樣的結果**。

---

## 歷史

- **2026-05-25**：從 HonrySDK android `memory-bank/specs/SPEC_TEMPLATE.md` 搬過來，改寫為 vstd 語境。拿掉 Jira / iOS / Unity / Hilt / strings.xml 等 SDK 特有欄位，例子改成劍士整合（real ongoing feature）。
