# Codebase Concerns

**Analysis Date:** 2026-03-19

## Tech Debt

**Missing Test Coverage:**
- Issue: Zero test files found in codebase. No `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx` files exist.
- Files: All production files lack corresponding tests
- Impact: Unable to safely refactor, high risk of regressions when changing critical paths like auth, payment, or websocket logic
- Fix approach: Establish testing infrastructure (jest/vitest config), add tests for critical paths first (auth flows, API calls, state management)

**Console Logging Left in Production Code:**
- Issue: 31+ `console.log()` and `console.error()` statements remain in codebase
- Files: `app/providers/WSProdivder.tsx` (3 instances), `app/components/IdentityType/IdentityType.tsx` (2), `app/components/ServiceBusiness/GlobyBookingSetup.tsx` (3), multiple hooks
- Impact: Debug logs expose internal behavior in production, clutters browser console, may contain sensitive information
- Fix approach: Remove all console statements from production code, implement proper logging service (Sentry or similar) for error tracking

**Untyped/Any Types in TypeScript:**
- Issue: Multiple uses of `any` type violating TypeScript strict mode
- Files: `app/components/Slider/Slider.tsx` (data: any), `app/hooks/useHorizontalScroll.tsx` (data: any), `app/hooks/useResizeTextarea.tsx` (value: any), `app/providers/AuthProvider.tsx` (appState: any), `app/services/auth0Apis.ts` ([key: string]: any)
- Impact: Type safety compromised, IDE intellisense loses context, runtime errors may occur undetected
- Fix approach: Replace all `any` with proper TypeScript types, enable `@typescript-eslint/no-explicit-any` rule

**Large Component Files:**
- Issue: Single components exceed safe limits for readability and maintenance
- Files: `app/components/ServiceBusiness/GlobyBookingSetup.tsx` (585 lines), `app/routes/chat/components/sidebar/sidebar.tsx` (266+ lines), `app/routes/pricing/Pricing.tsx` (284 lines), `app/components/ColorPicker/ColorPicker.tsx` (279 lines)
- Impact: Difficult to test, understand, modify; multiple responsibilities mixed in single file
- Fix approach: Extract smaller sub-components, split into feature-based modules, aim for <150 lines per component

## Known Bugs & Issues

**Auth0 Metadata Update Redirect Issue:**
- Issue: When Auth0 app metadata is updated in `AppContextProvider.tsx`, a `loginWithRedirect` is called which may cause unexpected navigation
- Files: `app/providers/AppContextProvider.tsx` (lines 155-169)
- Symptom: Users may be redirected to login even when already authenticated after first-time setup
- Workaround: Accept redirect and re-authenticate on first app use
- Root cause: Update triggers re-authentication flow instead of soft refresh

**Loading State Set Then Immediately Unset:**
- Issue: In `IdentityType.tsx`, loading state is set to true then immediately set to false in same effect
- Files: `app/components/IdentityType/IdentityType.tsx` (lines 61-65)
- Symptom: Loading state doesn't work; users see no loading indicator while identity is being checked
- Trigger: Component first mounts with `hasIdentity: false`
- Fix: Move `setIsLoading(false)` into the async checkIdentity function after API call completes

**Stripe URL Construction with Window.location.href:**
- Issue: Stripe callback URLs constructed by appending query params to `window.location.href`
- Files: `app/components/ServiceBusiness/GlobyBookingSetup.tsx` (lines 291-295)
- Impact: If user is on a page with query params, the return URL becomes malformed; Stripe cannot redirect back properly
- Symptom: Stripe onboarding may fail to redirect to completion page
- Fix: Use proper URL construction with URL() API

**Commented-Out Code with Sensitive Logic:**
- Issue: Large blocks of commented code remain in codebase, including reference ID handling and sales tracking
- Files: `app/providers/AppContextProvider.tsx` (lines 113-153, 111-192)
- Impact: Dead code creates confusion, makes maintenance harder, commented errors suggest incomplete features
- Fix: Remove all commented code or implement as feature flags if still needed

## Security Considerations

