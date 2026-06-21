# Plan 002: Restore a trustworthy verification baseline

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report. When done, update the status row for this plan in `plans/README.md`
> unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 6a24769..HEAD -- package.json package-lock.json biome.json .gitignore app components context data i18n .claude`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: `plans/001-patch-next-security.md`
- **Category**: tests
- **Planned at**: commit `6a24769`, 2026-06-20

## Why this matters

The repository has a TypeScript gate, but its only lint script currently fails
on formatting across many files. There is also no `test` script and no tracked
test files, despite recent churn in animation, routing, mobile behavior, and
contact CTAs. Because Next.js 16 no longer runs lint during `next build`, the
repo needs an explicit one-command verification baseline that catches format,
types, build, and at least a small set of behavior regressions.

## Current state

- `package.json` has `dev`, `build`, `start`, `lint`, and `format`, but no `typecheck` or `test`.
- `biome.json` has formatter and recommended linting enabled.
- `npm run lint -- --diagnostic-level=warn` failed during audit with 45 Biome errors, mostly formatting.
- `npx tsc --noEmit --pretty false` passed during audit.
- There are no tracked test files under app code.

Current excerpts:

```json
// package.json:5
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "biome check .",
  "format": "biome format --write ."
}
```

```json
// biome.json:3
"vcs": {
  "enabled": true,
  "clientKind": "git",
  "useIgnoreFile": true
},
"files": {
  "ignoreUnknown": false
}
```

```text
// audit command result
npx tsc --noEmit --pretty false -> exit 0
npm run lint -- --diagnostic-level=warn -> exit 1, Found 45 errors
```

Repo conventions to match:

- Package manager is npm, with `package-lock.json`.
- Formatting is Biome, tab indentation, double quotes.
- Next.js 16 docs in `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` say `next lint` was removed; use Biome or ESLint directly.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Format check | `npm run lint` | exit 0 |
| Format fix | `npm run format` | exit 0; source files formatted |
| Typecheck | `npx tsc --noEmit --pretty false` | exit 0, no output |
| Build | `npm run build` | exit 0 |
| Test | `npm test` | exit 0 after you add it |
| Full verify | `npm run verify` | exit 0 after you add it |

## Scope

**In scope**:

- `package.json`
- `package-lock.json` if a test dependency is added
- `biome.json` only if needed to exclude local-only files from checks
- Test files you create, preferably under a clearly named test folder or colocated as `*.test.ts`
- Source files touched only by formatting

**Out of scope**:

- Functional refactors of sections, background scenes, i18n, or contact behavior.
- Removing tracked `.claude/settings.local.json`; that is plan 003.
- WebGL runtime splitting; that is plan 004.

## Git workflow

- Branch: `codex/002-verification-baseline`
- Commit message style follows short imperative history. Suggested message: `Restore verification baseline`.
- Do not push or open a PR unless the operator instructs it.

## Steps

### Step 1: Add explicit verification scripts

Add scripts to `package.json`:

- `typecheck`: `tsc --noEmit --pretty false`
- `test`: choose the smallest appropriate runner for TypeScript logic tests, preferably Vitest.
- `verify`: run lint, typecheck, test, and build in that order.

If adding Vitest, install it as a dev dependency with npm. Keep the dependency change minimal.

**Verify**: `node -e "const s=require('./package.json').scripts; console.log(Boolean(s.typecheck), Boolean(s.test), Boolean(s.verify))"` -> prints `true true true`.

### Step 2: Fix the current Biome baseline

Run:

```powershell
npm run format
```

Then run:

```powershell
npm run lint
```

Expected result: `npm run lint` exits 0.

If `.claude/settings.local.json` remains tracked and keeps creating local-only formatting churn, do not delete it in this plan. Either format it with the rest of the repo or add a narrowly documented Biome ignore for `.claude/*.local.json`, then leave deletion to plan 003.

### Step 3: Add characterization tests for pure risky logic

Add focused tests for logic that can be tested without a browser:

- `context/LanguageContext.tsx` translation fallback behavior if you extract or export the resolver safely.
- `components/sections/Experience.tsx` date formatting if you extract or export `formatDate` safely.
- Contact URL normalization only if you extract a small helper without changing runtime behavior. Do not fix the placeholder bug here; plan 006 covers it.

Prefer tiny helper exports over rendering full React sections. Keep production behavior unchanged.

**Verify**: `npm test` -> exits 0 and reports the new tests passing.

### Step 4: Run the full baseline

Run:

```powershell
npm run verify
```

Expected result: lint, typecheck, test, and build all exit 0.

## Test plan

Add at least three tests total:

- translation resolver returns a known English or Spanish string for an existing key.
- translation resolver returns the key for a missing path.
- date formatting turns `"2024-10"` into `"Oct 2024"` and `null` into the provided present label.

If extracting helpers would create awkward public exports from UI files, create small pure modules close to the current files and import them back into the components.

## Done criteria

- [ ] `npm run lint` exits 0.
- [ ] `npm run typecheck` exits 0.
- [ ] `npm test` exits 0 with at least three meaningful tests.
- [ ] `npm run build` exits 0.
- [ ] `npm run verify` exits 0 and includes lint, typecheck, test, and build.
- [ ] No feature behavior is intentionally changed.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report if:

- Biome formatting changes conflict with uncommitted user edits.
- Adding a test runner requires changing from npm to another package manager.
- The only way to test a helper appears to require a broad component refactor.
- `npm run build` fails for reasons unrelated to this plan after lint/typecheck/test pass.

## Maintenance notes

This plan deliberately favors a small but reliable baseline over comprehensive
coverage. Reviewers should check that `verify` is useful for future plans and
that tests cover real logic, not implementation details of Motion or Next.js.
