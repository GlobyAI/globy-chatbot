# Technology Stack

**Analysis Date:** 2026-03-19

## Languages

**Primary:**
- TypeScript 5.9.2 - Full codebase with React components and services
- JavaScript (ES2022) - Build configuration and runtime

**Secondary:**
- SCSS 1.93.2 - Styling

## Runtime

**Environment:**
- Node.js 22 (Alpine Linux) - Docker build and production runtime

**Package Manager:**
- npm (lockfile v3) - `package-lock.json` present

## Frameworks

**Core:**
- React 19.2.3 - UI framework
- React Router 7.9.2 - Full-stack web framework with built-in routing
- React DOM 19.2.3 - DOM rendering

**Build/Development:**
- Vite 7.1.7 - Build tool with React Router integration
- @react-router/dev 7.9.2 - React Router development tooling
- @react-router/node 7.9.2 - React Router Node.js runtime adapter
- @react-router/serve 7.9.2 - Production server for React Router

**State Management:**
- Zustand 5.0.8 - Lightweight state management (`~/stores/websocketStore.ts`, `~/stores/appStore.ts`)

**Form/Validation:**
- Valibot 1.2.0 - Schema validation library

**Styling/UI:**
- SASS 1.93.2 - CSS preprocessor
- @uiw/react-color 2.9.2 - Color picker component

**Utilities:**
- axios 1.13.2 - HTTP client with interceptor-based auth
- react-hot-toast 2.6.0 - Toast notifications
- react-markdown 10.1.0 - Markdown rendering
- mdast-util-to-hast 13.2.1 - Markdown AST processing
- glob 13.0.0 - File pattern matching
- isbot 5.1.31 - Bot detection

## Build Configuration

**Entry Point:**
- React Router SPA (Single Page Application)
- `react-router.config.ts` - Framework configuration with SSR disabled

**Build Output:**
- Client build: `/build/client`
- TypeScript: Strict mode enabled, targets ES2022
- CSS minification enabled in production

**Path Aliases:**
- `~/*` → `./app/*` - Configured in `tsconfig.json`

## Configuration Files

**TypeScript:**
- `tsconfig.json` - ES2022 target, strict mode, React JSX

**Vite:**
- `vite.config.ts` - React Router plugins, VITE_BASE_PATH environment variable support

**React Router:**
- `react-router.config.ts` - SPA mode (SSR: false), standard configuration

## Platform Requirements

**Development:**
- Node.js 22+
- npm 10+ (implied by package-lock.json v3)
- TypeScript compiler for type checking

**Production:**
- Node.js 22-alpine Docker image
- Static server (using `serve` package)
- Environment variables injected at build time (Dockerfile ARG)

**Environment Variables (Build-time, Vite):**
- `VITE_WEB_SOCKET_URL` - WebSocket server URL
- `VITE_AUTH0_DOMAIN` - Auth0 tenant domain
- `VITE_AUTH0_CLIENT_ID` - Auth0 application client ID
- `VITE_AUTH0_AUDIENCE` - Auth0 API audience
- `VITE_AUTH0_SCOPE` - Auth0 scopes (optional in code)
- `VITE_APP_DOMAIN` - Application redirect URI
- `VITE_API_URL` - Main API base URL
- `VITE_AUTH_API_URL` - Auth-specific API endpoint
- `VITE_LANDING_PAGE` - Landing page URL
- `VITE_IMAGE_LIBRARY_API` - Image management API
- `VITE_CHECKOUT_URL` - Payment checkout endpoint
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable API key
- `VITE_SIDE_STATUS_API` - Site status API endpoint
- `VITE_BASE_PATH` - Base path for deployment (default: `/`)
- `VITE_BOOKING_API_URL` - Booking/service management API

---

*Stack analysis: 2026-03-19*
