export type TaskStatus = "design" | "active" | "review" | "done";
export type StepStatus = "todo" | "doing" | "done";
export type LogType = "note" | "progress" | "blocked" | "decision" | "user-note" | "review";

export interface Step {
  id: string;
  title: string;
  status: StepStatus;
}

export interface LogEntry {
  ts: string;
  type: LogType;
  msg: string;
}

export interface FigmaNode {
  label: string;
  fileKey: string;
  nodeId: string;
}

export interface Plan {
  goal: string;
  boundaryConditions?: string[];
  expectedDeliverables?: string[];
  steps: Step[];
  openQuestions?: string[];
  estimatedSize?: "S" | "M" | "L" | "XL";
  riskNotes?: string[];
  referenceFiles?: string[];
  figmaNodes?: FigmaNode[];
}

export interface Task {
  id: string;
  number?: string;
  title: string;
  ticket?: string | null;
  branch?: string | null;
  worktree?: string | null;
  status: TaskStatus;
  owner?: string;
  createdAt: string;
  updatedAt: string;
  lastReviewAt?: string;
  dependencies?: string[];
  plan: Plan;
  log: LogEntry[];
}

export interface WorktreeStatus {
  branch?: string;
  lastCommitSha?: string;
  lastCommitSubject?: string;
  error?: string;
}

export interface TaskWithRuntime extends Task {
  runtime?: {
    worktreeStatus?: WorktreeStatus;
  };
}
