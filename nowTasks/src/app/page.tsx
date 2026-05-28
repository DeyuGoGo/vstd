import { listTasks } from "@/lib/tasks";
import { KanbanColumn } from "@/components/KanbanColumn";
import type { TaskStatus } from "@/lib/types";

const STATUSES: TaskStatus[] = ["design", "active", "review", "done"];

export const dynamic = "force-dynamic";

export default async function Home() {
  const tasks = await listTasks();
  const grouped = Object.fromEntries(
    STATUSES.map((s) => [s, tasks.filter((t) => t.status === s)]),
  ) as Record<TaskStatus, typeof tasks>;

  return (
    <main className="mx-auto max-w-[1600px] px-6 py-8">
      <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            nowTasks
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-light)]">
            vstd — session / worktree dashboard
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {STATUSES.map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <span className="text-[var(--color-text-light)] capitalize">{s}</span>
              <span className="font-mono font-semibold text-[var(--color-text)]">
                {grouped[s].length}
              </span>
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {STATUSES.map((s) => (
          <KanbanColumn key={s} status={s} tasks={grouped[s]} />
        ))}
      </div>
    </main>
  );
}
