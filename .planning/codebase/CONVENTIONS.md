# Coding Conventions

**Analysis Date:** 2026-03-19

## Naming Patterns

**Files:**
- React components: PascalCase with `.tsx` extension (e.g., `ColorPicker.tsx`, `Modal.tsx`, `ImageUploader.tsx`)
- Custom hooks: camelCase with `use` prefix (e.g., `useTextField.tsx`, `useClickOutsite.tsx`, `useUploadLogo.tsx`)
- Services/APIs: camelCase with `Api` suffix (e.g., `authApis.ts`, `bookingApis.ts`, `identityApis.ts`)
- Utilities: camelCase (e.g., `colorPickerHelp.ts`, `helper.ts`, `envConfig.ts`)
- Stores: camelCase with `Store` suffix (e.g., `appStore.ts`)
- Types/Models: camelCase (e.g., `models.ts`, `enums.ts`)
- Context providers: PascalCase (e.g., `AppContextProvider.tsx`, `AuthProvider.tsx`)

**Functions:**
- camelCase for regular functions: `formatName()`, `generateMessageId()`, `calculatePosition()`
- camelCase for event handlers with `handle` prefix: `handleChangeText()`, `handleSubmit()`, `handleSelectColor()`
- camelCase for callbacks with `on` prefix: `onChange()`, `onSubmit()`, `onClose()`
- camelCase for utility functions: `convertAlphaToPercent()`, `calculatePosition()`

**Variables:**
- camelCase for all variable declarations: `isLoading`, `selectedColors`, `activeColorIndex`, `pickerRef`
- UPPER_SNAKE_CASE for constants: `DEFAULT_COLOR`, `API_URL`
- Descriptive names reflecting content/purpose: `uploadedFiles`, `selectedColors`, `buttonRefs`

**Types:**
- PascalCase for interface names: `AppContextType`, `AppStoreState`, `Props`, `IProps`
- `I` prefix used for some interfaces: `IUploadFile`, `IProps`
- `Enum` suffix for enums: `IdentityTypeEnum`, `PaymentInterval`, `SiteTypeEnum`

## Code Style

**Formatting:**
- No explicit formatter configured (no .eslintrc or .prettierrc found)
- Indentation: 2 spaces (observed in all source files)
- Import statement organization: imports grouped roughly (React/libs first, then app imports with `~/` alias)
- Line breaking: functions with many parameters use line breaks (see `ColorPicker.tsx` line 18)

**Linting:**
- No linter configuration detected
- TypeScript strict mode enabled in `tsconfig.json`
- `verbatimModuleSyntax` enabled for explicit type/value imports

## Import Organization

**Order:**
1. External libraries and React: `import axios`, `import { Fragment, useEffect, ...} from 'react'`
2. App imports using path alias: `import { ... } from '~/utils/...'`, `import { ... } from '~/providers/...'`
3. Relative imports: `import { ... } from './ChildComponent'`

**Path Aliases:**
- `~/*` maps to `./app/*` (configured in `tsconfig.json`)
- Used throughout codebase: `import { useChatBoxContext } from '~/providers/ChatboxProvider'`
- Preferred over relative paths for cross-directory imports

## Error Handling

**Patterns:**
- Try-catch blocks for async operations: Used in `AppContextProvider.tsx` for API calls and token retrieval
- Type guards for error checking: `err instanceof Error`, checking for `error` and `error_description` properties
- Console.error/log for debugging: `console.error()` and `console.log()` used directly without wrapper
- Promise rejection in interceptors: `return Promise.reject(error)` in axios interceptors
- Toast notifications for user-facing errors: `toast.error()` from `react-hot-toast`
- Fallback error messages: Generic error strings when specific error details unavailable

**Example from `AppContextProvider.tsx` (lines 76-90):**
```typescript
if (
  err &&
  typeof err === "object" &&
  "error" in err &&
  "error_description" in err
) {
  // Handle Auth0 error
} else {
  console.error("Error on verifying user " + err);
}
```

## Logging

**Framework:** `console` object (console.log, console.error)

**Patterns:**
- Direct console calls throughout app: `console.error()`, `console.log()`
- Used for error tracking and debugging
- No centralized logging service detected
- Examples:
  - Error logging: `console.error('setIdentityType', error)`
  - Debug logging: `console.log('missing identity')`
  - Method calls: `console.log(scrollLeft, clientWidth, scrollWidth)`

## Comments

**When to Comment:**
- Sparse documentation in codebase
- Minimal JSDoc usage observed
- Comments used for section organization (e.g., `// State management`, `// Refs`, `// Initialize from value prop`)

**JSDoc/TSDoc:**
- Minimal usage observed
- Example found in `colorPickerHelp.ts`:
```typescript
/**
 * convert alpha (0--1) to percent (0-100)
 * @param alpha
 */
export const convertAlphaToPercent = (alpha: number) => {
  return Math.round(+alpha.toFixed(2) * 100);
};
```
- Not consistently applied across codebase

## Function Design

**Size:** Functions generally 10-50 lines, with some larger components
- Small utility functions: 2-5 lines (e.g., `formatName()`, `generateMessageId()`)
- Component functions: 30-280 lines (e.g., `ColorPicker.tsx` is 280 lines)
- Hook functions: 20-100+ lines

**Parameters:**
- Single parameter object for complex props: `{ uploadedFiles, handleCleanUploadFilesState }`
- Props interface extracted as `Props` type
- Spread operator for remaining attributes: `{ ...rest }`

**Return Values:**
- Explicit typing with TypeScript: `Promise<AxiosResponse<{ user_id: string }>>`
- Components return JSX elements
- Hooks return objects with state and handlers: `{ handleChangeText, handleSubmit, content, handleKeyDown }`

## Module Design

**Exports:**
- Named exports for utilities: `export const convertAlphaToPercent`, `export async function verifyUser`
- Default exports for React components: `export default function ColorPicker()`
- Default exports for hooks: `export default function useTextField()`
- Named exports for context hooks: `export function useAppContext()`

**Barrel Files:**
- Used in component groups: `ServiceBusiness/index.ts` exports multiple components
```typescript
export { default as ServiceBusiness } from './ServiceBusiness';
export { default as BookingTypeSelection } from './BookingTypeSelection';
```

## TypeScript Usage

**Type Annotations:**
- Explicit type annotations on props: `value?: RgbaColor`, `onChange?: (color: RgbaColor) => void`
- Inline interfaces for props: `type Props = { ... }`
- Type imports used: `import type { RgbaColor, HsvaColor } from '@uiw/react-color'`

**Type Guards:**
- Used for error checking: `typeof err === "object"`, `"error" in err`
- Used for component mounting: `typeof window !== "undefined"`
- Used for response validation: `verifyUserRes.status === 200`

---

*Convention analysis: 2026-03-19*
