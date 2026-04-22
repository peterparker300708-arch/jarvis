export function makeConversationTitle(input: string) {
  const normalized = input.replace(/\s+/g, " ").trim();
  if (!normalized) return "New chat";
  return normalized.length > 60 ? `${normalized.slice(0, 57)}...` : normalized;
}
