/**
 * Google Analytics 4 events. Runs entirely in the visitor's browser, so it adds no load to Vercel.
 * Does nothing until NEXT_PUBLIC_GA_ID is set.
 */
type EventName =
  | "whatsapp_click"
  | "share"
  | "save_property"
  | "enquiry_submit"
  | "viewing_request"
  | "contact_submit"
  | "alert_signup"
  | "story_image"
  | "flyer_open";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: EventName, params: Record<string, string | number | boolean | undefined> = {}) {
  try {
    window.gtag?.("event", event, params);
  } catch {
    // Analytics must never break the page.
  }
}
