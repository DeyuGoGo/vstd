import type { TaskWithRuntime, TaskStatus } from "@/lib/types";
import { TaskCard } from "./TaskCard";

const TITLE: Record<TaskStatus, string> = {
  design: "Design",
  active: "Active",
  review: "Review",
  done: "Done",
};

const ACCENT: Record<TaskStatus, string> = {
  design: "border-[var(--color-status-design)]",
  active: "border-[var(--color-status-active)]",
  review: "border-[var(--color-status-review)]",
  done: "border-[var(--color-status-done)]",
};

export function KanbanColumn({
  status,
  tasks,
}: {
  status: TaskStatus;
  tasks: TaskWithRuntime[];
}) {
  return (
    <div className="flex flex-col min-w-0">
      <div
        className={`mb-3 flex items-center justify-between border-l-4 pl-2.5 py-1 ${ACCENT[status]}`}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
          {TITLE[status]}
        </h2>
        <span className="text-xs text-[var(--color-text-light)] font-medium">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] p-4 text-center text-xs text-[var(--color-text-light)]">
            empty
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
