// Only allow same-origin, absolute paths as post-login destinations.
export function safeRedirect(target: unknown, fallback = "/admin"): string {
  if (typeof target !== "string") return fallback;
  if (!target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) return fallback;
  if (target.startsWith("/auth")) return fallback;
  return target;
}
