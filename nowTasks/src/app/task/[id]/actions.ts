"use server";

import { revalidatePath } from "next/cache";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Task, LogType } from "@/lib/types";

const TASKS_DIR = path.join(process.cwd(), "data", "tasks");

async function loadTask(taskId: string) {
  const safe = taskId.replace(/[^a-zA-Z0-9._-]/g, "");
  if (!safe) return { ok: false as const, error: "invalid id" };
  const file = path.join(TASKS_DIR, `${safe}.json`);

  let raw: string;
  try {
    raw = await fs.readFile(file, "utf-8");
  } catch {
    return { ok: false as const, error: "task not found" };
  }

  let task: Task;
  try {
    task = JSON.parse(raw) as Task;
  } catch (e) {
    return { ok: false as const, error: `parse failed: ${(e as Error).message}` };
  }

  return { ok: true as const, task, file, safe };
}

async function saveTask(file: string, safe: string, task: Task) {
  await fs.writeFile(file, JSON.stringify(task, null, 2) + "\n", "utf-8");
  revalidatePath(`/task/${safe}`);
  revalidatePath("/");
}

export async function addLogEntry(taskId: string, msg: string) {
  const trimmed = msg.trim();
  if (!trimmed) return { ok: false, error: "empty" };

  const loaded = await loadTask(taskId);
  if (!loaded.ok) return loaded;
  const { task, file, safe } = loaded;

  const now = new Date().toISOString();
  task.log = [
    ...(task.log ?? []),
    { ts: now, type: "user-note" as LogType, msg: trimmed },
  ];
  task.updatedAt = now;

  await saveTask(file, safe, task);
  return { ok: true };
}

/**
 * 送出 review feedback：寫 review log + 翻 status=active + 清 lastReviewAt。
 * AI 的 /loop 看到 status=active 且 log 最新一條 type=review 晚於上次處理時間 → 接著做。
 */
export async function submitReview(taskId: string, msg: string) {
  const trimmed = msg.trim();
  if (!trimmed) return { ok: false, error: "empty" };

  const loaded = await loadTask(taskId);
  if (!loaded.ok) return loaded;
  const { task, file, safe } = loaded;

  const now = new Date().toISOString();
  task.log = [
    ...(task.log ?? []),
    { ts: now, type: "review" as LogType, msg: trimmed },
  ];
  task.status = "active";
  task.lastReviewAt = undefined;
  task.updatedAt = now;

  await saveTask(file, safe, task);
  return { ok: true };
}
