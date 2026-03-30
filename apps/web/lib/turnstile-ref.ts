/**
 * Ref handle we use from the Turnstile widget. Kept local so forms don't import
 * `@marsidev/react-turnstile` (helps avoid broken server vendor-chunks on some Windows/Next builds).
 */
export type TurnstileWidgetHandle = {
  reset: (container?: string | HTMLElement) => void;
} | null;
