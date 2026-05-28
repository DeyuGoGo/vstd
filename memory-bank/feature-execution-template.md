# Feature 執行準則（Harness Engineering）

> Agent = Model + Harness
> Harness 不是 agent 本身，而是包裹 agent 的完整基礎設施：
> 可存取的工具、安全的 guardrail、自我修正的反饋迴路、人類可監控的可觀測層。
>
> — Martin Fowler, *Harness Engineering for Coding Agent Users*

## 整體流程

```
P1: 理解需求 + 任務拆解
  ↓
P2: 盤點資源 + 工作清單 → 自審 → 自動凍結
  ↓ 🔒 凍結（< 50 行小任務走 fast track 可跳過）
P3~P6: 執行（每步 build+typecheck+commit）
  ↓
P7: 驗證（遞迴關卡，依修正範圍選擇性重跑，上限 3 輪）
  │
  ├─ 不通過（缺實作）→ 回 P5/P6 補做
  ├─ 不通過（需求偏差）→ 回 P1 重新拆解
  │
  └─ 全部通過
      ↓
P8: 清理 + 收尾

持續性熵管理：每完成一個 feature 掃描一次 constraint drift
```

---

## 硬性 Guardrail

### Feedforward 控制（預防）

| 規則 | 說明 | 修正方式 |
|------|------|---------|
| **G1: 每個子任務最多修改 3 個檔案** | 超過就拆更小的任務 | 重新拆解，將任務分成更小的單元 |
| **G2: 每個子任務改動不超過 200 行** | 含新增 + 修改 | 同 G1，拆成更小的任務 |
| **G3: 一個任務只做一件事** | 不混 feature / refactor / bugfix | 分離成獨立任務，各自 commit |
| **G4: 新增程式碼必須遵循既有模組邊界** | 例：戰鬥邏輯走 `battle/engine/`，UI 走 `battle/components/`，store 走 `stores/` | 不跨層；參考既有檔案的位置 |
| **G5: 不自行新增 magic number 到 component** | 戰鬥數值放 `characters/*.ts` 或 `engine/types.ts`，不散落在 JSX | 查既有常數，沒有就在資料層補 |
| **G6: 不擅自刪除不在 git 追蹤的檔案** | 刪除前必須使用者確認 | 列出要刪的檔案，等使用者說 OK |
| **G8: P2 凍結後不可擅自加工項** | 發現需要加 → 暫停回 P2 | 回 P2 補進工作清單，重新自審 |

### Feedback 控制（偵測 + 修正）

| 規則 | 說明 | 修正方式 |
|------|------|---------|
| **G7: 每個子任務完成後立即 typecheck + commit** | 不累積多個任務才驗證 | `cd app && npx tsc -p tsconfig.app.json --noEmit` + `GitCommit.sh` |
| **G9: P7 驗證依修正範圍選擇性重跑** | 改了視覺 → 重跑層 1；改了數值/邏輯 → 重跑層 2 | 根據 diff 涉及的檔案判斷 |
| **G10: 循環偵測 — 同一項修正反覆失敗 2 次就暫停** | 回報使用者，不繼續重試 | 使用者調整 harness 規則後再繼續 |
| **G17: P7 整體循環上限 3 輪** | 防止不同項目輪流失敗造成無限迴圈 | 超過 3 輪暫停，回報使用者整體狀況 |

### Context 控管

| 規則 | 說明 | 修正方式 |
|------|------|---------|
| **G11: 每個 subagent 只給它需要的 context** | 越乾淨越好 | 指定模組級 scope（如「battle 模組」、「roster 模組」） |
| **G12: 明確列出 subagent 可讀的範圍** | 不給模糊指令 | 至少指定模組或目錄，不是「整個 codebase」 |
| **G13: 上一階段的產出 = 下一階段的輸入** | 不帶無關歷史 context | 只傳產出摘要，不傳對話紀錄 |

### 人類 on-the-loop

| 規則 | 說明 | 修正方式 |
|------|------|---------|
| **G14: 不確定就問，但單一 Phase 最多問 2 次** | 超過 2 次 = context 不足 | 回 P1/P2 補充 context，不要繼續問 |
| **G15: G10/G17 觸發時回報使用者** | agent 卡住了，需要人調整 harness | 提供失敗紀錄讓使用者判斷 |
| **G16: 使用者調整 harness，不逐步審批** | on-the-loop，不是 in-the-loop | agent 自主跑，harness 自動擋 |

---

## P1: 理解需求 + 任務拆解

**目標：** 主 Agent 完整理解需求，拆成符合 G1~G3 的子任務。

**Context Engineering：**
1. 讀取需求描述：可能來自 `memory-bank/specs/*.md`、對話、或 `img_order/*/SPEC.md`
2. 如果跟視覺有關：
   - 看 `img_order/` 或 `assets/` 對應素材
   - 把畫面結構轉成文字描述
3. 主 Agent 掌握整體佈局後，拆解成子任務
4. 每個子任務標明：影響的檔案（≤3）、預估改動量（≤200 行）

**遞迴進入時（從 P7 回來）：**
- 讀取 P7 驗證報告
- 缺少實作 → 補子任務，從 P5/P6 重新執行
- 需求理解偏差 → 重新拆解，走完整流程

