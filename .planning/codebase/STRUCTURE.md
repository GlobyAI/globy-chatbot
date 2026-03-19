# Codebase Structure

**Analysis Date:** 2026-03-19

## Directory Layout

```
globy-chatbot/
├── app/                          # Main application source code
│   ├── components/               # Reusable UI components
│   ├── hooks/                    # Custom React hooks
│   ├── providers/                # React context providers
│   ├── routes/                   # Route definitions and page components
│   ├── services/                 # API client functions
│   ├── stores/                   # Zustand global state stores
│   ├── style/                    # SCSS stylesheets (7-1 architecture)
│   ├── types/                    # TypeScript interfaces and enums
│   ├── utils/                    # Utility functions and helpers
│   ├── global.d.ts               # Global TypeScript definitions
│   └── root.tsx                  # React Router root component with providers
├── public/                       # Static assets (icons, images, fonts)
├── build/                        # Build output directory
├── node_modules/                 # Dependencies
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
├── react-router.config.ts        # React Router configuration
├── .env                          # Environment variables (local)
└── README.md                     # Project documentation
```

## Directory Purposes

**app/:**
- Purpose: All source code for the React application
- Contains: Components, hooks, state, services, types, styling
- Key files: `root.tsx` (app root), `routes.ts` (route config)

**app/components/:**
- Purpose: Reusable React UI components
- Contains: Presentational components organized by feature
- Subdirectories include: ColorPicker, ImageUploader, ServiceBusiness, SiteTypePicker, IdentityType, InstagramOnboarding, LoadingOverlay, Slider, Switch, and ui/ (shared UI components)
- Pattern: Each component in its own folder with tsx file and optional styles

**app/components/ui/:**
- Purpose: Generic, reusable UI components (buttons, modals, spinners, etc.)
- Contains: Modal, SpinnerLoading, TypingIndicator
- Usage: Imported throughout the app for consistency

**app/hooks/:**
- Purpose: Custom React hooks encapsulating component logic and side effects
- Contains: useWebSocket (wrapper around provider), useTextField, useUploadFiles, useResizeTextarea, useScrollChatBox, useSiteTypePreference, useClickOutside, useFetchKpis, useLoadMoreHistory, useUploadLogo, useUserColorPreferences, and others
- Pattern: Each hook is a separate file; hooks use other hooks and providers

**app/providers/:**
- Purpose: React context providers for state management and dependency injection
- Contains: AuthProvider (Auth0), AppContextProvider (user init), WebSocketProvider (messaging), ChatBoxProvider (chat UI state), GlobyToast (toast container), WSProvider (WebSocket wrapper)
- Key behavior: Providers wrap app in root.tsx in specific order for dependency resolution

**app/routes/:**
- Purpose: Route-specific page components and their sub-components
- Contains: chat/, pricing/, payment-process/, payment-success/, not-found/ directories
- Active route: chat/ (main application)
- Deactivated routes: pricing/, payment-process/, payment-success/ (commented in routes.ts)
- Pattern: Route folder contains main component + components/ subfolder for route-specific components

**app/routes/chat/:**
- Purpose: Main chat interface and all its sub-components
- Main component: `chat.tsx` (layout with sidebar + chat window)
- Subcomponents:
  - `components/chatbox/`: ChatBox component, file upload, file previews
  - `components/history.tsx`: Message history with markdown rendering
  - `components/sidebar/`: Profile, quality score, color picker, image library, upload logo, service business setup
  - `components/complete.tsx`: Workflow completion button
  - `components/suggestions.tsx`: (commented out)

**app/services/:**
- Purpose: API client functions for backend communication
- Contains: Domain-specific API modules
- Files:
  - `appApis.tsx`: Chatbot endpoints (history, KPIs, colors, image library, site status)
  - `axiosInstance.ts`: Configured Axios client with auto token injection
  - `authApis.ts`: User verification endpoint
  - `auth0Apis.ts`: Auth0 metadata management
  - `tokenManager.ts`: JWT token lifecycle management
  - `bookingApis.ts`: Booking status endpoint
  - `identityApis.ts`: Identity type endpoints
  - `saleApi.ts`: Sales tracking endpoints
