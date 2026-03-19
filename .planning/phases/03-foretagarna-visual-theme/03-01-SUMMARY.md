---
phase: 03-foretagarna-visual-theme
plan: "01"
subsystem: css-theming
tags: [scss, css-custom-properties, theme-tokens, fluid-typography, dual-theme]
dependency_graph:
  requires: [02-01-SUMMARY.md, 02-02-SUMMARY.md]
  provides: [complete-token-vocabulary, themed-base-styles, themed-chat-layout]
  affects: [app/style/abstracts/variables/_theme-tokens.scss, app/style/base/_base.scss, app/style/base/pages/_chat.scss]
tech_stack:
  added: []
  patterns: [css-custom-properties, fluid-typography-clamp, dual-theme-token-blocks]
key_files:
  created: []
  modified:
    - app/style/abstracts/variables/_theme-tokens.scss
    - app/style/base/_base.scss
    - app/style/base/pages/_chat.scss
decisions:
  - "clamp() fluid font sizes use 375px-1440px viewport range as bounds, sharing identical scale between Globy and Foretagarna themes"
  - "SCSS size variables ($text-lg, $text-md, etc.) retained for structural layout; only colors and font-family replaced with CSS custom properties"
  - "redirecting paragraph text updated to var(--color-text-heading) for theme consistency beyond the chat window"
metrics:
  duration: 2 min
  completed_date: "2026-03-19T21:33:40Z"
  tasks_completed: 2
  files_modified: 3
---

# Phase 03 Plan 01: Expanded Theme Token System and CSS Custom Property Conversion Summary

**One-liner:** Complete dual-theme token vocabulary (35+ tokens per block) covering all UI surfaces, plus conversion of _base.scss and _chat.scss from hardcoded SCSS variables to CSS custom properties with clamp()-based fluid typography.

## What Was Built

### Task 1: Expand theme token system to cover all UI surfaces

Rewrote `_theme-tokens.scss` to add ~25 new tokens to both the Globy and Foretagarna blocks while preserving the original 12 tokens (with fs-body and fs-small upgraded to clamp() values).

New token categories added:

- **Surface colors** (5 tokens): `--color-surface-primary`, `--color-surface-secondary`, `--color-surface-elevated`, `--color-surface-input`, `--color-surface-overlay`
- **Message bubble colors** (3 tokens): `--color-bubble-user`, `--color-bubble-user-text`, `--color-bubble-bot-text`
- **Extended text colors** (3 tokens): `--color-text-heading`, `--color-text-inverse`, `--color-text-muted`
- **Interactive element colors** (2 tokens): `--color-interactive-bg`, `--color-interactive-hover`
- **Shadow tokens** (3 tokens): `--shadow-card`, `--shadow-hover`, `--shadow-popup`
- **Accent derived** (2 tokens): `--color-accent-subtle`, `--color-accent-border`
- **Spacing tokens** (2 tokens): `--spacing-section`, `--spacing-message` (3.8rem Globy / 4.2rem Foretagarna)
- **Typography extras** (2 tokens): `--font-weight-heading`, `--lh-body`
- **Fluid font scale** (6 tokens upgraded/added): `--fs-xs`, `--fs-small`, `--fs-body`, `--fs-md`, `--fs-lg`, `--fs-xl` — all using clamp() per THEME-02
- **Transition** (1 token): `--transition-default`

Both themes contain 36 tokens each with identical names, diverging only in values.

### Task 2: Convert base styles and chat page to CSS custom properties

**`_base.scss`:**
- `html font-family` → `var(--font-family)`
- `body background-color: $black-700` → `var(--color-surface-primary)`
- `body color: $white` → `var(--color-text)`
- Added `line-height: var(--lh-body)` to body
- `input/textarea placeholder font-family: $font-family` → `var(--font-family)`

**`_chat.scss`** — 12 replacement points:
1. `.heading background-color` → `var(--color-surface-primary)`
2. `.menu-icon::after background` → `var(--color-accent)`
3. `.heading__brand > strong` text color → `var(--color-text-heading)`
4. `.heading__brand > small` text color → `var(--color-text-muted)`
5. `.move-on button` bg/border/hover/text → surface-primary, accent, text-inverse
6. `.message--user .message__content` color/bg → bubble-user-text, bubble-user
7. `.message--user.editing` bg → `var(--color-surface-input)`
8. `.editing__textarea` text/placeholder → color-text, color-text-muted
9. `.editing__actions button` bg/border/accent-child → surface-primary, accent
10. `.message__logo` text → `var(--color-text-muted)`
11. `.prompt-box` bg → `var(--color-surface-primary)`
12. `.message margin-bottom` → `var(--spacing-message)`

SCSS size variables (`$text-lg`, `$text-md`, `$text-sm`, etc.) retained — they are structural, not themed.

## Verification Results

- `npm run build` exits with code 0 (no SCSS errors)
- `grep -r "var(--color-surface-primary)" app/style/` matches both _base.scss and _chat.scss
- `grep -r "var(--color-bubble-user)" app/style/` matches _chat.scss
- `grep -r "var(--spacing-message)" app/style/base/pages/_chat.scss` matches message margin-bottom
- `grep -c "clamp(" app/style/abstracts/variables/_theme-tokens.scss` returns 12 (6 tokens × 2 blocks)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Coverage] Updated .redirecting > p text color**
- **Found during:** Task 2
- **Issue:** `.redirecting > p` used `$white-2` — the only remaining hardcoded color text in _chat.scss outside the main plan list. Leaving it would cause text to be invisible on white background in Foretagarna theme.
- **Fix:** Replaced `@include text($white-2, 500, $text-lg)` with `@include text(var(--color-text-heading), 500, $text-lg)`
- **Files modified:** app/style/base/pages/_chat.scss
- **Commit:** 0a5c63a

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | 928499a | feat(03-01): expand theme token system to cover all UI surfaces |
| Task 2 | 0a5c63a | feat(03-01): convert base styles and chat page to CSS custom properties |

## Self-Check: PASSED

| Item | Status |
|------|--------|
| app/style/abstracts/variables/_theme-tokens.scss | FOUND |
| app/style/base/_base.scss | FOUND |
| app/style/base/pages/_chat.scss | FOUND |
| Commit 928499a | FOUND |
| Commit 0a5c63a | FOUND |
