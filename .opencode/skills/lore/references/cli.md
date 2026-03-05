# Lore CLI Commands

Run commands with `bun packages/cli/index.ts <command>` from the repo root.

## Commands

```
lore init                     # Initialize .lore/ in current directory
lore create <name>            # Create a new tome
lore list                     # List all tomes
lore show <name>              # Show tome entries
lore write <name> <content>   # Append an entry to a tome
lore tags <name>              # List all tags in a tome
lore delete <name>            # Delete a tome
```

## Examples

```bash
# Create a tome
bun packages/cli/index.ts create "auth"

# Write a typed, tagged entry
bun packages/cli/index.ts write "auth" "Using JWT over session cookies for stateless auth"

# Show all entries
bun packages/cli/index.ts show "auth"

# List tags in a tome
bun packages/cli/index.ts tags "auth"

# List tomes
bun packages/cli/index.ts list
```