- Pattern: Each service is a separate file; functions return promises with typed responses

**app/stores/:**
- Purpose: Zustand global state stores for cross-component state
- Contains: appStore.ts (UI state), websocketStore.ts (chat messages)
- appStore: isLoading, offset, hasNews, setters
- websocketStore: messages[], methods for adding/updating messages
- Pattern: One store per domain; exported as default

**app/style/:**
- Purpose: SCSS stylesheets organized by 7-1 architecture
- Structure:
  - `global.scss`: Main entry point
  - `abstracts/`: Variables, mixins (_colors.scss, _vars.scss, _animation.scss, _breakpoint.scss, _base.scss)
  - `base/`: Foundation styles (_base.scss, _common.scss, _font-faces.scss, components/, pages/, ui/)
- Pattern: Partial files with underscore prefix, organized by abstraction level
- Compiled: Imported and bundled by Vite

**app/types/:**
- Purpose: TypeScript type definitions and enums
- Files:
  - `models.ts`: Interfaces for API responses and data structures (ChatMessage, MessageResponse, UploadedImage, KpisResponse, etc.)
  - `enums.ts`: SENDER (user/assistant), MessageType (delta/done/user_message), IdentityTypeEnum, PaymentInterval, SiteTypeEnum
- Pattern: One conceptual domain per file; re-exported as needed

**app/utils/:**
- Purpose: Helper functions and configuration
- Files:
  - `envConfig.ts`: Environment variable loader with VITE_ prefix
  - `helper.ts`: Utility functions (formatName, generateMessageId)
  - `file.ts`: File handling utilities
  - `colorPickerHelp.ts`: Color picker utilities
  - `vars.ts`: Application constants (MESSAGE_LIMIT, APP_ROUTES)

**public/:**
- Purpose: Static assets served directly
- Contains: Favicon, fonts (Albert Sans), icons (SVG), images (PNG/JPG)
- Path: /icons/ and /images/ accessible from root URL

## Key File Locations

**Entry Points:**
- `app/root.tsx`: React Router root with all providers, error boundary
- `app/routes.ts`: Route configuration defining URL → component mapping
- `package.json` scripts: `dev` (start dev server), `build` (production build), `start` (serve build)

