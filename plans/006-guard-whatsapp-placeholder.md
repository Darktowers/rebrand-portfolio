# Plan 006: Guard the placeholder WhatsApp CTA

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report. When done, update the status row for this plan in `plans/README.md`
> unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 6a24769..HEAD -- components/sections/Contact.tsx data/profile.json context i18n`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: `plans/002-verification-baseline.md`
- **Category**: bug
- **Planned at**: commit `6a24769`, 2026-06-20

## Why this matters

The portfolio ships a visible WhatsApp contact card, but the profile value is a
placeholder. The current code strips non-digits and creates `https://wa.me/57`,
which is a broken external CTA. Until a real number is configured, the UI should
hide or disable that contact method instead of sending visitors to a bad link.

## Current state

- `data/profile.json` contains `"whatsapp": "+57XXXXXXXXXX"`.
- `Contact.tsx` always includes a WhatsApp social item.
- The WhatsApp href is computed by stripping non-digits from the placeholder.

Current excerpts:

```json
// data/profile.json:7
"email": "darktowerdev@gmail.com",
"whatsapp": "+57XXXXXXXXXX",
"linkedin": "https://www.linkedin.com/in/cristian-andres-arrieta-gutierrez-74a496b5",
```

```tsx
// components/sections/Contact.tsx:35
{
  key: "whatsapp",
  labelKey: "contact.whatsapp",
  handle: "direct message",
  href: `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`,
  icon: faWhatsapp,
  download: false,
},
```

Repo conventions to match:

- Data lives in JSON files under `data/`.
- UI strings live under `i18n/en.json` and `i18n/es.json`.
- Contact card styling uses `GlowCard`, `FontAwesomeIcon`, and the existing `SOCIALS` array shape.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npm run typecheck` | exit 0 |
| Test | `npm test` | exit 0 |
| Full verify | `npm run verify` | exit 0 |

## Scope

**In scope**:

- `components/sections/Contact.tsx`
- `data/profile.json` only if replacing the placeholder with a real number was explicitly provided by the operator
- A small helper test file if plan 002 created a test setup
- `i18n/en.json` and `i18n/es.json` only if adding visible fallback text

**Out of scope**:

- Changing LinkedIn, GitHub, email, or CV contact methods.
- Guessing or inventing a real WhatsApp number.
- Redesigning the contact section layout.

## Git workflow

- Branch: `codex/006-guard-whatsapp-placeholder`
- Suggested commit message: `Guard placeholder WhatsApp CTA`.
- Do not push or open a PR unless the operator instructs it.

## Steps

### Step 1: Add a small WhatsApp URL helper

Create a tiny helper near the contact section or in a small utility file. It
should return `null` unless the configured number is plausibly usable.

Minimum behavior:

- Strip non-digits.
- Reject values containing `X` or `x`.
- Reject values with too few digits for an international WhatsApp number. Use a conservative minimum such as 10 digits.
- Return `https://wa.me/<digits>` only for accepted values.

**Verify**: add tests for placeholder, empty value, short numeric value, and valid numeric value.

### Step 2: Filter or disable the WhatsApp social card

Use the helper before rendering `SOCIALS`. Prefer hiding the WhatsApp card while
the profile value is a placeholder. Keep the grid layout responsive after the
card count changes.

Do not render an anchor with `href="https://wa.me/57"`.

**Verify**: `rg -n "wa.me/57|XXXXXXXXXX" components/sections/Contact.tsx` -> no matches.

### Step 3: Run the baseline

Run:

```powershell
npm run verify
```

Expected result: exit 0.

## Test plan

Add tests for the helper:

- `"+57XXXXXXXXXX"` returns `null`.
- `""` returns `null`.
- `"+57"` returns `null`.
- `"+573001112233"` returns `https://wa.me/573001112233`.

If no test runner exists yet, do not create one in this plan; wait for plan 002.

## Done criteria

- [ ] Placeholder WhatsApp values no longer produce a rendered bad `wa.me` link.
- [ ] A real plausible WhatsApp number would still render a working `wa.me` link.
- [ ] Existing email, LinkedIn, GitHub, and CV cards still render.
- [ ] `npm run verify` exits 0.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report if:

- The operator provides a real WhatsApp number and wants it committed; that changes this from a guard fix to a content update.
- The contact section layout depends on exactly four cards and breaks when WhatsApp is hidden.
- Plan 002 has not established a test runner and the operator requires tests before this fix.

## Maintenance notes

Future profile data changes should treat contact URLs as derived behavior with
validation, not as raw string interpolation in JSX.
