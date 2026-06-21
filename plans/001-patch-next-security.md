# Plan 001: Patch Next.js to clear high advisories

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report. When done, update the status row for this plan in `plans/README.md`
> unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 6a24769..HEAD -- package.json package-lock.json next.config.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `6a24769`, 2026-06-20

## Why this matters

`npm audit --audit-level=high --json` reports high-severity advisories against
the installed `next@16.2.1`. This is a direct runtime framework dependency for
the public portfolio. The audit output says a non-major fix is available at
`next@16.2.9`, so this should be handled as a patch-level dependency update
rather than a migration project.

## Current state

- `package.json` declares the direct framework dependency and scripts.
- `package-lock.json` pins the installed dependency tree.
- `next.config.ts` uses the stable top-level `turbopack` config, which matches the Next 16 docs.

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
// package.json:18
"motion": "^12.38.0",
"next": "16.2.1",
"next-themes": "^0.4.6",
"react": "19.2.4",
"react-dom": "19.2.4"
```

Relevant Next 16 docs already read during audit:

- `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` says Turbopack is default for `next dev` and `next build`.
- The same doc says `next lint` was removed and lint should use Biome or ESLint directly; this repo already uses Biome.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install patched dependency | `npm install next@16.2.9` | exit 0; `package.json` and `package-lock.json` updated |
| Security audit | `npm audit --audit-level=high --json` | exit 0 or no high/critical advisories for `next` |
| Typecheck | `npx tsc --noEmit --pretty false` | exit 0, no output |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:

- `package.json`
- `package-lock.json`

**Out of scope**:

- Source code under `app/`, `components/`, `context/`, `data/`, or `i18n/`
- Biome formatting cleanup. That belongs to plan 002.
- Any major framework upgrade or React version change.

## Git workflow

- Branch: `codex/001-patch-next-security`
- Commit message style follows the repo's short imperative history, for example `Deepen scene runtime`. Suggested message: `Patch Next security advisories`.
- Do not push or open a PR unless the operator instructs it.

## Steps

### Step 1: Update only Next.js to the patched version

Run:

```powershell
npm install next@16.2.9
```

Do not run a broad `npm update`; keep the change limited to `next` and lockfile transitive updates needed by npm.

**Verify**: `node -p "require('./package.json').dependencies.next"` -> prints `16.2.9`.

### Step 2: Confirm the high advisories are gone

Run:

```powershell
npm audit --audit-level=high --json
```

Expected result: exit 0, or JSON output with no `metadata.vulnerabilities.high` and no high/critical advisory for `next`.

### Step 3: Confirm the app still typechecks and builds

Run:

```powershell
npx tsc --noEmit --pretty false
npm run build
```

Expected result: both commands exit 0. The build may write `.next/`; that is expected and ignored.

## Test plan

No new tests are required for this dependency patch. The verification is the
security audit plus TypeScript and production build.

## Done criteria

- [ ] `package.json` declares `next` as `16.2.9`.
- [ ] `package-lock.json` is consistent with `npm install next@16.2.9`.
- [ ] `npm audit --audit-level=high --json` reports no high/critical Next.js advisories.
- [ ] `npx tsc --noEmit --pretty false` exits 0.
- [ ] `npm run build` exits 0.
- [ ] No files outside the in-scope list are modified, except ignored build output.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report if:

- `npm install next@16.2.9` wants to change React major versions or replace the package manager lockfile format.
- The patched Next version fails to install from npm.
- `npm run build` fails with a framework migration error that requires source changes.
- The audit still reports high/critical `next` advisories after installing `16.2.9`.

## Maintenance notes

Next.js security advisories have been moving quickly in this repo's installed
range. Reviewers should look for a tight dependency diff and avoid accepting
unrelated formatting or source churn in this patch PR.
