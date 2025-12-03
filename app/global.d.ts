// src/global.d.ts
declare global {
  interface Window {
    /**
     * gtag queue function pushed into dataLayer by the snippet.
     * @param command 'config' | 'event' | ...
     * @param targetId Your GA/Ads ID
     * @param params extra parameters or event payload
     */
    gtag?: (
      command: string,
      targetId?: string,
      params?: Record<string, any>
    ) => void;
  }
}
// This empty export ensures TS treats this as a module augmentation file:
export {};