**Session Token Storage in SessionStorage:**
- Risk: Auth tokens stored in `sessionStorage` which is accessible to any script on the page (XSS vulnerability)
- Files: `app/services/tokenManager.ts` (lines 13, 19), `app/providers/AppContextProvider.tsx` (line 94)
- Current mitigation: Relies on Auth0 silent refresh to keep token fresh
- Recommendations:
  - Consider HTTP-only cookies with secure flag (requires backend support)
  - Implement Content Security Policy (CSP) to prevent XSS
  - Use `localStorage` only for non-sensitive data
  - Add token expiration checking before use

**Unsanitized Error Messages to Users:**
- Risk: Error messages from API responses shown directly to users without sanitization
- Files: `app/components/ServiceBusiness/GlobyBookingSetup.tsx` (lines 213, 277, 307), multiple other API error handlers
- Impact: May expose internal API details or implementation specifics
- Recommendations: Map API error codes to user-friendly messages, log full errors server-side only

**Missing Environment Variable Validation:**
- Risk: No validation that required env vars are set at app startup
- Files: `app/services/bookingApis.ts` only warns when BOOKING_API_URL missing, doesn't block
- Impact: Silent failures when critical APIs are misconfigured
- Recommendations: Fail fast on missing required config, validate all required vars in app initialization

**Direct Window Location Navigation:**
- Risk: Uses `window.location.href` for navigation without validation
- Files: `app/providers/AppContextProvider.tsx` (line 69), `app/components/ServiceBusiness/GlobyBookingSetup.tsx` (line 298)
- Impact: Potential for malicious URL injection if environment config is compromised
- Recommendations: Validate URLs, use React Router navigation instead of `window.location.href`

## Performance Bottlenecks

**WebSocket Message Parsing Without Validation:**
- Problem: Raw JSON parse on WebSocket messages without schema validation
- Files: `app/providers/WSProdivder.tsx` (line 84)
- Cause: `JSON.parse()` called directly without try-catch (has catch but no schema validation)
- Impact: Invalid messages silently fail, malformed messages could crash the app
- Improvement path: Add message schema validation with valibot/zod before processing

**Multiple useEffect Dependencies Leading to Reconnections:**
- Problem: WebSocket reconnects unnecessarily due to unoptimized dependencies
- Files: `app/providers/WSProdivder.tsx` (lines 156-165)
- Cause: `connect` callback is recreated on every render due to `[userId]` dependency
- Impact: WebSocket drops and reconnects frequently, degraded chat experience
- Improvement path: Use `useCallback` with proper memoization, consider extract connection logic

**ColorPicker Component Expensive Re-renders:**
- Problem: Complex color picker with many useCallback hooks but still triggers full re-renders
- Files: `app/components/ColorPicker/ColorPicker.tsx` (279 lines, multiple state updates)
- Cause: State updates in color picker trigger parent component re-renders through callbacks
- Impact: Noticeable lag when color is being adjusted
- Improvement path: Consider context or state management for color state, memoize color picker component

**ImageLibrary Fetch Without Pagination:**
- Problem: Fetches all images from image library in single request
- Files: `app/hooks/useUploadLogo.tsx` (uses fetchImageLibrary)
- Impact: Slow load if user has many uploaded images
- Improvement path: Add pagination to image library fetch, lazy-load images on scroll

## Fragile Areas

**AppContextProvider - Auth State Management:**
- Files: `app/providers/AppContextProvider.tsx` (229 lines)
- Why fragile: Complex auth flow with multiple API calls, error paths, and side effects; Auth0 metadata updates trigger redirects; commented-out reference ID logic suggests incomplete refactoring
- Safe modification:
  - Extract auth verification into separate hook
  - Remove commented code completely
  - Use explicit error handling for each async operation
  - Add loading states for each operation, not global loading
- Test coverage: No tests exist; high priority for unit/integration tests

**WebSocket Provider - Real-time Communication:**
- Files: `app/providers/WSProdivder.tsx` (221 lines)
- Why fragile: Connection state managed with refs and multiple useState calls; reconnection logic uses setTimeout; message parsing unvalidated; connection cleanup may be incomplete
- Safe modification:
  - Add message schema validation
  - Use effect cleanup properly
  - Test reconnection scenarios
  - Add connection timeout handling
