# External Integrations

**Analysis Date:** 2026-03-19

## APIs & External Services

**Authentication:**
- Auth0 - User identity and authentication
  - SDK/Client: `@auth0/auth0-react` v2.9.0
  - Auth: `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE`, `VITE_AUTH0_SCOPE`
  - Implementation: `app/providers/AuthProvider.tsx`
  - API calls: `app/services/auth0Apis.ts` - updates user metadata via Auth0 Management API v2

**Payment Processing:**
- Stripe - Payment collection and checkout
  - SDK/Client: `@stripe/stripe-js` v7.9.0, `@stripe/react-stripe-js` v3.8.0
  - Publishable Key: `VITE_STRIPE_PUBLISHABLE_KEY`
  - Implementation: `app/routes/pricing/Pricing.tsx` - Checkout Session integration
  - Setup flow: `app/components/ServiceBusiness/GlobyBookingSetup.tsx` - Stripe Connect onboarding for service providers

**Booking & Scheduling:**
- Cal.com - External booking calendar integration (optional)
  - Purpose: Two-way booking sync for service providers
  - Connection: OAuth flow via backend API
  - Status endpoint: `GET /booking/api/v1/integrations/calcom/status`
  - Connect endpoint: `GET /booking/api/v1/integrations/calcom/connect`
  - Implementation: `app/components/ServiceBusiness/ExternalBookingSetup.tsx`
  - Polling: Client polls connection status every 3 seconds after user auth

**Social Media:**
- Instagram - Content sync integration (optional)
  - Purpose: Auto-sync Instagram feed to website
  - Connection: OAuth flow via backend
  - Connect endpoint: `POST /chatbot/v1/instagram_connect` - returns authorization_url
  - Implementation: `app/components/InstagramOnboarding/InstagramOnboarding.tsx`
  - Flow: Client redirects to authorization URL on backend

**Backend API Services:**
- Main Chatbot API - Core application logic
  - URL: `VITE_API_URL`
  - Client: axios via `axiosInstance` in `app/services/axiosInstance.ts`
  - Auth: Bearer token from `getToken()` via tokenManager
  - Endpoints: `app/services/appApis.tsx` and `app/services/identityApis.ts`

- Auth Verification API - Custom auth layer
  - URL: `VITE_AUTH_API_URL`
  - Purpose: Verify Auth0 token against backend
  - Implementation: `app/services/authApis.ts` - `verifyUser()` function

- Booking API - Service and appointment management
  - URL: `VITE_BOOKING_API_URL`
  - Client: axios via `bookingAxios` in `app/services/bookingApis.ts`
  - Purpose: Manage services, appointments, Cal.com integration, payment setup
  - Endpoints:
    - `POST /booking/api/v1/onboarding/start` - Initialize business onboarding
    - `POST /booking/api/v1/onboarding/services/accept` - Accept/configure services
    - `GET /booking/api/v1/integrations/calcom/connect` - Get Cal.com auth URL
    - `GET /booking/api/v1/integrations/calcom/status` - Check Cal.com connection
    - `GET /booking/api/v1/booking/status` - Get booking configuration status
    - `POST /booking/api/v1/payments/setup` - Setup Stripe payment onboarding

- Image Library API - Image asset management
  - URL: `VITE_IMAGE_LIBRARY_API`
  - Endpoint: `/images?bucket=globylibrary-{userId}`
  - Implementation: `app/services/appApis.tsx` - `fetchImageLibrary()`

- Site Status API - Site deployment status
  - URL: `VITE_SIDE_STATUS_API`
  - Implementation: `app/services/appApis.tsx` - `checkSiteStatus()`

- Checkout/Payment Orchestration API
  - URL: `VITE_CHECKOUT_URL`
  - Purpose: Create Stripe Checkout Sessions
  - Request body: `{ customer_email, product_name, interval, success_url, cancel_url }`
  - Response: `{ session_id, stripe_session }`
  - Implementation: `app/routes/pricing/Pricing.tsx`

## Data Storage

**Databases:**
- Backend-managed (not visible in frontend code)
  - User data persists via Auth0 + backend Auth API
  - Business info, services, bookings managed by Booking API
  - Site configuration managed by main Chatbot API

**File Storage:**
- Image Library API - Stores generated images and user uploads
  - Connection: `VITE_IMAGE_LIBRARY_API`
  - Bucket naming: `globylibrary-{userId}`

**Caching:**
- None detected - relies on API calls for fresh data

## Authentication & Identity

