# Företagarna Theme for Globy Chatbot

## What This Is

A customer-specific visual theme ("företagarna") for the Globy chatbot platform. The theme is activated per-user based on the authentication flow — when a user arrives via a themed landing page URL, the theme identifier is stored in the backend and returned by the auth API. The chatbot frontend then applies a completely different visual style: colors, typography, layout, and chat bubble styling — all following the Företagarna design system (Scandinavian, clean, deep teal accent).

## Core Value

The chatbot must seamlessly switch between the default Globy theme and the Företagarna theme based on the authenticated user's theme setting, with zero visual artifacts or style leakage between themes.

## Requirements

### Validated

<!-- Existing capabilities inferred from codebase -->

- ✓ Auth0-based authentication with token management — existing
- ✓ Real-time WebSocket chat messaging — existing
- ✓ SCSS-based styling system — existing
- ✓ Provider-based state management (AuthProvider, AppContextProvider) — existing
- ✓ API service layer with Axios interceptors — existing
- ✓ React Router 7 routing — existing

### Active

- [ ] Backend stores `theme` parameter from landing page redirect through auth flow
- [ ] Auth API returns `theme` field in user response
- [ ] Frontend reads theme from auth API response and applies it globally
- [ ] Företagarna color palette applied (deep teal `#20565D` accent, `#333333` text, `#F5F5F5` alt bg)
- [ ] Företagarna typography applied (Inter font, weight hierarchy, fluid sizing)
- [ ] Chat bubbles styled per theme (message containers, input area, bot responses)
- [ ] Sidebar/header layout adapted for Företagarna theme
- [ ] Default Globy theme remains unchanged and is the fallback
- [ ] Theme switching is instant on auth (no flash of wrong theme)
- [ ] Globy logo retained across both themes

### Out of Scope

- Different bot personality or behavior per theme — visual only
- Different features or flows per theme — same functionality
- Dark mode variant for Företagarna — not requested
- Theme selector UI — theme is determined by auth, not user choice
- Mobile app theming — web only

## Context

- The Företagarna theme follows a Volvo-inspired Scandinavian design: monochromatic base, single deep teal accent (`#20565D`), Inter font, generous whitespace, no gradients on surfaces, shadows only on hover
- The chatbot currently uses SCSS for all styling — theme system should integrate with this
- Backend authenticator lives at `/home/berre/gits/Globy2.0` (globy-authenticator service)
- Theme is passed via URL parameter on the landing page: `?theme=foretagarna`
- The theme parameter flows: landing page → Auth0 redirect → authenticator callback → stored in user/session → returned in auth API response → frontend applies

## Constraints

- **Tech stack**: Must use existing SCSS system, no new CSS-in-JS library
- **Backend**: Theme storage in globy-authenticator at `/home/berre/gits/Globy2.0`
- **Auth flow**: Theme parameter must survive the Auth0 redirect round-trip
- **Compatibility**: Default theme must not be affected — zero regression
- **Font loading**: Inter font loaded from Google Fonts (preconnect required)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| CSS custom properties for theme tokens | SCSS variables compile away; CSS vars allow runtime switching | — Pending |
| Theme determined by auth, not user toggle | Customer pipeline requirement — theme tied to business relationship | — Pending |
| Keep Globy logo across themes | No separate Företagarna logo provided | — Pending |

---
*Last updated: 2026-03-19 after initialization*
