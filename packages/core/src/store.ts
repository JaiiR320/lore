import { join } from "node:path";
import type { Task } from "./types.ts";

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function readTasks(lorePath: string): Promise<Task[]> {
  const file = Bun.file(join(lorePath, "tasks.json"));
  if (!(await file.exists())) return [];
  return file.json();
}

export async function writeTasks(lorePath: string, tasks: Task[]): Promise<void> {
  await Bun.write(join(lorePath, "tasks.json"), JSON.stringify(tasks, null, 2));
}

export function findTask(tasks: Task[], taskId: string): Task {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) throw new Error(`Task with id "${taskId}" not found`);
  return task;
}
