# Plan 003: Remove tracked local Claude settings

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report. When done, update the status row for this plan in `plans/README.md`
> unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 6a24769..HEAD -- .claude .gitignore biome.json CLAUDE.md AGENTS.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: `plans/002-verification-baseline.md`
- **Category**: dx
- **Planned at**: commit `6a24769`, 2026-06-20

## Why this matters

`.claude/settings.local.json` is tracked and contains broad local command
permissions, machine-specific paths, and previous workflow commands. It causes
formatting noise and exposes local automation policy that should not be shared
as project source. The repo should keep portable agent guidance in `AGENTS.md`
and `CLAUDE.md`, while local settings stay ignored.

## Current state

- `git ls-files .claude` shows both `.claude/launch.json` and `.claude/settings.local.json` tracked.
- `.gitignore` ignores build, env, and TypeScript artifacts, but does not ignore `.claude/*.local.json`.
- `AGENTS.md` and `CLAUDE.md` already contain portable project instructions.

Current excerpts:

```json
// .claude/settings.local.json:1
{
  "permissions": {
    "allow": [
      "Bash(gh repo:*)",
      "Bash(gh api:*)",
      "WebFetch(domain:api.github.com)",
      ...
    ]
  }
}
```

```gitignore
// .gitignore:23
# misc
.DS_Store
*.pem
```

```markdown
// AGENTS.md:1
# This is NOT the Next.js you know
...
Issues and PRDs live in GitHub Issues for `Darktowers/rebrand-portfolio`.
```

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Check tracked local files | `git ls-files .claude` | shows current tracked files |
| Stop tracking local settings | `git rm --cached .claude/settings.local.json` | exit 0; file remains in worktree |
| Verify ignore | `git check-ignore -v .claude/settings.local.json` | prints matching ignore rule |
| Full verify | `npm run verify` | exit 0 |

## Scope

**In scope**:

- `.gitignore`
- Git index entry for `.claude/settings.local.json`
- Optionally `CLAUDE.md` or `AGENTS.md` only if a portable note needs to replace a lost project instruction

**Out of scope**:

- Deleting the user's local `.claude/settings.local.json` from disk.
- Editing allowed command lists inside local settings.
- Removing `.claude/launch.json` unless the user explicitly asks; it may be a portable launch config.

## Git workflow

- Branch: `codex/003-remove-tracked-local-claude-settings`
- Suggested commit message: `Stop tracking local Claude settings`.
- Do not push or open a PR unless the operator instructs it.

## Steps

### Step 1: Add an ignore rule for local Claude settings

Add this rule to `.gitignore` under the misc or debug section:

```gitignore
.claude/*.local.json
```

Do not ignore all of `.claude/`; `.claude/launch.json` is currently tracked and may be intentionally shared.

**Verify**: `git check-ignore -v .claude/settings.local.json` -> prints the `.gitignore` rule you added.

### Step 2: Remove the local settings file from the Git index only

Run:

```powershell
git rm --cached .claude/settings.local.json
```

This must not delete the user's local file from disk.

**Verify**: `Test-Path .claude/settings.local.json` -> prints `True`.

### Step 3: Ensure portable instructions remain portable

Read `AGENTS.md` and `CLAUDE.md`. If `.claude/settings.local.json` contained any project-level instruction that is not already represented there, add a short portable note to `CLAUDE.md`. Do not copy local command allowlists or machine paths.

**Verify**: `git diff -- .claude/settings.local.json .gitignore CLAUDE.md AGENTS.md` -> shows the file removed from tracking, the ignore rule, and no copied permission values.

### Step 4: Run the baseline

Run:

```powershell
npm run verify
```

Expected result: exit 0.

## Test plan

No new tests are required. This is repository hygiene. Verification is ignore
behavior plus the full baseline.

## Done criteria

- [ ] `.claude/settings.local.json` is removed from Git tracking.
- [ ] `.claude/settings.local.json` still exists locally after `git rm --cached`.
- [ ] `.gitignore` ignores `.claude/*.local.json`.
- [ ] No local permission values or machine paths are copied into docs.
- [ ] `npm run verify` exits 0.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report if:

- `.claude/settings.local.json` is already untracked and absent from the worktree.
- The operator wants `.claude/settings.local.json` committed intentionally.
- Removing the file from tracking would also remove a project-level instruction not present in `AGENTS.md` or `CLAUDE.md`.

## Maintenance notes

Reviewers should ensure this PR does not delete the user's local settings file
from disk and does not replace it with a sanitized but still local policy file.
