# Architecture

**Analysis Date:** 2026-03-19

## Pattern Overview

**Overall:** Layered Client-Side Architecture with Provider-Based State Management

**Key Characteristics:**
- React Router 7 for client-side routing and SSR integration
- Zustand for global application state (messaging, UI state)
- Context API for provider-based state and dependency injection
- WebSocket real-time communication for bidirectional messaging
- Authenticated API requests via Auth0 integration
- Modular component architecture with feature-based organization

## Layers

**Presentation/UI Layer:**
- Purpose: React components for user interface rendering
- Location: `app/components/` and `app/routes/`
- Contains: Functional React components (TSX), styled with SCSS
- Depends on: Hooks layer, providers, stores
- Used by: React Router, browser rendering

**Hooks Layer:**
- Purpose: Encapsulate component logic, state management, and side effects
- Location: `app/hooks/`
- Contains: Custom React hooks (useWebSocket, useTextField, useUploadFiles, etc.)
- Depends on: Stores, providers, services
- Used by: Components, providers

**Providers/Context Layer:**
- Purpose: Application-level state, authentication, WebSocket connection management
- Location: `app/providers/`
- Contains: Context providers (AuthProvider, AppContextProvider, WebSocketProvider, ChatBoxProvider)
- Depends on: Services, stores, Auth0
- Used by: Root component, entire application

**Services/API Layer:**
- Purpose: HTTP client abstraction and API endpoints
- Location: `app/services/`
- Contains: Axios instance configuration, API functions grouped by domain
- Depends on: Token manager, environment configuration
- Used by: Hooks, providers, components

**State Management Layer:**
- Purpose: Predictable, global state management
- Location: `app/stores/`
- Contains: Zustand stores for messages and application UI state
- Depends on: Type definitions
- Used by: Providers, hooks, components

**Types & Configuration:**
- Purpose: Type definitions, enums, environment variables
- Location: `app/types/`, `app/utils/`
- Contains: TypeScript interfaces, enums, configuration
- Depends on: Nothing (foundational)
- Used by: All layers

**Styling:**
- Purpose: SCSS organization with 7-1 architecture pattern
- Location: `app/style/`
- Contains: Variables, mixins, base styles, component styles
- Depends on: Nothing (foundational)
- Used by: Components

## Data Flow

**Authentication & Initialization Flow:**

1. User lands on app → React Router loads `root.tsx`
2. Root Layout wraps app with providers in order:
   - AuthProvider (Auth0 integration)
   - AppContextProvider (user verification & setup)
   - WebSocketProvider (message handling)
3. AuthProvider checks Auth0 authentication status
4. AppContextProvider verifies user with backend, gets userId
5. AppContextProvider sets token getter via tokenManager
6. WebSocketProvider connects to WebSocket server using userId
7. AppContextProvider initializes Zustand stores

**Message Flow (User → Server → UI):**

1. User types in ChatBox component (`app/routes/chat/components/chatbox/chat-box.tsx`)
2. TextField hook captures input via `useTextField()` hook
3. On submit, hook calls `sendMessage()` from WebSocketProvider
4. WebSocketProvider adds token via tokenManager and sends over WebSocket
5. WebSocket message handler receives response (MessageResponse)
6. Handler calls store's `addAssistantMessageFromLastMessage()`
7. Store updates messages array in Zustand state
8. History component (`app/routes/chat/components/history.tsx`) receives updated messages
9. History renders messages with ReactMarkdown for formatting
10. Auto-scroll hook (`useScrollChatBox`) keeps latest message visible

**Color Preference Flow:**

1. ColorPicker component selected in Sidebar
2. User selects colors
3. Sidebar component calls `setUserColorPreferences()` from appApis service
4. Service makes POST to `/chatbot/v1/colors` endpoint
5. useUserColorPreferences hook fetches latest preferences
6. Updated preferences displayed in ColorPicker

**Chat History Load-More Flow:**

1. User scrolls to top of message history
2. useLoadMoreHistory hook detects scroll
3. Calls `getConversation()` from WebSocketProvider
4. WebSocketProvider calls `fetchHistory()` from appApis service
5. API returns paginated messages with next_offset
6. Store prepends old messages to current messages
7. Offset updates in appStore for next pagination

