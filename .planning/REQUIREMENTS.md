# Requirements: Företagarna Theme

**Defined:** 2026-03-19
**Core Value:** Seamlessly switch between default Globy theme and Företagarna theme based on authenticated user's theme setting

## v1 Requirements

### Backend / Auth Flow

- [x] **AUTH-01**: Landing page passes `theme` parameter through Auth0 redirect (survives round-trip)
- [x] **AUTH-02**: globy-authenticator stores theme value for the user/session
- [x] **AUTH-03**: Auth API response includes `theme` field (defaults to `"globy"` when absent)

### Theme Infrastructure

- [ ] **INFRA-01**: Frontend reads theme from auth API response on login
- [ ] **INFRA-02**: Theme is available globally via provider/store (no prop drilling)
- [x] **INFRA-03**: CSS custom properties switch at runtime based on active theme
- [x] **INFRA-04**: Default Globy theme is applied when no theme or unknown theme is set
- [ ] **INFRA-05**: No flash of wrong theme on initial load

### Företagarna Visual Theme

- [ ] **THEME-01**: Företagarna color palette applied (`#20565D` accent, `#333333` text, `#F5F5F5` alt bg, `#e0e0e0` borders)
- [ ] **THEME-02**: Inter font loaded and applied (weights 300–800, fluid sizing with `clamp()`)
- [ ] **THEME-03**: Chat bubbles restyled (message containers, bot responses, user messages)
- [ ] **THEME-04**: Input area / message composer restyled
- [ ] **THEME-05**: Sidebar restyled (navigation, conversation list)
- [ ] **THEME-06**: Header restyled
- [ ] **THEME-07**: Buttons follow Företagarna spec (4px radius, `#20565D` primary, outlined secondary)
- [ ] **THEME-08**: Shadows only on hover, cards with `8px` radius
- [ ] **THEME-09**: Företagarna spacing and whitespace patterns applied

### Regression Safety

- [ ] **SAFE-01**: Default Globy theme unchanged — zero visual regression
- [ ] **SAFE-02**: Theme styles fully scoped — no leakage between themes

## v2 Requirements

### Extended Theming

- **EXT-01**: Additional customer themes beyond Företagarna
- **EXT-02**: Theme preview/selector for admin users
- **EXT-03**: Dark mode variant for Företagarna theme

## Out of Scope

| Feature | Reason |
|---------|--------|
| Different bot personality per theme | Visual only — behavior unchanged |
| Different features per theme | Same functionality across all themes |
| Theme selector UI | Theme determined by auth flow, not user choice |
| Mobile app theming | Web only |
| Dark mode for Företagarna | Not requested for v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Complete |
| AUTH-02 | Phase 1 | Complete (plan 01-01) |
| AUTH-03 | Phase 1 | Complete (plan 01-01) |
| INFRA-01 | Phase 2 | Pending |
| INFRA-02 | Phase 2 | Pending |
| INFRA-03 | Phase 2 | Complete |
| INFRA-04 | Phase 2 | Complete |
| INFRA-05 | Phase 2 | Pending |
| THEME-01 | Phase 3 | Pending |
| THEME-02 | Phase 3 | Pending |
| THEME-03 | Phase 3 | Pending |
| THEME-04 | Phase 3 | Pending |
| THEME-05 | Phase 3 | Pending |
| THEME-06 | Phase 3 | Pending |
| THEME-07 | Phase 3 | Pending |
| THEME-08 | Phase 3 | Pending |
| THEME-09 | Phase 3 | Pending |
| SAFE-01 | Phase 3 | Pending |
| SAFE-02 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-19*
*Last updated: 2026-03-19 — traceability populated after roadmap creation*