- Test coverage: No tests; critical for chat functionality

**ServiceBusiness/GlobyBookingSetup - Multi-step Flow:**
- Files: `app/components/ServiceBusiness/GlobyBookingSetup.tsx` (585 lines)
- Why fragile: Large component managing three distinct steps with form state, service templates, and API calls; brittle string validation (checks `success !== false` instead of `success === true`)
- Safe modification:
  - Extract each step as separate component
  - Create form state management hook
  - Use TypeScript discriminated unions for step state
  - Use strict equality checks for API responses
- Test coverage: No tests; directly affects onboarding critical path

## Scaling Limits

**WebSocket Connection Per-User Limit:**
- Current capacity: Browser-based websocket (single connection per user)
- Limit: Scales only as far as server can handle concurrent connections
- Scaling path: Monitor connection count, implement connection pooling if needed, consider reconnection backoff

**Image Upload Size Limits:**
- Current capacity: Not explicitly defined in code
- Impact: Large uploads may timeout or fail silently
- Limit: Depends on S3 configuration and 30-second axios timeout
- Scaling path: Add file size validation, chunked upload for large files, progress tracking for UX

**Chat History Pagination:**
- Current capacity: Uses offset-based pagination with MESSAGE_LIMIT
- Limit: Offset gets to -1 when no more history (infinite pagination support exists)
- Scaling path: Current approach works but consider cursor-based pagination for better performance with large datasets

## Dependencies at Risk

**Auth0 React SDK (`@auth0/auth0-react` ^2.9.0):**
- Risk: Single dependency for entire auth system; any breaking change blocks app
- Impact: If Auth0 changes API, entire auth flow fails
- Migration plan: Maintain auth abstraction layer, not tightly coupled to Auth0 SDK directly; consider adding adapter pattern

**Axios Instances (`axios` ^1.13.2):**
- Risk: Multiple axios instances created (appApis, bookingApis) without shared interceptor logic
- Impact: Code duplication, hard to update auth logic in single place
- Migration plan: Create factory function for axios instances, centralize interceptor configuration

**@uiw/react-color Dependency:**
- Risk: Niche color picker library with limited community
- Impact: If library unmaintained, no color picker in UI
- Migration plan: Either vendor the code or switch to more actively maintained library (react-colorful, react-color)

## Test Coverage Gaps

**Authentication & Authorization:**
- What's not tested: Auth0 integration, token refresh, user ID verification, payment check logic
- Files: `app/providers/AppContextProvider.tsx`, `app/services/authApis.ts`
- Risk: Auth bypass, invalid users accessing system, payment verification failure
- Priority: High - Core security concern

**API Integration:**
- What's not tested: All API calls (booking, chat, image upload, payments), error handling, retry logic
- Files: `app/services/*`, `app/hooks/useUploadLogo.tsx`, `app/hooks/useFetchKpis.tsx`
- Risk: Breaking changes in backend API go undetected, error handling ineffective
- Priority: High - Affects all features

**WebSocket Communication:**
- What's not tested: Connection/reconnection, message parsing, error scenarios
- Files: `app/providers/WSProdivder.tsx`
- Risk: Chat breaks silently, messages lost, infinite reconnection loops
- Priority: High - Core functionality

**Complex Components:**
- What's not tested: Multi-step forms, state transitions, error states
- Files: `app/components/ServiceBusiness/GlobyBookingSetup.tsx` (all steps), `app/components/ColorPicker/ColorPicker.tsx`
- Risk: UI bugs in critical user flows (onboarding, payments)
- Priority: High - User-facing flows

**Hooks:**
- What's not tested: Custom hooks for file upload, data fetching, state management
- Files: `app/hooks/useUploadLogo.tsx`, `app/hooks/useFetchKpis.tsx`, `app/hooks/useScrollChatBox.tsx`
- Risk: Business logic broken by refactoring
- Priority: Medium

---

*Concerns audit: 2026-03-19*
