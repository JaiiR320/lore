---
name: lore
description: Task-scoped memory for agentic coding sessions. Use whenever the user mentions "lore" in any context — e.g. "read the lore on X", "what's the lore", "check lore", "lore on auth", "update the lore". Also triggers on "continue task", "resume", "pick up where I left off", "what was I working on".
---

# Lore

Task-scoped memory that persists across agent sessions.

## Loading Memory

1. List all tasks to find what's available
2. Match the user's request to a task by name. If ambiguous, show the user the available tasks and ask which one
3. Load the matched task's details and memory
4. Use the loaded memory as context for the session — treat it as ground truth for the task
5. Do NOT output the memory contents. Just say "Lore loaded for [task-name]." and wait for the user's next instruction

## Writing Memory

Append a timestamped memory entry to a task.

Write memory when:
- A meaningful chunk of work is completed
- Important architectural or design decisions are made
- The session is ending and there's context the next session should know
- The user explicitly asks to save/update lore

## No Match Found

If no task matches, say so and show the list of available tasks. Do not create new tasks unless the user asks.

## Transport

Use the MCP tools if the `lore_list` tool is available. See [references/mcp.md](references/mcp.md) for tool details.

Otherwise, fall back to CLI commands. See [references/cli.md](references/cli.md) for command details.