## Key Abstractions

**Message Management:**
- Purpose: Standardized message handling between user input and API
- Location: `app/types/models.ts`, `app/stores/websocketStore.ts`, `app/providers/WSProdivder.tsx`
- Pattern: Zustand store for immutable message state; store provides pure update functions
- Types: ChatMessage (combined user/assistant), MessageResponse (from server), MessageRequest (to server)

**Authentication & Token Management:**
- Purpose: Centralized JWT token lifecycle and Auth0 integration
- Location: `app/services/tokenManager.ts`, `app/providers/AuthProvider.tsx`, `app/services/axiosInstance.ts`
- Pattern: Token getter function injected at app startup; axios interceptor auto-attaches tokens
- Flow: Auth0 provides access token → stored in sessionStorage → auto-attached to API calls

**API Client Abstraction:**
- Purpose: Unified HTTP requests with automatic auth, base URL, timeout configuration
- Location: `app/services/axiosInstance.ts`
- Pattern: Configured Axios instance with request interceptor for token injection
- Benefits: Single source of truth for API configuration, automatic token management

**Provider Composition:**
- Purpose: Nested context providers for dependency injection
- Location: `app/providers/`, `app/root.tsx`
- Pattern: Root Layout wraps providers in intentional order (Auth → App → WebSocket)
- Benefits: Clean separation of concerns, easy provider addition/removal

**WebSocket Connection:**
- Purpose: Real-time bidirectional communication for chat messages
- Location: `app/providers/WSProdivder.tsx`
- Pattern: useCallback for connection logic, useRef for persistent connection reference
- Handles: Auto-reconnect on disconnect, message parsing, store updates

**File Upload Management:**
- Purpose: Handle file selection, validation, and S3 integration
- Location: `app/hooks/useUploadFiles.tsx`
- Pattern: Manages local file state (IUploadFile[]), integrates with chatbox submission
- Flow: File selected → displayed in preview → included in message send

## Entry Points

**Application Root:**
- Location: `app/root.tsx`
- Triggers: React Router application startup
- Responsibilities: Wraps entire app with providers, error boundary, global layout

**Chat Route:**
- Location: `app/routes/chat/chat.tsx`
- Triggers: Default index route, Auth0 withAuthenticationRequired wrapper
- Responsibilities: Main UI layout (sidebar + chat window), message history loading, sidebar toggle state

**Main Chat Component:**
- Location: `app/routes/chat/components/chatbox/chat-box.tsx`
- Triggers: Rendered within ChatBoxProvider in chat route
- Responsibilities: Text input, file upload, message submission

**Sidebar Component:**
- Location: `app/routes/chat/components/sidebar/sidebar.tsx`
- Triggers: Rendered in chat route layout
- Responsibilities: User profile, color preferences, image library, service/booking setup, site type picker

## Error Handling

**Strategy:** Try-catch in async operations with toast notifications for user feedback

**Patterns:**
- Auth errors: Logout and redirect to landing page (`app/providers/AppContextProvider.tsx` lines 76-87)
- API errors: Toast error messages with axios error parsing (`app/providers/WSProdivder.tsx` lines 142-145)
- WebSocket errors: Auto-reconnect after 1s delay if code !== 1000 (`app/providers/WSProdivder.tsx` lines 75-79)
- Network failures: Graceful degradation with cached data when possible (sidebar booking status caching)
- Type validation: TypeScript strict mode in tsconfig, Valibot for runtime validation imports

## Cross-Cutting Concerns

**Logging:**
- console.warn/error for development (WebSocket connection status, token refresh)
- react-hot-toast for user-facing error notifications
- No centralized logging infrastructure

**Validation:**
- TypeScript strict mode for compile-time checking
- Valibot imported but usage patterns not extensive
- Manual validation in services and hooks

**Authentication:**
- Auth0 provider at root level
- Token injected via axios interceptor
- Session storage for token caching
- Email verification required before app access

**Environment Configuration:**
- Centralized in `app/utils/envConfig.ts`
- Environment variables with VITE_ prefix
- Config includes: Auth0, API URLs, WebSocket URL, Stripe keys, image library endpoints

---

*Architecture analysis: 2026-03-19*