**Configuration:**
- `tsconfig.json`: TypeScript compiler options, path aliases (~/* → app/*)
- `vite.config.ts`: Vite bundler config with React Router plugin
- `react-router.config.ts`: React Router file-based routing metadata
- `.env` / `.env.local`: Environment variables for local development

**Core Logic:**
- `app/providers/AppContextProvider.tsx`: User initialization, payment check, Auth0 metadata sync
- `app/providers/WSProdivder.tsx`: WebSocket connection, message handling, history pagination
- `app/stores/websocketStore.ts`: Message state store, stream concatenation logic
- `app/services/axiosInstance.ts`: API request configuration, token injection

**Chat Features:**
- `app/routes/chat/chat.tsx`: Main chat layout, sidebar toggle state
- `app/routes/chat/components/chatbox/chat-box.tsx`: Message input UI, file upload button
- `app/routes/chat/components/history.tsx`: Message display, edit mode, markdown rendering
- `app/hooks/useTextField.tsx`: Text input state, submit logic, file inclusion
- `app/hooks/useUploadFiles.tsx`: File state, upload progress, S3 integration

**Sidebar Features:**
- `app/routes/chat/components/sidebar/sidebar.tsx`: Layout, event handlers, responsive state
- `app/routes/chat/components/sidebar/profile.tsx`: User info display
- `app/routes/chat/components/sidebar/quality-score.tsx`: KPI display
- `app/routes/chat/components/sidebar/upload-logo.tsx`: Logo upload handler
- `app/routes/chat/components/sidebar/image-library.tsx`: User image gallery

**Styling:**
- `app/style/abstracts/variables/_colors.scss`: Color palette
- `app/style/base/_base.scss`: HTML element defaults
- `app/style/base/components/_chatbox.scss`: Chat input styles
- `app/style/base/pages/`: Page-specific styles

## Naming Conventions

**Files:**
- Components: PascalCase (ColorPicker.tsx, ChatBox.tsx)
- Hooks: camelCase with "use" prefix (useTextField.tsx, useWebSocket.tsx)
- Services: camelCase plural for related endpoints (appApis.ts, authApis.ts)
- Styles: kebab-case (chat-box.scss, _font-faces.scss)
- Types: models.ts, enums.ts (conceptual grouping)
- Utils: camelCase function names in single-responsibility files

**Directories:**
- Components: PascalCase folder names (ColorPicker/, ServiceBusiness/)
- Routes: kebab-case or feature name (chat/, payment-process/)
- Services: camelCase grouping (appApis.ts in services/)
- Utilities: lowercase descriptive names (utils/, hooks/, stores/)

**Functions & Variables:**
- Components: PascalCase (ChatBox, Sidebar)
- Functions: camelCase (handleSubmit, fetchHistory)
- Constants: SCREAMING_SNAKE_CASE (MESSAGE_LIMIT, BOOKING_STATUS_KEY)
- Context/Store hooks: useX naming (useWebSocket, useChatBoxContext)

## Where to Add New Code

**New Feature - Chat-Related:**
- Primary code: `app/routes/chat/components/`
- If chat-specific hooks: `app/hooks/`
- If chat-specific state: Update `app/stores/websocketStore.ts` or create new store
- Tests: Co-located with component

**New Component - Reusable:**
- Implementation: `app/components/{ComponentName}/index.tsx` (or ComponentName.tsx)
- Styles: `app/style/base/components/{component-name}.scss`
- Hook if stateful: `app/hooks/use{ComponentName}.tsx`
- Export: Re-export from component folder index.ts if multiple internal files

**New Page/Route:**
- Add route definition in `app/routes.ts`
- Create page folder: `app/routes/{route-name}/`
- Main component: `app/routes/{route-name}/{RouteNamePage}.tsx`
- Sub-components: `app/routes/{route-name}/components/`

**New API Integration:**
- Create file in `app/services/` named `{domain}Apis.ts`
- Use `axiosInstance` for all requests
- Implement typed response interfaces in `app/types/models.ts`
- Export functions that return Promises with typed responses

**New Global State:**
- Create store in `app/stores/{featureName}Store.ts`
- Use Zustand with TypeScript interface
- Export custom hook (useFeatureStore)
- Import in component where needed

**Utility Functions:**
- Helper functions: `app/utils/helper.ts` if general-purpose
- Feature-specific: Create `app/utils/{featureName}.ts`
- Naming: Export named functions, not defaults

**New Styles:**
- Component styles: `app/style/base/components/{component-name}.scss`
- Page styles: `app/style/base/pages/{page-name}.scss`
- Variables/mixins: Update `app/style/abstracts/variables/` or `app/style/abstracts/mixins/`
- Import in global.scss via @use abstracts; @use base;

## Special Directories

**app/+types/**
- Purpose: React Router auto-generated type files
- Generated: Yes (by React Router during build)
- Committed: No (in .gitignore)
- Contains: Route typing for loader/action/meta functions

**build/**
- Purpose: Production build output
- Generated: Yes (by vite build)
- Committed: No (in .gitignore)
- Contains: Optimized JS, CSS, and server code

**public/icons/ and public/images/**
- Purpose: Static assets referenced in components
- Generated: No
- Committed: Yes
- Access: Use relative paths like `/icons/menu.svg` or `/images/logo.png`

**.env and .env.local**
- Purpose: Environment variable configuration
- Generated: No (manually created)
- Committed: No (.env.local in .gitignore; .env as template)
- Contains: Auth0 keys, API URLs, Stripe keys

---

*Structure analysis: 2026-03-19*
