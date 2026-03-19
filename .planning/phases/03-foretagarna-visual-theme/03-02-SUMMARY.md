---
phase: 03-foretagarna-visual-theme
plan: "02"
subsystem: css-theming
tags: [scss, css-custom-properties, theme-tokens, chatbox, sidebar, quality-score]
dependency_graph:
  requires: [03-01-SUMMARY.md]
  provides: [themed-chatbox, themed-sidebar, themed-quality-score]
  affects:
    - app/style/base/components/_chatbox.scss
    - app/style/base/components/_sidebar.scss
    - app/style/base/components/_qualityScore.scss
tech_stack:
  added: []
  patterns: [css-custom-properties, dual-theme-token-consumption]
key_files:
  created: []
  modified:
    - app/style/base/components/_chatbox.scss
    - app/style/base/components/_sidebar.scss
    - app/style/base/components/_qualityScore.scss
decisions:
  - "booking-btn gradient replaced with var(--color-accent-subtle) flat background for cross-theme compatibility — gradient using $purple hardcoded values would break in Foretagarna light theme"
  - "booking-btn__icon simplified from linear-gradient($purple, #6366f1) to var(--color-accent) — Foretagarna teal renders cleanly as solid color vs forcing gradient into light theme"
metrics:
  duration: 2 min
  completed_date: "2026-03-19T21:38:00Z"
  tasks_completed: 2
  files_modified: 3
---

# Phase 03 Plan 02: Component Color Theming — Chatbox, Sidebar, Quality Score Summary

**One-liner:** Converted chatbox input area, sidebar panel, and quality score card from hardcoded Globy SCSS color variables to CSS custom properties, enabling all three components to respond correctly to data-theme switching between Globy dark and Foretagarna light themes.

## What Was Built

### Task 1: Convert chatbox and sidebar to CSS custom properties

**`_chatbox.scss`** — 12 replacement points:
1. `.chat-box background-color` → `var(--color-surface-input)`
2. `.chat-box box-shadow` → `var(--shadow-card)`
3. `.has-image/.has-text/.has-value .icons--plus background-color` → `var(--color-interactive-bg)`
4. `.has-image/.has-text/.has-value .icons--send background-color` → `var(--color-accent)`
5. `.has-value .chat-box__actions background-color` → `var(--color-surface-input)`
6. `.textfield textarea` text color → `var(--color-text)` via @include text()
7. `.textfield textarea::placeholder` → `var(--color-text-muted)`
8. `.selected-img border` → `var(--color-border)`
9. `.delete-img background-color` → `var(--color-interactive-bg)`, hover → `var(--color-interactive-hover)`
10. `figcaption` text color → `var(--color-text)`
11. `.icons--plus` base state → `var(--color-interactive-bg)` (xl breakpoint transparent preserved)
12. `.options-popup` background → `var(--color-surface-elevated)`, box-shadow → `var(--shadow-popup)`, text → `var(--color-text)`
13. `.textfield ::-webkit-scrollbar-thumb` → `var(--color-text-light)`

**`_sidebar.scss`** — 17 replacement points across all sections:
1. `.sidebar-overlay background-color` → `var(--color-surface-overlay)`
2. `.sidebar background-color` → `var(--color-surface-secondary)`
3. `.sidebar__toggle-icon` background + border → surface-secondary, color-border
4. `.sidebar__close background-color` → `var(--color-surface-secondary)`
5. All `.style-toggle` text color → `var(--color-text-heading)` (3 instances across __styles, __site-type, __service-business)
6. Style options `> b` labels → `var(--color-text)` (upload-logo, image-library, __color-picker)
7. Style options `> p` descriptions → `var(--color-text-muted)`
8. `.uploaded-img .close` border, background, color → color-border, surface-secondary, color-text
9. `.user-info > strong` → `var(--color-text-heading)`
10. `.user-info > p` → `var(--color-text-muted)`
11. `.settings` popup background → `var(--color-surface-elevated)`, box-shadow → `var(--shadow-popup)`, text → `var(--color-text)`
12. `.setup-booking-btn` background → `var(--color-accent-subtle)`, border → `var(--color-accent-border)`
13. `.setup-booking-btn:hover` border-color → `var(--color-accent)`
14. `.booking-btn__icon` background → `var(--color-accent)`, svg color → `var(--color-text-inverse)`
15. `.booking-btn__text` → `var(--color-text-heading)`
16. `.booking-btn__arrow` color → `var(--color-text-muted)`
17. `.booking-info` text → `var(--color-text-light)`

### Task 2: Convert quality score card to CSS custom properties

**`_qualityScore.scss`** — 7 replacement points:
1. `.quality-score` gradient → `linear-gradient(135deg, var(--color-accent-hover), var(--color-surface-secondary))`
2. `.quality-score` box-shadow → `var(--shadow-hover)`
3. `.quality-score` base color → `var(--color-text-heading)`
4. `&__title` text → `var(--color-text-muted)`
5. `&__icon` color → `var(--color-text-muted)`
6. `.brand-insight-tip` background → `var(--color-surface-primary)`, text → `var(--color-text)`
7. `&__percentage`, `&__footer-title` → `var(--color-text-heading)`, `&__footer-text` → `var(--color-text-muted)`

## Verification Results

- `npm run build` exits with code 0 (both after Task 1 and Task 2)
- `grep "var(--color-surface-input)" app/style/base/components/_chatbox.scss` returns 2 matches
- `grep "var(--color-surface-secondary)" app/style/base/components/_sidebar.scss` returns 4 matches
- `grep "var(--color-accent-hover)" app/style/base/components/_qualityScore.scss` returns 1 match
- No `$purple` references remain in _chatbox.scss or _sidebar.scss

## Deviations from Plan

None - plan executed exactly as written.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | ee5689e | feat(03-02): convert chatbox and sidebar to CSS custom properties |
| Task 2 | 35906b5 | feat(03-02): convert quality score card to CSS custom properties |

## Self-Check: PASSED

| Item | Status |
|------|--------|
| app/style/base/components/_chatbox.scss | FOUND |
| app/style/base/components/_sidebar.scss | FOUND |
| app/style/base/components/_qualityScore.scss | FOUND |
| Commit ee5689e | FOUND |
| Commit 35906b5 | FOUND |
