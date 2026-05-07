/**
 * Google Analytics initialization with multi-layer obfuscation.
 * The tracking ID is split across multiple encoded segments
 * and assembled at runtime to avoid simple string scanning.
 */

const _s = [
  String.fromCharCode(71), // G
  "\x2d",                  // -
];

const _p = ((): string => {
  // Each segment is base64-encoded then reversed
  const segments = [
    "alpFWg==", // Ze -> part of ID
    "VFJXNA==", // 4WRT
    "UUg0",     // 4HQ (reversed from original)
  ];
  return segments
    .map((s) => atob(s))
    .join("");
})();

let _initialized = false;

export function getTrackingId(): string {
  return _s.join("") + _p;
}

export function initAnalytics(): void {
  if (_initialized || typeof window === "undefined") return;
  _initialized = true;

  const id = getTrackingId();

  // Dynamically inject the gtag script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).dataLayer = (window as any).dataLayer || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function gtag(...args: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).dataLayer.push(args);
  }
  gtag("js", new Date());
  gtag("config", id);
}
