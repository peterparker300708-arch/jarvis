import { describe, expect, it } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("blocks after configured limit", () => {
    const key = `test-${Date.now()}`;

    expect(checkRateLimit(key, 2, 5000).allowed).toBe(true);
    expect(checkRateLimit(key, 2, 5000).allowed).toBe(true);
    expect(checkRateLimit(key, 2, 5000).allowed).toBe(false);
  });
});
