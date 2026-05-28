# memory-bank — vstd 知識與規範庫

長期保留的開發規範、設計決策、執行流程。跟 `nowTasks/`（任務看板）的差異：

| 工具 | 角色 | 例子 |
|------|------|------|
| `nowTasks/` | 進行中任務的看板（活的、有狀態） | T-001 劍士整合中 |
| `memory-bank/` | 跨任務的長期文件（半死的、規範性） | feature 執行流程、spec 範本 |

## 檔案

| 檔案 | 用途 |
|------|------|
| `feature-execution-template.md` | 執行 feature 的 P1-P8 流程 + Harness Guardrail（G1-G17） |
| `specs/SPEC_TEMPLATE.md` | 寫 feature spec 的範本（六大要素） |
| `specs/<feature>.md` | 具體 feature 的 spec（凍結版本） |

## 何時用 spec？

- **小修改 / bug fix**：直接寫一張 nowTasks task，不用寫 spec
- **大功能（跨多 task、需要設計討論）**：先寫 spec → 拍板 → 拆 task
- **歷史決策需要保留**：寫 spec 的 `Prior Decisions` 段，避免之後回頭推翻

## 何時用 feature-execution-template？

每個 spec 從 P1 跑到 P8 一次。流程偏重的細節：
- 子任務拆解（G1-G3）
- 凍結機制（P2 後不可擅自加工）
- 驗證迴圈（P7 上限 3 輪，循環偵測）
- 熵管理（每個 feature 完成後掃描 drift）

---

## 跟 HonrySDK 那邊的差異

memory-bank 原本是給 HonrySDK Android SDK 用的（多平台、有 Jira、有 Figma、有模擬器、有 Compose）。vstd 是 solo 小遊戲，所以：

- **去掉的**：Jira / Figma 整合、emulator capture、Codex 外部審查、strings.xml i18n、iOS/Unity 跨平台
- **保留的**：harness guardrail（G1-G17）、P1-P8 流程框架、spec 六大要素

如果未來 vstd 變大需要這些東西，可以回去 HonrySDK 抄回來。
