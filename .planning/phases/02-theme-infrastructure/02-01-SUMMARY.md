---
phase: 02-theme-infrastructure
plan: "01"
subsystem: css-theme-tokens
tags: [scss, css-custom-properties, theming, fonts, foretagarna, globy]
dependency_graph:
  requires: []
  provides: [theme-token-definitions, inter-font-loading]
  affects: [all-themed-components-phase-3]
tech_stack:
  added: []
  patterns: [css-custom-properties-dual-theme, scss-forward-module-index, google-fonts-preconnect]
key_files:
  created:
    - app/style/abstracts/variables/_theme-tokens.scss
  modified:
    - app/style/abstracts/variables/_index.scss
    - app/root.tsx
decisions:
  - "Both fonts always preloaded (Albert Sans local + Inter from Google Fonts) — no conditional loading"
  - "Globy theme uses :root selector as fallback ensuring it applies when no data-theme attribute is set"
  - "Foretagarna uses tighter border-radius (4px/8px) vs Globy (8px/12px) per their respective design systems"
metrics:
  duration: 5 min
  completed: 2026-03-19
  tasks_completed: 2
  files_modified: 3
---

# Phase 2 Plan 1: Theme Token System and Inter Font Loading Summary

**One-liner:** CSS custom property dual-theme token system (Globy purple + Foretagarna teal) with Inter font preloaded from Google Fonts via preconnect hints.

## What Was Built

Established the CSS custom property token infrastructure that all themed components (Phase 3) will consume. Created a single SCSS file with two theme blocks sharing identical token names, ensuring components can switch themes without code changes.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Create dual theme tokens SCSS file | 8d110cf | `_theme-tokens.scss`, `_index.scss` |
| 2 | Add Inter font preconnect links to head | dd8e670 | `app/root.tsx` |

## Key Artifacts

**`app/style/abstracts/variables/_theme-tokens.scss`**
- `:root, [data-theme="globy"]` block: purple accent (#b239e8), Albert Sans font, 8px/12px border-radius
- `[data-theme="foretagarna"]` block: teal accent (#20565D), Inter font, 4px/8px border-radius
- Both blocks define 12 identical token names: `--color-accent`, `--color-accent-hover`, `--color-text`, `--color-text-light`, `--color-bg`, `--color-bg-alt`, `--color-border`, `--font-family`, `--fs-body`, `--fs-small`, `--radius`, `--radius-lg`

**`app/root.tsx`**
- Preconnect hints for fonts.googleapis.com and fonts.gstatic.com
- Inter wght@300-800 stylesheet link with display=swap
- Placed after viewport meta tag, before existing pagesense script

## Verification

- Build completed successfully (`npm run build`) — no SCSS compilation errors
- Theme tokens forwarded through `_index.scss` -> `global.scss` chain
- Pre-existing unused import warnings are unrelated to this plan

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

- [x] `app/style/abstracts/variables/_theme-tokens.scss` exists
- [x] `app/style/abstracts/variables/_index.scss` contains `@forward 'theme-tokens'`
- [x] `app/root.tsx` contains `fonts.googleapis.com` links
- [x] Commit 8d110cf exists
- [x] Commit dd8e670 exists
- [x] Build passes without SCSS errors
