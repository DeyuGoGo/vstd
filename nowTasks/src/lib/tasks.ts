import { promises as fs } from "node:fs";
import path from "node:path";
import type { Task, TaskWithRuntime, WorktreeStatus } from "./types";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileP = promisify(execFile);

const TASKS_DIR = path.join(process.cwd(), "data", "tasks");

export async function listTasks(): Promise<TaskWithRuntime[]> {
  let files: string[];
  try {
    files = await fs.readdir(TASKS_DIR);
  } catch {
    return [];
  }

  const jsonFiles = files.filter((f) => f.endsWith(".json"));
  const tasks: TaskWithRuntime[] = [];

  for (const file of jsonFiles) {
    const full = path.join(TASKS_DIR, file);
    try {
      const raw = await fs.readFile(full, "utf-8");
      const task = JSON.parse(raw) as Task;
      const runtime = task.worktree
        ? { worktreeStatus: await getWorktreeStatus(task.worktree) }
        : undefined;
      tasks.push({ ...task, runtime });
    } catch (e) {
      console.error(`failed to parse ${file}:`, e);
    }
  }

  tasks.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return tasks;
}

export async function getTask(id: string): Promise<TaskWithRuntime | null> {
  const safe = id.replace(/[^a-zA-Z0-9._-]/g, "");
  const full = path.join(TASKS_DIR, `${safe}.json`);
  try {
    const raw = await fs.readFile(full, "utf-8");
    const task = JSON.parse(raw) as Task;
    const runtime = task.worktree
      ? { worktreeStatus: await getWorktreeStatus(task.worktree) }
      : undefined;
    return { ...task, runtime };
  } catch {
    return null;
  }
}

async function getWorktreeStatus(worktree: string): Promise<WorktreeStatus> {
  try {
    const { stdout: branchOut } = await execFileP("git", [
      "-C",
      worktree,
      "rev-parse",
      "--abbrev-ref",
      "HEAD",
    ]);
    const { stdout: logOut } = await execFileP("git", [
      "-C",
      worktree,
      "log",
      "-1",
      "--format=%h %s",
    ]);
    const log = logOut.trim();
    const sp = log.indexOf(" ");
    return {
      branch: branchOut.trim(),
      lastCommitSha: sp >= 0 ? log.slice(0, sp) : log,
      lastCommitSubject: sp >= 0 ? log.slice(sp + 1) : undefined,
    };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "git failed" };
  }
}
