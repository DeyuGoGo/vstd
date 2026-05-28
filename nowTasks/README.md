# nowTasks — vstd 任務看板

一個小型 Next.js 15 看板，把 `data/tasks/T-*.json` 渲染成 4 欄 Kanban（design / active / review / done）。

## 啟動

```bash
cd nowTasks
npm install
npm run dev          # http://localhost:4500
```

Port 固定 4500（package.json scripts 寫死），跟 vstd 主 app 的 Vite（預設 5173）不衝突。

## 目錄結構

```
nowTasks/
├── data/tasks/T-*.json       # 任務資料（一單一檔）
├── src/
│   ├── app/
│   │   ├── page.tsx          # Kanban 主頁
│   │   ├── task/[id]/        # 任務詳情頁 + server actions（留言 / 送 review）
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/           # KanbanColumn / TaskCard / StatusBadge / CommentForm
│   └── lib/
│       ├── tasks.ts          # 讀 task JSON + worktree git 狀態
│       ├── types.ts          # Task / Plan / LogEntry 型別
│       ├── time.ts           # 相對時間 / 等待時間
│       └── utils.ts          # cn (tailwind-merge)
├── PLAN-RULES.md             # plan 區塊寫作規範
└── README.md                 # 本檔
```

## 任務資料模型

`data/tasks/T-NNN-slug.json` 結構：

```json
{
  "id": "T-001-swordsman-integration",
  "number": "T-001",
  "title": "劍士整合進 roster",
  "ticket": null,
  "branch": "feat/swordsman-roster",
  "worktree": null,
  "status": "design",
  "createdAt": "2026-05-25T16:00:00+08:00",
  "updatedAt": "2026-05-25T16:00:00+08:00",
  "dependencies": [],
  "plan": {
    "goal": "玩家進 roster 看到劍士卡片，編入 slot 1 戰鬥可顯示 4 圖層 sprite",
    "boundaryConditions": ["..."],
    "preflightChecks": ["..."],
    "expectedDeliverables": ["..."],
    "steps": [
      { "id": "s1", "title": "勘查：...", "status": "todo" }
    ],
    "openQuestions": [],
    "estimatedSize": "M",
    "riskNotes": ["..."],
    "referenceFiles": ["app/src/characters/swordsman.ts"],
    "figmaNodes": []
  },
  "log": [
    { "ts": "2026-05-25T16:00:00+08:00", "type": "note", "msg": "task 開立" }
  ]
}
```

完整型別見 `src/lib/types.ts`。Plan 寫作規範見 `PLAN-RULES.md`。

## 狀態 lifecycle

```
design → active → review → done
              ↑       ↓
              └───────┘  (review 不通過退回 active)
```

- **design**：plan 寫作中，未拍板
- **active**：plan 拍板，AI/實作者開工中
- **review**：實作完成，等 user 審查
- **done**：merged / closed

看板上 `review` 卡片會跳 ⏳ 等你 badge，點進詳情頁可以「送出 Review」（翻 status=active，AI loop 接著做）或「留言」（只寫 log，不翻 status）。

## 與 `memory-bank/` 的關係

| 工具 | 角色 |
|------|------|
| `nowTasks/` | 進行中任務的看板（活的、機械化、有狀態） |
| `nowTasks/PLAN-RULES.md` | plan 區塊怎麼寫的規範 |
| `memory-bank/feature-execution-template.md` | 執行流程 P1-P8（怎麼做、怎麼驗） |
| `memory-bank/specs/SPEC_TEMPLATE.md` | 寫 spec（要做什麼）的範本 |

任務小：直接寫 task JSON。
任務大（跨多 feature、需要設計討論）：先寫 spec → 再拆 task。
