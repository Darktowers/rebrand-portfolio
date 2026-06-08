# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout

This is a single-context repo.

Read these when they exist:

- `CONTEXT.md` at the repo root
- `docs/adr/` for architectural decisions relevant to the current work

If these files do not exist, proceed silently. Do not suggest creating them upfront. Producer skills such as `grill-with-docs` create them lazily when terms or decisions get resolved.

## Use the glossary vocabulary

When output names a domain concept in an issue title, refactor proposal, hypothesis, or test name, use the term as defined in `CONTEXT.md`.

If the concept needed is not in the glossary yet, either reconsider the language or note the gap for `grill-with-docs`.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly instead of silently overriding it.
