import { join } from "node:path";
import type { Task } from "./types.ts";
import { slugify, readTasks, writeTasks } from "./store.ts";

export async function getTask(lorePath: string, name: string): Promise<Task> {
  const tasks = await readTasks(lorePath);
  const slug = slugify(name);
  const task = tasks.find((t) => slugify(t.name) === slug);
  if (!task) throw new Error(`Task with name "${name}" not found`);
  return task;
}

export async function createTask(lorePath: string, name: string): Promise<Task> {
  const tasks = await readTasks(lorePath);
  const slug = slugify(name);

  if (tasks.some((t) => slugify(t.name) === slug)) {
    throw new Error(`Task with name "${name}" already exists`);
  }

  const now = new Date().toISOString();
  const task: Task = {
    id: crypto.randomUUID(),
    name,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(task);
  await writeTasks(lorePath, tasks);

  // Create empty memory file
  const memoryDir = join(lorePath, "memory");
  await Bun.write(join(memoryDir, `${slug}.md`), "");

  return task;
}

export async function listTasks(lorePath: string): Promise<Task[]> {
  return readTasks(lorePath);
}

export async function completeTask(lorePath: string, taskId: string): Promise<void> {
  const tasks = await readTasks(lorePath);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) throw new Error(`Task with id "${taskId}" not found`);

  task.status = "completed";
  task.updatedAt = new Date().toISOString();
  await writeTasks(lorePath, tasks);
}

export async function deleteTask(lorePath: string, taskId: string): Promise<void> {
  const tasks = await readTasks(lorePath);
  const index = tasks.findIndex((t) => t.id === taskId);

  if (index === -1) {
    throw new Error(`Task with id "${taskId}" not found`);
  }

  const task = tasks[index]!;
  tasks.splice(index, 1);
  await writeTasks(lorePath, tasks);

  // Delete memory file if it exists
  const memoryFile = join(lorePath, "memory", `${slugify(task.name)}.md`);
  const file = Bun.file(memoryFile);
  if (await file.exists()) {
    const { unlink } = await import("node:fs/promises");
    await unlink(memoryFile);
  }
}
