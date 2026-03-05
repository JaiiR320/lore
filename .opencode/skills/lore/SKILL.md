---
name: lore
description: Persistent context for agentic coding sessions, organized into tomes. Use whenever the user mentions "lore" in any context — e.g. "read the lore on X", "what's the lore", "check lore", "lore on auth", "update the lore". Also triggers on "continue tome", "resume", "pick up where I left off", "what was I working on".
---

# Lore

Tomes are scoped units of context that persist across agent sessions. Each tome is a named collection of typed, tagged entries — decisions, patterns, mistakes, progress notes, references, and open questions.

## Entry Types

Every entry has a type. Use the right one:

- **decision** — a choice between alternatives, with reasoning ("chose JWT over sessions because...")
- **progress** — work completed, status update ("login endpoint done, tests passing")
- **pattern** — a convention, rule, or recurring approach ("all API routes follow /api/v1/{resource}")
- **mistake** — something that failed or should be avoided ("don't use dayjs, we standardized on date-fns")
- **reference** — where something lives, how to find it ("payments module is in src/billing/")
- **question** — unresolved, needs human input ("should we split the monolith?")

## Loading a Tome

1. List all tomes to find what's available
2. Match the user's request to a tome by name. If ambiguous, show the user the available tomes and ask which one
3. Use the `tags` tool first to see what tags exist in the tome
4. Load entries using filters appropriate to the task:
   - For general context: filter by types `decision`, `pattern`, `mistake`
   - For catching up on recent work: use `last: 5` or filter by type `progress`
   - For a specific topic: filter by relevant `tags`
   - For project navigation: filter by type `reference`
   - For open items: filter by type `question`
5. Do NOT dump all entries. Use filters to load only what's relevant.
6. Say "Lore loaded for [tome-name]." and wait for the user's next instruction

## Writing to a Tome

Append an entry to a tome when:
- A meaningful chunk of work is completed
- Important architectural or design decisions are made
- A convention or pattern is established
- Something doesn't work and should be avoided
- The session is ending and there's context the next session should know
- The user explicitly asks to save/update lore

Always classify the entry with the correct type and add relevant tags. Tags are how future sessions find this entry — choose tags that someone searching for this knowledge would use.

## No Match Found

If no tome matches, say so and show the list of available tomes. Do not create new tomes unless the user asks.

## Transport

Use the MCP tools if the `lore_list` tool is available. See [references/mcp.md](references/mcp.md) for tool details.

Otherwise, fall back to CLI commands. See [references/cli.md](references/cli.md) for command details.
