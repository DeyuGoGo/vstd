import type { TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const LABEL: Record<TaskStatus, string> = {
  design: "Design",
  active: "Active",
  review: "Review",
  done: "Done",
};

const COLOR: Record<TaskStatus, string> = {
  design: "bg-[var(--color-status-design-bg)] text-[var(--color-status-design)]",
  active: "bg-[var(--color-status-active-bg)] text-[var(--color-status-active)]",
  review: "bg-[var(--color-status-review-bg)] text-[var(--color-status-review)]",
  done: "bg-[var(--color-status-done-bg)] text-[var(--color-status-done)]",
};

export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide",
        COLOR[status],
        className,
      )}
    >
      {LABEL[status]}
    </span>
  );
}
