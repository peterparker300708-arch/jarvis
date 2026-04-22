import { describe, expect, it } from "vitest";
import { makeConversationTitle } from "@/server/utils/conversation";

describe("makeConversationTitle", () => {
  it("returns default for empty input", () => {
    expect(makeConversationTitle("   ")).toBe("New chat");
  });

  it("truncates long titles", () => {
    const long = "a".repeat(100);
    expect(makeConversationTitle(long)).toHaveLength(60);
    expect(makeConversationTitle(long).endsWith("...")).toBe(true);
  });

  it("normalizes whitespace", () => {
    expect(makeConversationTitle("hello   world")).toBe("hello world");
  });
});
