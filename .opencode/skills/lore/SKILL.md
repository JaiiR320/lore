---
name: lore
description: Task-scoped memory for agentic coding sessions. Use whenever the user mentions "lore" in any context — e.g. "read the lore on X", "what's the lore", "check lore", "lore on auth", "update the lore". Also triggers on "continue task", "resume", "pick up where I left off", "what was I working on". Read .lore/tasks.json to find matching tasks, then load the corresponding memory file from .lore/memory/ for accumulated context. Write back progress when work is done.
---

# Lore

Task-scoped memory that persists across agent sessions. Tasks and their memory live in `.lore/` at the project root.

## Loading Memory

1. Read `.lore/tasks.json` — it contains an array of tasks with `id`, `name`, `status`, `createdAt`, `updatedAt`
2. Match the user's request to a task by name. If ambiguous, show the user the available tasks and ask which one
3. Find the corresponding memory file in `.lore/memory/`. The filename is a slugified version of the task name (e.g. "Create CLI" -> `create-cli.md`). If the exact filename isn't obvious, list the files in `.lore/memory/` and pick the best match
4. Read the memory file. It contains timestamped entries of accumulated context — decisions, progress, blockers, architecture notes
5. Use the loaded memory as context for the session. This is what the previous agent sessions learned — treat it as ground truth for the task

## Writing Memory

When significant progress has been made on a task, append a new timestamped entry to the task's memory file:

```markdown
## <ISO timestamp>

<What was accomplished, key decisions made, things to pick up next>
```

Write memory when:
- A meaningful chunk of work is completed
- Important architectural or design decisions are made
- The session is ending and there's context the next session should know
- The user explicitly asks to save/update lore

## No Match Found

If no task in `tasks.json` matches what the user is describing, say so and list the available tasks. Do not create new tasks or memory files unless the user asks.
