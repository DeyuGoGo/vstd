import Link from "next/link";
import { GitBranch, GitCommit, ArrowUpRight, Clock, Hourglass } from "lucide-react";
import type { TaskWithRuntime } from "@/lib/types";
import { relativeTime, waitedDuration } from "@/lib/time";

export function TaskCard({ task }: { task: TaskWithRuntime }) {
  const total = task.plan.steps.length;
  const done = task.plan.steps.filter((s) => s.status === "done").length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const depsCount = task.dependencies?.length ?? 0;
  const branchLabel = task.runtime?.worktreeStatus?.branch ?? task.branch ?? null;
  const lastCommit = task.runtime?.worktreeStatus?.lastCommitSubject;
  const lastSha = task.runtime?.worktreeStatus?.lastCommitSha;

  const inReview = task.status === "review";
  const waited = inReview && task.lastReviewAt ? waitedDuration(task.lastReviewAt) : null;

  return (
    <Link
      href={`/task/${task.id}`}
      className={`relative block rounded-xl bg-[var(--color-card)] border p-4 shadow-card hover:shadow-card-hover transition-shadow ${
        inReview
          ? "border-[var(--color-status-review)] ring-2 ring-[var(--color-status-review)]/30"
          : "border-[var(--color-border)]"
      }`}
    >
      {inReview && (
        <span
          className="absolute -top-2 right-3 inline-flex items-center gap-1 rounded-full bg-[var(--color-status-review)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-card"
          title={task.lastReviewAt ? `等你自 ${new Date(task.lastReviewAt).toLocaleString()}` : "等你審查"}
        >
          <Hourglass size={10} />
          {waited ? `等你 ${waited}` : "等你"}
        </span>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-light)] font-medium">
          {task.number && (
            <span className="font-mono font-semibold text-[var(--color-accent-strong)]">
              {task.number}
            </span>
          )}
          {task.number && task.ticket && <span>·</span>}
          <span>{task.ticket ?? "—"}</span>
        </div>
        {depsCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-[var(--color-text-light)]">
            <ArrowUpRight size={12} />
            depends on {depsCount}
          </div>
        )}
      </div>

      <h3 className="mt-1.5 text-sm font-semibold leading-snug text-[var(--color-text)] line-clamp-2">
        {task.title}
      </h3>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-[var(--color-text-light)] mb-1.5">
          <span>{done}/{total} steps</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--color-muted)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--color-accent)]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {branchLabel && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--color-text-light)] truncate">
          <GitBranch size={12} className="shrink-0" />
          <span className="truncate font-mono">{branchLabel}</span>
        </div>
      )}

      {lastCommit && (
        <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-text-light)] truncate">
          <GitCommit size={12} className="shrink-0" />
          <span className="font-mono">{lastSha}</span>
          <span className="truncate">{lastCommit}</span>
        </div>
      )}

      <div className="mt-3 flex items-center gap-1 text-xs text-[var(--color-text-light)]">
        <Clock size={12} />
        {relativeTime(task.updatedAt)}
      </div>
    </Link>
  );
}
