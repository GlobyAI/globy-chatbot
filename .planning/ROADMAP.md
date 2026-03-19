# Roadmap: Företagarna Theme for Globy Chatbot

## Overview

Three phases deliver the complete theme feature. Phase 1 wires the auth pipeline so the theme identifier survives the Auth0 round-trip and is returned by the API. Phase 2 builds the frontend infrastructure that reads the theme, makes it globally available, and switches CSS custom properties at runtime without a flash. Phase 3 applies the full Företagarna visual language across every UI surface and validates that the default Globy theme is untouched.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Auth Pipeline** - Backend stores and returns theme identifier through the Auth0 flow (completed 2026-03-19)
- [x] **Phase 2: Theme Infrastructure** - Frontend reads, propagates, and switches theme at runtime without flash (completed 2026-03-19)
- [ ] **Phase 3: Företagarna Visual Theme** - Full visual implementation plus regression safety

## Phase Details

### Phase 1: Auth Pipeline
**Goal**: The theme identifier set on the landing page URL survives the Auth0 redirect round-trip, is stored by the authenticator, and is returned in the auth API response
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03
**Success Criteria** (what must be TRUE):
  1. Visiting the landing page with `?theme=foretagarna` causes subsequent API calls to return `theme: "foretagarna"` in the user response
  2. Visiting the landing page without a theme parameter causes the API to return `theme: "globy"` (the default)
  3. The theme value persists across a full Auth0 redirect loop — it is not lost between the initial redirect and the callback
**Plans:** 2/2 plans complete

Plans:
- [x] 01-01-PLAN.md — Backend: add theme field to User/AuthResponse models and wire through process_auth/ensure_user
- [ ] 01-02-PLAN.md — Frontend: capture theme from URL, pass through Auth0 redirect, send to backend, store response

### Phase 2: Theme Infrastructure
**Goal**: The frontend reads the theme from the auth response, makes it available application-wide without prop drilling, and switches CSS custom properties at runtime so the correct theme is applied immediately on login with no visible flash
**Depends on**: Phase 1
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05
**Success Criteria** (what must be TRUE):
  1. On login, the theme from the auth response is applied before the first paint — no flash of the wrong theme is visible
  2. Any component in the tree can read the active theme without receiving it as a prop
  3. Loading the app with a Företagarna-authenticated user applies the `foretagarna` CSS token set; loading with a default user applies the `globy` token set
  4. An unknown or absent theme value falls back to the Globy default without errors
**Plans:** 2/2 plans complete

Plans:
- [ ] 02-01-PLAN.md — CSS theme tokens (dual Globy/Foretagarna definitions) and Inter font loading
- [ ] 02-02-PLAN.md — Wire data-theme attribute on HTML element from auth response in AppContextProvider

### Phase 3: Företagarna Visual Theme
**Goal**: Every visible surface of the chatbot renders correctly under the Företagarna design system when the theme is active, and the default Globy theme is completely unaffected
**Depends on**: Phase 2
**Requirements**: THEME-01, THEME-02, THEME-03, THEME-04, THEME-05, THEME-06, THEME-07, THEME-08, THEME-09, SAFE-01, SAFE-02
**Success Criteria** (what must be TRUE):
  1. A Företagarna-authenticated user sees the deep teal (`#20565D`) accent, `#333333` body text, `#F5F5F5` alternate background, and Inter font across all surfaces
  2. Chat bubbles, the message input area, sidebar, and header all match the Företagarna spec (4px button radius, 8px card radius, shadows on hover only, generous whitespace)
  3. A default Globy-authenticated user sees zero visual changes — all existing styles remain pixel-identical to before this feature shipped
  4. No Företagarna styles leak into Globy theme views and no Globy styles bleed into Företagarna theme views
**Plans:** 2/3 plans executed

Plans:
- [ ] 03-01-PLAN.md — Expand theme tokens to cover all surfaces + convert base styles and chat page
- [ ] 03-02-PLAN.md — Convert chatbox input, sidebar, and quality score to themed tokens
- [ ] 03-03-PLAN.md — Convert buttons, markdown, toast, spinner, modal + visual verification

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Auth Pipeline | 2/2 | Complete   | 2026-03-19 |
| 2. Theme Infrastructure | 2/2 | Complete   | 2026-03-19 |
| 3. Företagarna Visual Theme | 2/3 | In Progress|  |
