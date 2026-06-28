// lib/pixel.ts



export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// declare global {
//   interface Window {
//     fbq: (
//       type: string,
//       event: string,
//       params?: Record<string, unknown>,
//       options?: Record<string, unknown>
//     ) => void;
//   }
// }

export function trackPixel(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined" || !window.fbq) return;

  const eventId = generateEventId();
  window.fbq("track", eventName, params ?? {}, { eventID: eventId });

  // Envia também via server (Conversions API) com o mesmo eventId
  fetch("/api/pixel-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventName, params, eventId }),
  }).catch(() => {}); // silencioso

  return eventId;
}

export function trackCustom(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("trackCustom", eventName, params ?? {});
}