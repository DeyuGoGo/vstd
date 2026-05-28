# Plan 寫作規範

`nowTasks/data/tasks/T-*.json` 的 `plan` 區塊寫作規範。**開單時**遵循、**領單時**驗證。

違規 plan 會把實作者鎖死在錯誤路徑。寫 plan 是「規格合約」，不是「實作步驟清單」——後者鎖死實作者眼界，繞回正解要好幾輪。

---

## 欄位規範

### `goal`
一句話描述「玩家會得到什麼」，不寫實作。

### `boundaryConditions`（限 0-5 條）
**只允許三類：**
- 任務專屬限制（「不做手機解析度適配」、「只處理 lobby 場景」）
- Q-decisions 引用（「Q3 拍板：劍士只做基礎職，一轉留給未來」）
- 跨 task 協調（「依賴 T-X 還沒 done」）

**禁止：**
- 專案規則 — 寫在 `CLAUDE.md`，不要每張單複寫
- 實作策略 — 屬於 `riskNotes` / `preflightChecks`，不是邊界
- 樣式 / token 規則 — 全域規則

### `preflightChecks`（強制，0-5 條）
plan 階段必列的勘查項，避免實作者繞路。常見：
- **state 寫入點盤點**（誰寫入 X？有幾處？是否中央化？）
- 既有 pattern 確認（這專案怎麼做類似的事，例：「Hero 元件多 instance 怎麼接的」）
- 跨檔案影響範圍 grep
- 資源檔 / 數值常數 / store 前置條件

### `expectedDeliverables`（限 2-5 條）
**只准寫「玩家 / QA 看得到的結果」：**
- 視覺對齊（截圖、layout 描述）
- UI 行為（點下去發生什麼）
- 戰鬥手感（攻速、傷害區間、彈道）
- log 訊息、build 通過、typecheck 通過

**嚴禁：**
- 檔案路徑（`改檔: src/.../X.tsx`）
- function / class / 變數名（`新增 export const calculateDmg`）
- 機制（`在 useEffect 內呼叫 X`）
- 程式碼 pattern

### `steps`（限 3-6 條，高層次）
階段性：**勘查 / 實作 / 驗證** 三類為主。

| 例 | 評 |
|---|---|
| 勘查：現行 Hero 多 instance 接法 | ✅ |
| 實作：劍士在 lineup slot 1 顯示 4 圖層 | ✅ |
| 驗證：dev server 開 lobby → roster → 戰鬥確認視覺 | ✅ |
| 改 `Hero.tsx` 加 `weapon` prop | ❌ 鎖檔案 |
| 在 `useEffect` 內呼叫 `X` | ❌ 鎖機制 |

### `riskNotes`
事情可能哪裡會壞掉、踩坑點、邊角案例。跟實作機制無關。

### `openQuestions`
待 user 拍板的決策。**全部解掉**（含「已解 @」標記）**才能領單**。

### `referenceFiles`
相關檔案線索，**非路線圖**。實作者自行決定動哪裡，不可當必改清單。

---

## Lint Heuristics（領單時的機械化檢查）

逐欄位掃，違規列出讓 user 決定修正 / 接受 / 取消。

### `expectedDeliverables[*]`

| 規則 | 違規例 |
|---|---|
| 不可含 `改檔`、`新檔`、`新增 export`、`新增 function`、`新增 class`、`新增 const`、`新增 type` | 「改檔: src/.../X.tsx」 |
| 不可含 `.tsx` / `.ts` / `.css` / `.module.css` 副檔名 | 「Hero.tsx 加 ...」 |
| 不可含 React / Zustand 機制詞：`useState`、`useEffect`、`useMemo`、`useCallback`、`useRef`、`useStore`、`zustand.create`、`createContext`、`forwardRef` | 「在 useEffect 內呼叫」 |
| 不可含具體函式呼叫語法 `xxx(...)` | 「setLineupSlot(1, 'swordsman')」 |

### `boundaryConditions`

| 規則 | 違規例 |
|---|---|
| 數量 > 5 → 違規 | 9 條 |
| 不可含專案規則用語：`Vite config`、`Zustand`、`Tailwind`、`Phaser scene`、`React.StrictMode`、`hardcode` | 「不用 Zustand store」 |

### `steps`

| 規則 | 違規例 |
|---|---|
| 數量 > 6 → 違規 | 7 條以上 |
| 不可含檔名 / 副檔名 / `改 X 檔` | 「改 Hero.tsx」 |

### `preflightChecks`

| 規則 | 違規例 |
|---|---|
| 不存在 / 為空 → 違規 | 缺欄位或 `[]` |

### `openQuestions`

| 規則 | 違規例 |
|---|---|
| 任一條不含「已解 @」標記 → **阻擋領單** | 「Q5：用 Zustand 還是 Context？」（未拍板） |

---

## 違規處置

領單時把違規項列出，問 user：

1. **修正 plan 後再領單**（推薦）— 改完 plan 重跑領單流程
2. **接受違規硬領** — 在 task log 加 `note: plan 違規 X 條接受硬領`
3. **取消領單**

`openQuestions` 違規例外：硬性阻擋，user 必須先拍板。

---

## 歷史

- **2026-05-25**：建檔（從 HonrySDK android `nowTasks/PLAN-RULES.md` 搬過來，改寫為 React/TS/Phaser/Zustand 語境）。