**Auth Provider:**
- Auth0
  - Implementation: `app/providers/AuthProvider.tsx`
  - Configuration:
    - Domain: `VITE_AUTH0_DOMAIN`
    - Client ID: `VITE_AUTH0_CLIENT_ID`
    - Audience: `VITE_AUTH0_AUDIENCE`
    - Scope: `VITE_AUTH0_SCOPE`
    - Redirect URI: `VITE_APP_DOMAIN`
    - Token caching: Memory-based (no refresh tokens in localStorage)
    - Refresh tokens enabled: Yes
  - Token retrieval: `app/services/tokenManager.ts` - `getToken()` function
  - User verification: Backend Auth API validates Auth0 token

**Token Management:**
- `app/services/tokenManager.ts` - Centralized token retrieval
- Used by all axios instances for Authorization header injection
- Request interceptors auto-inject token in: `axiosInstance`, `bookingAxios`

## Monitoring & Observability

**Error Tracking:**
- None detected - console.error/console.warn used for debugging

**Logs:**
- Console logging with prefixes:
  - WebSocket: `[WS]` prefix in `app/providers/WSProdivder.tsx`
  - Auth: Debug logs in Auth0 provider
  - API: Error logs in service functions

**Analytics & Conversion:**
- Google Tag Manager - Page tracking
  - GTM ID: `GTM-5TKDP9VM` (hardcoded in `app/root.tsx`)
  - Script: Injected in document head

- Google Ads Conversion Tracking
  - Conversion ID: `AW-17001169572/53lxCNKpn-4aEKSF5ao_`
  - Fired on payment success pages: `app/routes/payment-success/PaymentSuccess.tsx`
  - Implementation: `window.gtag("event", "conversion", {...})`

- Pagesense - Analytics and A/B testing
  - Script: `https://cdn-eu.pagesense.io/js/globyab/a85054401a7541b5944af1d55bb0efb1.js`
  - Injected in document head: `app/root.tsx`

## CI/CD & Deployment

**Hosting:**
- Not specified in frontend code - backend deployment details unknown

**Environment Configuration:**
- Frontend: Vite with environment variables
- `.env.exampel` (template) contains all required variables
- Runtime: React Router with Node.js backend support

## Webhooks & Callbacks

**Incoming Webhooks:**
- None directly in frontend code (backend likely receives)
- Cal.com OAuth callback: Handled via status polling endpoint

**Outgoing Webhooks/Callbacks:**
- Stripe Checkout: Success/cancel redirects
  - Success: `/success/{product_name}`
  - Cancel: `/pricing`
  - Implementation: `app/routes/pricing/Pricing.tsx`

- Stripe Payment Setup: Return URLs for Stripe Connect onboarding
  - Return URL: Current URL + `?stripe=success`
  - Refresh URL: Current URL + `?stripe=refresh`
  - Implementation: `app/components/ServiceBusiness/GlobyBookingSetup.tsx`

- Auth0 Callback: Redirect after login
  - Default: `/`
  - Post-payment: Redirects to `/payment-success?session_id={session_id}`
  - Implementation: `app/providers/AuthProvider.tsx`

- Instagram OAuth: Redirects to authorization URL from backend
  - Implementation: `app/components/InstagramOnboarding/InstagramOnboarding.tsx`

- Cal.com OAuth: Opens in new tab, client polls status
  - Implementation: `app/components/ServiceBusiness/ExternalBookingSetup.tsx`

## WebSocket Connection

**Real-time Communication:**
- Backend WebSocket Server
  - URL: `VITE_WS_URL`
  - Purpose: Real-time chat messaging and AI assistant responses
  - Auth: User token passed in init message
  - Implementation: `app/providers/WSProdivder.tsx`
  - Connection: Initializes with `___ HELLO ___` message containing user token
  - Message types: `USER_MESSAGE`, `ASSISTANT_DONE` (enums in `app/types/enums.ts`)
  - Auto-reconnect: Yes, retries every 1000ms on close
  - History fetch: Loads chat history from `/chatbot/v1/chat_history` on initial connection

## Environment Configuration

**Required env vars for integrations:**
```
# Auth0
VITE_AUTH0_DOMAIN=https://your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id
VITE_AUTH0_AUDIENCE=your_api_audience
VITE_AUTH0_SCOPE=openid profile email

# APIs
VITE_API_URL=https://api.example.com
VITE_AUTH_API_URL=https://auth-api.example.com
VITE_BOOKING_API_URL=https://booking-api.example.com
VITE_WEB_SOCKET_URL=wss://ws.example.com

# Payment & Checkout
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx or pk_live_xxx
VITE_CHECKOUT_URL=https://checkout-service.example.com

# Assets & Storage
VITE_IMAGE_LIBRARY_API=https://image-lib.example.com
VITE_SITE_STATUS=https://site-status.example.com

# App Configuration
VITE_APP_DOMAIN=https://app.example.com
VITE_LANDING_PAGE=https://landing.example.com
```

**Secrets location:**
- Environment variables file (`.env` or `.env.local`)
- Production: Environment manager (likely cloud provider's secret manager)

---

*Integration audit: 2026-03-19*
