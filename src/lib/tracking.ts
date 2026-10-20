// Snapchat Pixel + attribution capture.
//
// - Captures UTM params + Snapchat's click id (?ScCid=) from the landing URL
//   and persists them for the session, so an order submitted later (after
//   navigating through the booking wizard) still carries the right
//   attribution even though the URL has changed.
// - Fires Snapchat's standard events: PAGE_VIEW on load, VIEW_CONTENT when a
//   package is selected, SIGN_UP when a booking is confirmed (the real
//   conversion event on this site).

declare global {
  interface Window {
    snaptr?: (...args: unknown[]) => void;
  }
}

// Not a secret — Snap Pixel IDs are meant to appear in page source. Kept
// overridable via env var in case a second pixel is ever needed.
const PIXEL_ID = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID || 'ccab277d-8565-431e-9746-15ca10787fec';

const ATTRIBUTION_KEY = 'ccl_attribution';

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  sc_click_id?: string;
}

function readSessionStorage<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeSessionStorage(key: string, value: unknown): void {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // sessionStorage unavailable (private mode) — attribution just won't persist.
  }
}

function captureAttributionFromUrl(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const fresh: Attribution = {
    utm_source: params.get('utm_source') ?? undefined,
    utm_medium: params.get('utm_medium') ?? undefined,
    utm_campaign: params.get('utm_campaign') ?? undefined,
    utm_term: params.get('utm_term') ?? undefined,
    utm_content: params.get('utm_content') ?? undefined,
    sc_click_id: params.get('ScCid') ?? params.get('sccid') ?? undefined,
  };

  const hasFresh = Object.values(fresh).some(Boolean);
  const existing = readSessionStorage<Attribution>(ATTRIBUTION_KEY) ?? {};
  const merged = hasFresh ? { ...existing, ...fresh } : existing;
  writeSessionStorage(ATTRIBUTION_KEY, merged);
  return merged;
}

export function getAttribution(): Attribution {
  return readSessionStorage<Attribution>(ATTRIBUTION_KEY) ?? {};
}

let pixelInitialized = false;

function initSnapPixel() {
  if (pixelInitialized || typeof window === 'undefined') return;
  pixelInitialized = true;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  (function (win: any, doc: Document) {
    if (win.snaptr) return;
    const tr: any = (win.snaptr = function (...args: unknown[]) {
      if (tr.handleRequest) {
        tr.handleRequest(...args);
      } else {
        tr.queue.push(args);
      }
    });
    tr.queue = [];
    const script = doc.createElement('script');
    script.async = true;
    script.src = 'https://sc-static.net/scevent.min.js';
    const firstScript = doc.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);
  })(window, document);
  /* eslint-enable @typescript-eslint/no-explicit-any */

  window.snaptr?.('init', PIXEL_ID);
}

let firedPageView = false;

export function initTracking(): void {
  if (typeof window === 'undefined') return;
  initSnapPixel();
  captureAttributionFromUrl();
  if (!firedPageView) {
    firedPageView = true;
    window.snaptr?.('track', 'PAGE_VIEW');
  }
}

export function trackViewContent(packageId: string): void {
  window.snaptr?.('track', 'VIEW_CONTENT', { item_ids: [packageId] });
}

export function trackSignUp(orderId: string, price: number): void {
  window.snaptr?.('track', 'SIGN_UP', { item_ids: [orderId], price, currency: 'SAR' });
}

// Fired on WhatsApp/Call clicks — the "I want to talk to you" intent signal,
// distinct from SIGN_UP (a completed booking).
export function trackContact(): void {
  window.snaptr?.('track', 'CONTACT');
}
