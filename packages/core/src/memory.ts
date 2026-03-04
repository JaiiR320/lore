import { join } from "node:path";
import { slugify, readTasks, writeTasks, findTask } from "./store.ts";

export async function getMemory(lorePath: string, taskId: string): Promise<string> {
  const tasks = await readTasks(lorePath);
  const task = findTask(tasks, taskId);

  const memoryFile = Bun.file(join(lorePath, "memory", `${slugify(task.name)}.md`));
  if (!(await memoryFile.exists())) return "";
  return memoryFile.text();
}

export async function appendMemory(lorePath: string, taskId: string, content: string): Promise<void> {
  const tasks = await readTasks(lorePath);
  const task = findTask(tasks, taskId);

  const memoryPath = join(lorePath, "memory", `${slugify(task.name)}.md`);
  const memoryFile = Bun.file(memoryPath);

  const existing = (await memoryFile.exists()) ? await memoryFile.text() : "";
  const timestamp = new Date().toISOString();
  const entry = `${existing ? existing + "\n" : ""}## ${timestamp}\n\n${content}\n`;

  await Bun.write(memoryPath, entry);

  // Update task's updatedAt
  task.updatedAt = new Date().toISOString();
  await writeTasks(lorePath, tasks);
}
