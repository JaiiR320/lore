# ⏳lore — Task-Scoped Memory for Agentic Coding

Work in tasks not sessions. Your agents pick up where they left off.

## The Problem

Agent sessions are stateless. Work on a feature, close session, open new one — agent knows nothing. Lore makes **tasks** the unit of work, accumulates memory across sessions, gives each task an isolated worktree.

## What It Is

CLI starts local web app. Create a task → get a worktree + branch. Agents attach, save memory as they work. Next session reads memory and continues. Done → merge back.

## Stack

**Phase 1:** TypeScript · Bun · simple-git
**Phase 2+:** TanStack Start · Hono · SQLite + Drizzle · Radix + Tailwind · MCP SDK

```
lore/
  packages/
    core/       # Phase 1 — logic, data, git worktrees
    cli/        # Phase 1 — thin CLI calling core functions
    web/        # Phase 2 — TanStack Start UI
    server/     # Phase 2 — Hono REST API + SQLite (imports core)
```

## Data (Phase 1)

All state lives in `.lore/` in the project repo (gitignored).

```
.lore/
  tasks.json          # task list with metadata
  memory/
    oauth-login.md    # accumulated context per task
    fix-db-migrations.md
```

SQLite replaces JSON in Phase 2 when the web UI needs querying, filtering, and session relationships.

## Roadmap

### Phase 1 — Engine + CLI (Week 1-2)

Everything manual. No agent automation. Files are the interface.

- Core package: create_task, complete_task, add_memory, list_tasks, etc.
- Data layer: read/write tasks.json + memory/*.md files
- Creating a task creates git worktree + branch
- Completing a task merges branch, cleans up worktree
- `.lore/memory/<task>.md` written on memory updates
- Paste summarized conversations into memory docs to update
- CLI:
  - `lore init` — initialize lore in a repo
  - `lore create <title>` — create task + worktree
  - `lore list` — list tasks and statuses
  - `lore show <task>` — show task detail + memory
  - `lore memory <task> <content>` — add memory entry
  - `lore complete <task>` — merge worktree, mark done
- Agent gets context by reading `.lore/memory/*.md` files

### Phase 2 — Web UI (Week 3-4)

- Hono REST API wrapping core functions
- TanStack Start web app
- Task list + detail + memory editor
- CLI: `lore` (no args) starts server + web, opens browser

### Phase 3 — Agent Integration (Future)

- MCP server: get/create/complete tasks, save memory, attach sessions
- Session linking: connect agent sessions to tasks
- Auto-detect task from current worktree
- Session history with summaries per task
- Agent skill/plugin
- Automated triggers for .lore/ file projection

### Phase 4 — Intelligence (Future)

- Agent decides: find matching task or create new one
- Sub-tasks, agent decomposes work
- Parallel tasks: multiple worktrees, multiple agents
- Auto-spawn agent loops per task
- Blocking dependencies / DAG
- OpenCode DB integration for auto-summarization
- Kanban board view
- GitHub integrations

### Other ideas

- Processes, like tasks but more generic to different processes (like planning, refactoring, testing etc.)
  - give more context for these types of processes
