---
name: lore
description: Persistent context for agentic coding sessions, organized into tomes. Use whenever the user mentions "lore" in any context — e.g. "read the lore on X", "what's the lore", "check lore", "lore on auth", "update the lore". Also triggers on "continue tome", "resume", "pick up where I left off", "what was I working on".
---

# Lore

Tomes are scoped units of context that persist across agent sessions. Each tome accumulates entries as work progresses — decisions made, progress notes, architectural context. Lore is the collection of all tomes.

## Loading a Tome

1. List all tomes to find what's available
2. Match the user's request to a tome by name. If ambiguous, show the user the available tomes and ask which one
3. Load the matched tome's details and entries
4. Use the loaded entries as context for the session — treat it as ground truth for the tome
5. Do NOT output the tome contents. Just say "Lore loaded for [tome-name]." and wait for the user's next instruction

## Writing to a Tome

Append a timestamped entry to a tome.

Write to a tome when:
- A meaningful chunk of work is completed
- Important architectural or design decisions are made
- The session is ending and there's context the next session should know
- The user explicitly asks to save/update lore

## No Match Found

If no tome matches, say so and show the list of available tomes. Do not create new tomes unless the user asks.

## Transport

Use the MCP tools if the `lore_list` tool is available. See [references/mcp.md](references/mcp.md) for tool details.

Otherwise, fall back to CLI commands. See [references/cli.md](references/cli.md) for command details.