**Context Scope：**
- 主 Agent：spec / 需求描述 + 既有檔案的相關段落

**Gate：** 任務清單產出，每項符合 G1~G3 → 自動進 P2

---

## P2: 盤點資源 + 工作清單

**目標：** 查找現有資源，產出工作清單。

**做什麼：**
1. 派 Explore agent 查找現有資源（模組級 scope）
2. 主 Agent 分析：逐項標記「已有 / 需新增 / 需修改」
3. 產出工作清單，每項標明影響檔案和預估行數
4. 自審：對照 G1~G3 一輪，問清 openQuestions

**Gate：** openQuestions 全部拍板 → 🔒 自動凍結 → 進 P3

**Fast Track：** 預估總改動 < 50 行的小任務可跳過 P2 凍結，直接執行。

**Context Scope：**
- Explore agent：只給搜尋目標（如「battle 模組內的 Hero 元件 + lineup 相關 store」）

---

## P3: 基礎建設

**目標：** 按凍結清單準備資源和常數。

**做什麼：**
- 新增/修改 `characters/*.ts` 角色資料
- 補齊 `engine/types.ts` 內缺的常數
- 確認 `app/public/img/` 或 `app/public/video/` 素材到位

**Feedback：** typecheck ✅ + `GitCommit.sh` → 進 P4

---

## P4: 共用元件抽取

**目標：** 從現有程式碼抽取可複用元件。

**做什麼：**
- 識別可複用的 React 元件
- 抽到獨立檔案，加參數支援新 variant
- 預設值與原值相同，確保向後相容

**Feedback：** typecheck ✅ + 既有畫面無回歸 + `GitCommit.sh` → 進 P5

---

## P5: 主體 UI

**目標：** 建立新畫面 / 視覺核心佈局。

**做什麼：**
- 用 P4 共用元件組裝新畫面
- 對照需求逐層搭建
- 樣式走 CSS modules（`*.module.css`）

**Feedback：** typecheck ✅ + dev server 開起來可看到 → 進 P6

---

## P6: 接線

**目標：** 讓新畫面能跑通整段流程。

**做什麼：**
- Scene routing 接入（`useSceneStore` setScene）
- Store action 串接（`usePlayerStore` actions）
- 過渡動畫 / 音效（如有）

**Feedback：** typecheck ✅ + 玩家流程可操作完整一輪 + `GitCommit.sh` → 進 P7

---

## P7: 驗證（遞迴關卡，上限 3 輪）

**目標：** 驗證需求達成度。依修正範圍選擇性重跑，不無腦全部回歸。

### 層 1 — 視覺/手感（只在有 UI 或數值改動時執行）

**執行：**
- dev server 開起來，跑一輪實際流程
- 對照需求描述逐項勾選
- 截圖留證

**通過條件：** 玩家可走完目標流程，視覺/手感符合 plan 描述

**不通過：** 修正 → 只重跑層 1

### 層 2 — 程式碼品質

**執行：** 派 code-reviewer subagent（或自審）

**通過條件：**
- 無 magic number 散落
- 既有架構邊界（UI/engine/store/data）沒被打破
- typecheck 過、無 lint warning

**不通過：** 修正 → 改了 UI 檔案重跑層 1+2，否則只重跑層 2

### 層 3 — 需求達成度（主 Agent）

**執行：** 對照 P1 需求清單逐項勾選

**不通過：**
- 缺少實作 → 回 P5/P6 補做（不回 P1）
- 需求理解偏差 → 回 P1 重新拆解

### 安全閥

- **G10：** 同一項修正失敗 2 次 → 暫停回報
- **G17：** P7 整體循環 3 輪 → 暫停回報
- **G9：** 根據 diff 範圍選擇性重跑

---

## P8: 清理 + 收尾

**前置條件：** P7 全部通過

**目標：** 清理熵，移除舊碼，品質收斂。

**做什麼：**
1. 移除 Legacy / deprecated 標記和舊碼
2. 過時的 PNG / video 搬到 `app/archive/` 或刪掉
3. typecheck ✅
4. `GitCommit.sh`
5. 把 task 狀態翻 `done`、更新 nowTasks log

---

## 持續性熵管理（Entropy Management）

> 不只在 P8 做一次。每完成一個 feature 掃描一次。

| 掃描項目 | 做什麼 |
|---------|--------|
| CLAUDE.md 與程式碼一致性 | 檢查 CLAUDE.md 描述的架構是否還正確 |
| deprecated 標記清理 | 搜尋 `// TODO`、`// FIXME`、`Legacy` 標記 |
| memory-bank 過時內容 | 檢查 nowTasks 是否有已完成未清理的任務 |
| 過時資源 | `app/public/img/` 有沒有沒人引用的圖（可搬 archive） |

---

Sources:
- [Martin Fowler - Harness Engineering for Coding Agent Users](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)

## 歷史

- **2026-05-25**：從 HonrySDK android `memory-bank/feature-execution-template.md` 搬過來，改寫為 vstd（React/TS/Phaser/Zustand 小遊戲）語境。P7 簡化為 3 層（去掉 Figma 比對和 Codex 外部審查層）。
