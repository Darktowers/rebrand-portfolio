# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server with Turbopack → http://localhost:3000
npm run build    # production build (TypeScript checked)
npm run start    # serve production build
npm run lint     # Biome check (lint + format)
npm run format   # Biome auto-format
```

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** + **Tailwind CSS v4** (CSS-based config, no `tailwind.config.js`)
- **motion** (`motion/react`) for all animations
- **next-themes** for dark/light mode (system-first, class-based)
- **Biome** for linting + formatting (no ESLint/Prettier)

## Architecture

Single-page portfolio — `app/page.tsx` composes all sections in order:

```
AsciiBackground (canvas, fixed, z-0)
Navbar (fixed, z-50)
main:
  Hero → About → Experience → Projects → Contact
Footer
```

### Data flow
All content lives in flat JSON files — no API, no database:
- `data/profile.json` — personal info, social links, education
- `data/experience.json` — job history with `bulletKeys` referencing i18n
- `data/projects.json` — projects with `featured` flag
- `data/skills.json` — skills grouped by category

### i18n
- `i18n/en.json` + `i18n/es.json` — all UI strings + job bullets
- `context/LanguageContext.tsx` — `useLanguage()` hook, `t(key)` resolver, `localStorage` persistence
- Dot-notation keys (e.g. `exp.zoe.senior.1`, `nav.home`)

### Theme
- `next-themes` with `attribute="class"` — adds `dark` class to `<html>`
- CSS variables in `app/globals.css` scoped to `:root` (light) and `.dark`
- `data-no-transition` attribute prevents CSS transition interference on animated elements

### Card effects
| Component | Effect | Used for |
|-----------|--------|----------|
| `ElectricBorderCard` | SVG `feTurbulence` + `feDisplacementMap` animated border | Featured project |
| `HolographicCard` | Mouse-tracking 3D rotation + conic-gradient sheen | Featured project (wraps ElectricBorderCard) |
| Blur-hover grid | Inline `motion` `animate` on siblings (`blur`, `scale`, `opacity`) | Project grid |
| `SkeletonLoader` | CSS `shimmer` keyframes + Motion enter/exit | Loading states |

### Motion patterns
- Section reveals: `whileInView={{ opacity:1, y:0 }}` with `viewport={{ once: true }}`
- Staggered lists: `transition={{ delay: index * 0.06 }}`
- Spring interactions: `whileHover`, `whileTap` with `type: "spring"`
- Accordions: `AnimatePresence` + `height: 0 → "auto"` on experience roles

## Key files

| File | Purpose |
|------|---------|
| `app/globals.css` | CSS variables for both themes + skeleton shimmer keyframes |
| `context/LanguageContext.tsx` | EN/ES state, `useLanguage()`, `t()` |
| `components/ui/AsciiBackground.tsx` | Canvas matrix rain, theme-aware colors |
| `components/sections/Experience.tsx` | Timeline accordion, `formatDate()` helper |
| `components/sections/Projects.tsx` | Featured + grid layout, blur-hover effect |

## Notes
- WhatsApp number in `data/profile.json` is a placeholder (`+57XXXXXXXXXX`) — update before deploy
- Project images go in `public/my-work/images/` — filenames match `data/projects.json`
- Always use Playwright (MCP) to navigate and screenshot websites during development
