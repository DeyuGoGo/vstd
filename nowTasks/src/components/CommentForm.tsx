"use client";

import { useState, useTransition } from "react";
import { Send, Loader2, AlertCircle, CheckCircle2, MessageSquareReply } from "lucide-react";
import { addLogEntry, submitReview } from "@/app/task/[id]/actions";
import type { TaskStatus } from "@/lib/types";

type FeedbackState =
  | { kind: "idle" }
  | { kind: "ok"; mode: "note" | "review" }
  | { kind: "err"; msg: string };

export function CommentForm({ taskId, status }: { taskId: string; status: TaskStatus }) {
  const [msg, setMsg] = useState("");
  const [pending, startTransition] = useTransition();
  const [fb, setFb] = useState<FeedbackState>({ kind: "idle" });

  const reviewable = status === "active" || status === "review";

  function run(mode: "note" | "review") {
    if (!msg.trim() || pending) return;
    setFb({ kind: "idle" });
    startTransition(async () => {
      const res =
        mode === "review"
          ? await submitReview(taskId, msg)
          : await addLogEntry(taskId, msg);
      if (res.ok) {
        setMsg("");
        setFb({ kind: "ok", mode });
        setTimeout(() => setFb({ kind: "idle" }), 2400);
      } else {
        setFb({ kind: "err", msg: res.error ?? "unknown error" });
      }
    });
  }

  return (
    <section className="rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] p-5 shadow-card">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-light)] mb-3">
        給 AI 留言（拍板 / 補需求 / 修正）
      </h3>

      <textarea
        rows={4}
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            run(reviewable ? "review" : "note");
          }
        }}
        placeholder={
          reviewable
            ? "送出 Review 會翻 status=active，AI loop 會接著處理。Cmd/Ctrl+Enter = 送出 Review。"
            : "例如：Q3 拍板，戰鬥場直接用既有 Battle.tsx 結構。Cmd/Ctrl+Enter 送出留言。"
        }
        className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 focus:border-[var(--color-accent)] resize-y min-h-[100px]"
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="text-xs">
          {fb.kind === "ok" && (
            <span className="inline-flex items-center gap-1 text-[var(--color-status-active)]">
              <CheckCircle2 size={14} />
              {fb.mode === "review" ? "Review 已送出，AI 接手" : "已加入 log"}
            </span>
          )}
          {fb.kind === "err" && (
            <span className="inline-flex items-center gap-1 text-red-600">
              <AlertCircle size={14} /> {fb.msg}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => run("note")}
            disabled={!msg.trim() || pending}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-muted)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="只寫進 log，不翻狀態"
          >
            {pending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            留言
          </button>

          {reviewable && (
            <button
              onClick={() => run("review")}
              disabled={!msg.trim() || pending}
              className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-status-review)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="送出 Review，翻 status=active，AI loop 會接著做"
            >
              {pending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <MessageSquareReply size={14} />
              )}
              送出 Review
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
