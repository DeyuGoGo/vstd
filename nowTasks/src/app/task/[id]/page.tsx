import Link from "next/link";
import { notFound } from "next/navigation";
import { getTask, listTasks } from "@/lib/tasks";
import { StatusBadge } from "@/components/StatusBadge";
import { CommentForm } from "@/components/CommentForm";
import { relativeTime } from "@/lib/time";
import {
  ArrowLeft,
  GitBranch,
  GitCommit,
  Folder,
  CheckCircle2,
  Circle,
  Loader2,
  AlertTriangle,
  FileCode,
  ImageIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

const STEP_ICON = {
  todo: <Circle size={14} className="text-[var(--color-text-light)]" />,
  doing: <Loader2 size={14} className="text-[var(--color-status-active)]" />,
  done: <CheckCircle2 size={14} className="text-[var(--color-status-active)]" />,
} as const;

export default async function TaskDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = await getTask(id);
  if (!task) notFound();

  const all = await listTasks();
  const depTasks = (task.dependencies ?? [])
    .map((dId) => all.find((t) => t.id === dId))
    .filter(Boolean);

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-light)] hover:text-[var(--color-text)] mb-6"
      >
        <ArrowLeft size={14} />
        Back to board
      </Link>

      <header className="mb-6">
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-light)] mb-2">
          {task.number && (
            <span className="font-mono font-bold text-[var(--color-accent-strong)] text-sm">
              {task.number}
            </span>
          )}
          <span className="font-medium">{task.ticket ?? "—"}</span>
          <StatusBadge status={task.status} />
          {task.plan.estimatedSize && (
            <span className="rounded-md bg-[var(--color-muted)] px-2 py-0.5 font-mono text-[var(--color-text)]">
              {task.plan.estimatedSize}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
          {task.title}
        </h1>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[var(--color-text-light)]">
          {task.branch && (
            <span className="inline-flex items-center gap-1.5 font-mono">
              <GitBranch size={12} />
              {task.branch}
            </span>
          )}
          {task.runtime?.worktreeStatus?.lastCommitSha && (
            <span className="inline-flex items-center gap-1.5 font-mono">
              <GitCommit size={12} />
              {task.runtime.worktreeStatus.lastCommitSha}{" "}
              {task.runtime.worktreeStatus.lastCommitSubject}
            </span>
          )}
          {task.worktree && (
            <span className="inline-flex items-center gap-1.5 font-mono">
              <Folder size={12} />
              {task.worktree}
            </span>
          )}
          <span>updated {relativeTime(task.updatedAt)}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Goal">
            <p className="text-sm leading-relaxed text-[var(--color-text)]">
              {task.plan.goal}
            </p>
          </Section>

          {!!task.plan.boundaryConditions?.length && (
            <Section title="Boundary conditions">
              <ul className="space-y-1.5 text-sm">
                {task.plan.boundaryConditions.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[var(--color-text-light)] shrink-0">•</span>
                    <span className="text-[var(--color-text)]">{b}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {!!task.plan.expectedDeliverables?.length && (
            <Section title="Expected deliverables">
              <ul className="space-y-1.5 text-sm">
                {task.plan.expectedDeliverables.map((d, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[var(--color-text-light)] shrink-0">•</span>
                    <span className="text-[var(--color-text)] font-mono text-xs leading-relaxed">
                      {d}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {!!task.plan.openQuestions?.length && (
            <Section title="Open questions" icon={<AlertTriangle size={14} />}>
              <ol className="space-y-2 text-sm">
                {task.plan.openQuestions.map((q, i) => (
                  <li
                    key={i}
                    className="rounded-md bg-[var(--color-muted)] px-3 py-2 text-[var(--color-text)]"
                  >
                    {q}
                  </li>
                ))}
              </ol>
            </Section>
          )}

          <Section title="Steps">
            <ol className="space-y-1.5">
              {task.plan.steps.map((step) => (
                <li
                  key={step.id}
                  className="flex items-center gap-2.5 text-sm py-1"
                >
                  {STEP_ICON[step.status]}
                  <span className="font-mono text-xs text-[var(--color-text-light)]">
                    {step.id}
                  </span>
                  <span
                    className={
                      step.status === "done"
                        ? "text-[var(--color-text-light)] line-through"
                        : "text-[var(--color-text)]"
                    }
                  >
                    {step.title}
                  </span>
                </li>
              ))}
            </ol>
          </Section>
        </div>

        <aside className="space-y-6">
          {depTasks.length > 0 && (
            <Section title="Dependencies">
              <ul className="space-y-2">
                {depTasks.map((t) => t && (
                  <li key={t.id}>
                    <Link
                      href={`/task/${t.id}`}
                      className="block rounded-md border border-[var(--color-border)] p-2.5 hover:bg-[var(--color-muted)] transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-light)]">
                        <StatusBadge status={t.status} />
                      </div>
                      <div className="mt-1 text-sm font-medium text-[var(--color-text)]">
                        {t.title}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {!!task.plan.riskNotes?.length && (
            <Section title="Risk notes">
              <ul className="space-y-1.5 text-xs">
                {task.plan.riskNotes.map((r, i) => (
                  <li key={i} className="text-[var(--color-text)]">
                    ⚠ {r}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {!!task.plan.referenceFiles?.length && (
            <Section title="Reference files" icon={<FileCode size={14} />}>
              <ul className="space-y-1 text-xs font-mono">
                {task.plan.referenceFiles.map((f, i) => (
                  <li
                    key={i}
                    className="text-[var(--color-text-light)] break-all"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {!!task.plan.figmaNodes?.length && (
            <Section title="Figma" icon={<ImageIcon size={14} />}>
              <ul className="space-y-1.5 text-xs">
                {task.plan.figmaNodes.map((n, i) => (
                  <li key={i}>
                    <a
                      href={`https://www.figma.com/design/${n.fileKey}?node-id=${n.nodeId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--color-text)] underline hover:text-[var(--color-status-design)]"
                    >
                      {n.label}
                    </a>
                    <span className="ml-2 font-mono text-[var(--color-text-light)]">
                      {n.nodeId}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </aside>
      </div>

      <div className="mt-8">
        <CommentForm taskId={task.id} status={task.status} />
      </div>

      <Section title="Log" className="mt-6">
        <ul className="space-y-1.5 text-sm">
          {task.log.map((l, i) => (
            <li key={i} className="flex gap-3">
              <span
                className={`text-xs font-mono shrink-0 w-20 ${
                  l.type === "review"
                    ? "text-[var(--color-status-review)] font-semibold"
                    : l.type === "user-note"
                    ? "text-[var(--color-accent-strong)] font-semibold"
                    : l.type === "decision"
                    ? "text-[var(--color-status-active)] font-semibold"
                    : "text-[var(--color-text-light)]"
                }`}
              >
                {l.type}
              </span>
              <span className="text-xs text-[var(--color-text-light)] font-mono shrink-0 w-32">
                {relativeTime(l.ts)}
              </span>
              <span className="text-[var(--color-text)] whitespace-pre-wrap">{l.msg}</span>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
  icon,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] p-5 shadow-card ${className}`}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-light)] mb-3 flex items-center gap-1.5">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}
