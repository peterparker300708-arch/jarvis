import type { ChatRole } from "@/types";

export type ProviderMessage = { role: ChatRole; content: string };

export type LLMProvider = {
  id: string;
  streamCompletion(messages: ProviderMessage[], model?: string): AsyncGenerator<string>;
};
