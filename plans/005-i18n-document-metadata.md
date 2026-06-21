# Plan 005: Make language state visible to document metadata

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report. When done, update the status row for this plan in `plans/README.md`
> unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 6a24769..HEAD -- app context i18n data components/layout components/ui`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/002-verification-baseline.md`
- **Category**: correctness
- **Planned at**: commit `6a24769`, 2026-06-20

## Why this matters

The UI can switch between English and Spanish, but the document language and
metadata are always English. That creates an accessibility and SEO mismatch:
screen readers, crawlers, and social previews cannot see the selected language.
The fix should make language part of the route/document contract rather than
only a `localStorage` client preference.

## Current state

- `app/layout.tsx` sets `<html lang="en">` and exports English metadata.
- `context/LanguageContext.tsx` defaults to `"en"`, then reads `localStorage` after hydration.
- `i18n/en.json` and `i18n/es.json` contain the visible UI strings.
- `LanguageToggle` drives the client context, not route state.

Current excerpts:

```tsx
// app/layout.tsx:21
export const metadata: Metadata = {
  title: "Cristian Arrieta - React Developer",
  description:
    "React Developer & JavaScript Engineer with 8+ years of experience building fast, scalable web applications.",
  ...
};
```

```tsx
// app/layout.tsx:47
<html
  lang="en"
  suppressHydrationWarning
  className={`${geistSans.variable} ${geistMono.variable}`}
>
```

```tsx
// context/LanguageContext.tsx:40
const [lang, setLangState] = useState<Lang>("en");

useEffect(() => {
  const stored = localStorage.getItem("lang") as Lang | null;
  if (stored === "en" || stored === "es") setLangState(stored);
}, []);
```

Next metadata docs to honor:

- `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md` says static `metadata` and `generateMetadata` exports are supported in Server Components.
- Metadata defaults include charset and viewport, but title/description/open graph should be defined by the app.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npm run typecheck` | exit 0 |
| Test | `npm test` | exit 0 |
| Build | `npm run build` | exit 0 |
| Full verify | `npm run verify` | exit 0 |

## Scope

**In scope**:

- `app/layout.tsx`
- Possible route structure under `app/` if choosing locale-prefixed routes
- `context/LanguageContext.tsx`
- `components/ui/LanguageToggle.tsx`
- `i18n/en.json`
- `i18n/es.json`
- Tests added for language routing/resolution helpers

**Out of scope**:

- Translating new marketing copy beyond metadata fields needed for this plan.
- Rewriting all content data into localized data files.
- Adding a full i18n framework unless a minimal route-aware approach is insufficient.

## Git workflow

- Branch: `codex/005-i18n-document-metadata`
- Suggested commit message: `Expose language in document metadata`.
- Do not push or open a PR unless the operator instructs it.

## Steps

### Step 1: Choose a route-visible language strategy

Prefer one of these approaches:

1. Locale-prefixed routes such as `/en` and `/es`, with redirects or links from `/`.
2. A cookie-backed language preference read by the server layout, if route prefixes are not desired.

Do not keep language solely in `localStorage`, because the server cannot use it
for `<html lang>` or metadata.

**Verify**: Document the chosen strategy in a short code comment or test name, and ensure `LanguageContext` can receive an initial server-visible language.

### Step 2: Move metadata strings into language-aware data

Add metadata strings for both languages. Keep them close to the existing i18n
files or in a small typed metadata helper.

English values should match current meaning. Spanish values should be real
Spanish equivalents, not English placeholders.

**Verify**: add or update tests so both `en` and `es` metadata values can be selected.

### Step 3: Update layout/document language

Update the server layout or route layouts so `<html lang>` reflects the active
language. Update `metadata` or `generateMetadata` so title, description, and
Open Graph description reflect the active language.

**Verify**: `npm run typecheck` -> exits 0.

### Step 4: Update the language toggle

Update `LanguageToggle` so switching language updates the route or cookie used
by the server. Preserve existing EN/ES UI and visual style.

**Verify**: manually switch EN/ES in the browser and confirm the visible UI still changes.

### Step 5: Run the full baseline

Run:

```powershell
npm run verify
```

Expected result: exit 0.

## Test plan

Add tests for:

- supported language parsing accepts `en` and `es`.
- unsupported language falls back to `en`.
- metadata selection returns different English and Spanish descriptions.

If browser tests exist after plan 002, add a smoke test that switches language
and checks `document.documentElement.lang`.

## Done criteria

- [ ] Language is server-visible through route or cookie state.
- [ ] `<html lang>` reflects English and Spanish.
- [ ] Metadata title/description/Open Graph description are language-aware.
- [ ] Existing visible language toggle still works.
- [ ] `npm run verify` exits 0.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report if:

- The desired URL strategy is product-sensitive and cannot be inferred from the repo.
- Implementing route-prefixed i18n requires duplicating every app route manually.
- Cookie-based language introduces hydration mismatch that cannot be resolved without redesigning the provider.

## Maintenance notes

Reviewers should focus on whether language is visible to the server and document
metadata, not only whether client text changes. Avoid accepting a solution that
just updates `localStorage` more carefully.
