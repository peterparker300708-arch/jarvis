export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type ConversationSummary = {
  id: string;
  title: string;
  updatedAt: string;
};

export type AssistantEmotion =
  | "friendly"
  | "excited"
  | "calm"
  | "serious"
  | "confused"
  | "happy"
  | "apologetic"
  | "thinking";

export type AvatarState = "idle" | "listening" | "thinking" | "speaking";
