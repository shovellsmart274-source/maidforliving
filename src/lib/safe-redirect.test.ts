import { describe, expect, it } from "vitest";
import { safeRedirect } from "./safe-redirect";

describe("safeRedirect", () => {
  it("keeps same-site admin paths", () => {
    expect(safeRedirect("/admin/bookings")).toBe("/admin/bookings");
  });
  it("blocks other websites", () => {
    expect(safeRedirect("https://evil.example")).toBe("/admin");
    expect(safeRedirect("//evil.example")).toBe("/admin");
  });
  it("falls back to the admin dashboard when missing", () => {
    expect(safeRedirect(undefined)).toBe("/admin");
  });
});
