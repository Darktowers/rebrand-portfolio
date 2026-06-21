# Plan 004: Scope and lazy-load the WebGL background runtime

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report. When done, update the status row for this plan in `plans/README.md`
> unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 6a24769..HEAD -- app components/v2 components/layout package.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/002-verification-baseline.md`
- **Category**: perf
- **Planned at**: commit `6a24769`, 2026-06-20

## Why this matters

The portfolio's most expensive runtime surface is the global Three.js
background system. Today it is mounted from the root layout and statically
imports all three scene adapters, so every route loads the same WebGL runtime
whether or not the home-only background picker is visible. The goal is to keep
the visual identity intact while reducing client JavaScript and GPU work on
content routes.

## Current state

- `app/layout.tsx` wraps every route in `BackgroundProvider`, renders `BackgroundScene`, and renders a HUD grid globally.
- `app/page.tsx` renders the home-only `BackgroundPicker` and `HudOverlay`.
- `BackgroundScene.tsx` statically imports `BlackHole`, `FlowField`, and `IsoTerrain`.
- Each scene uses `useThreeScene`, which creates a `THREE.WebGLRenderer`, appends a canvas, starts a RAF loop, and registers window/document listeners.

Current excerpts:

```tsx
// app/layout.tsx:59
<LanguageProvider>
  <BackgroundProvider>
    <BackgroundScene />
    <div className="v2-hud-grid" aria-hidden="true" />
    <Navbar />
    <main className="relative z-10">{children}</main>
    <Footer />
  </BackgroundProvider>
</LanguageProvider>
```

```tsx
// app/page.tsx:6
<>
  <BackgroundPicker />
  <HudOverlay />
  <Hero />
</>
```

```tsx
// components/v2/backgrounds/BackgroundScene.tsx:5
import BlackHole from "./BlackHole";
import FlowField from "./FlowField";
import IsoTerrain from "./IsoTerrain";
```

```tsx
// components/v2/backgrounds/useThreeScene.ts:68
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
mount.appendChild(renderer.domElement);
```

Next 16 docs to honor:

- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` says `"use client"` marks a client module graph, and all imports and child components are included in the client bundle.
- Use Client Components only where interactivity, browser APIs, or custom hooks are needed.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npm run typecheck` | exit 0 |
| Test | `npm test` | exit 0 |
| Build | `npm run build` | exit 0 |
| Full verify | `npm run verify` | exit 0 |

## Suggested executor toolkit

- Use the browser or Playwright if available to visually check `/`, `/about`, `/experience`, `/projects`, and `/contact`.
- Read the Next server/client component doc before changing imports: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`.

## Scope

**In scope**:

- `app/layout.tsx`
- `app/page.tsx`
- New or existing home-shell component under `components/v2/` or `components/v2/backgrounds/`
- `components/v2/backgrounds/BackgroundScene.tsx`
- `components/v2/backgrounds/BackgroundPicker.tsx`
- `components/v2/BackgroundContext.tsx`

**Out of scope**:

- Rewriting shader code in `BlackHole.tsx`, `FlowField.tsx`, or `IsoTerrain.tsx` except import/lazy-loading integration.
- Changing the visual design, selected default background, or HUD behavior.
- Adding a new animation library.
- Moving unrelated layout/footer/navbar behavior.

## Git workflow

- Branch: `codex/004-lazy-load-webgl-background`
- Suggested commit message: `Scope WebGL background runtime`.
- Do not push or open a PR unless the operator instructs it.

## Steps

### Step 1: Move the background provider and scene out of the root layout

Refactor so `BackgroundProvider`, `BackgroundScene`, and the home-only HUD grid
are mounted only for the home experience, not every route.

One acceptable target shape:

- Create a client component such as `components/v2/HomeExperience.tsx`.
- It renders `BackgroundProvider`, `BackgroundScene`, the HUD grid, `BackgroundPicker`, `HudOverlay`, and `Hero`.
- `app/page.tsx` renders `<HomeExperience />`.
- `app/layout.tsx` keeps `ThemeProvider`, `LanguageProvider`, `Navbar`, `main`, and `Footer`, but no longer imports background components.

**Verify**: `rg -n "BackgroundScene|BackgroundProvider|v2-hud-grid" app/layout.tsx` -> no matches.

### Step 2: Lazy-load inactive Three.js scene adapters

Change `BackgroundScene.tsx` so it does not statically import all scene
adapters into the same initial client module. Use Next-compatible dynamic
loading for client components.

One acceptable shape:

```tsx
import dynamic from "next/dynamic";

const BlackHole = dynamic(() => import("./BlackHole"), { ssr: false });
const FlowField = dynamic(() => import("./FlowField"), { ssr: false });
const IsoTerrain = dynamic(() => import("./IsoTerrain"), { ssr: false });
```

Preserve the current version selection behavior and props.

**Verify**: `rg -n "import BlackHole|import FlowField|import IsoTerrain" components/v2/backgrounds/BackgroundScene.tsx` -> no matches.

### Step 3: Keep content routes visually stable

Visit or screenshot these routes:

- `/`
- `/about`
- `/experience`
- `/projects`
- `/contact`

Expected:

- `/` still has the animated background, picker, HUD overlay, navbar, and hero.
- Content routes still have navbar, content, and footer.
- Content routes no longer instantiate WebGL canvases behind the page unless intentionally required by design.

If browser tooling is unavailable, add a short manual verification note in the PR or final report.

**Verify**: `npm run verify` -> exits 0.

## Test plan

If the repo has a browser test harness after plan 002, add a smoke test that:

- opens `/` and confirms a canvas exists for the background.
- opens `/about` and confirms no WebGL background canvas exists.
- confirms the nav still renders on both routes.

If no browser harness exists, do not add one in this plan; use manual visual verification and keep the scope tight.

## Done criteria

- [ ] `app/layout.tsx` no longer imports or renders background scene/provider modules.
- [ ] `/` still renders the background system and controls.
- [ ] Content routes no longer mount the Three.js background runtime.
- [ ] `BackgroundScene.tsx` lazy-loads scene adapters instead of statically importing all three.
- [ ] `npm run verify` exits 0.
- [ ] Visual smoke check completed for home and at least one content route.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report if:

- Moving the background provider breaks the home picker state in a way that requires redesigning app state.
- Next dynamic import rejects the chosen client-component pattern under Next 16.
- Content routes intentionally require the animated background as a product decision.
- The fix requires rewriting shader implementation code.

## Maintenance notes

Reviewers should inspect bundle/runtime impact, not just visual parity. The PR
should make the root layout less client-heavy and keep the expensive Three.js
runtime local to the home experience.
