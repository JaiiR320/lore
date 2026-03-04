# ⏳ lore — Persistent Context for Agentic Coding

Distill your knowledge into tomes, and use the lore to pick up where you left off and give your agents context it needs. 

## The Problem

Agent sessions are stateless. You work on a feature, close the session, open a new one — and the agent has no context of what you worked on previously. Lore makes **tomes** the unit of context, accumulating knowledge across sessions so agents can resume with full awareness.

## What It Is

A collection of tomes — scoped units of persistent context. Each tome captures decisions, progress, and architectural notes for a specific area of work. Agents read existing tomes to pick up context. As they work, they write entries back to the tome. Next session reads the tome and continues.

## Stack

**Phase 1:** TypeScript · Bun
**Phase 2+:** TanStack Start · Hono · SQLite + Drizzle · Radix + Tailwind · MCP SDK

```
lore/
  packages/
    core/       # Phase 1 — tome CRUD, read/write, storage
    cli/        # Phase 1 — thin CLI calling core functions
    mcp/        # Phase 1 — MCP server exposing tools
    web/        # Phase 2 — TanStack Start UI
    server/     # Phase 2 — Hono REST API + SQLite (imports core)
```

## Data (Phase 1)

All state lives in `.lore/` in the project repo (gitignored).

```
.lore/
  tomes.json          # tome list with metadata
  tomes/
    oauth-login.md    # accumulated context per tome
    fix-db-migrations.md
```

SQLite replaces JSON in Phase 2 when the web UI needs querying, filtering, and relationships.

## Roadmap

### Phase 1 — Engine + CLI + MCP (Week 1-2)

Everything manual. Files are the interface.

- Core package: `createTome`, `completeTome`, `writeTome`, `listTomes`, etc.
- Data layer: read/write `tomes.json` + `tomes/*.md` files
- `.lore/tomes/<tome>.md` written on updates
- CLI:
  - `lore init` — initialize lore in a repo
  - `lore create <name>` — create a new tome
  - `lore list` — list tomes and statuses
  - `lore show <name>` — show tome details + entries
  - `lore write <name> <content>` — append an entry to a tome
  - `lore complete <name>` — mark tome as completed
  - `lore delete <name>` — delete a tome
- MCP server exposing all operations as tools
- Agent skill for loading and writing to tomes

### Phase 2 — Web UI (Week 3-4)

- Hono REST API wrapping core functions
- TanStack Start web app
- Tome list + detail + entry editor
- CLI: `lore` (no args) starts server + web, opens browser

### Phase 3 — Agent Integration (Future)

- Session linking: connect agent sessions to tomes
- Auto-detect active tome from context
- Session history with summaries per tome
- Automated triggers for .lore/ file projection

### Phase 4 — Intelligence (Future)

- Agent decides: find matching tome or create new one
- Sub-tomes, agent decomposes work
- Parallel tomes: multiple agents working concurrently
- Auto-spawn agent loops per tome
- Blocking dependencies / DAG
- Auto-summarization from session history
- Kanban board view
- GitHub integrations

### Other ideas

- Processes — like tomes but more generic to different workflows (planning, refactoring, testing, etc.)
  - Give more context for these types of processes
