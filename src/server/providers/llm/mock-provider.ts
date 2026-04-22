import type { LLMProvider, ProviderMessage } from "@/server/providers/llm/base";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockLLMProvider implements LLMProvider {
  id = "mock";

  async *streamCompletion(messages: ProviderMessage[]) {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
    const text = `I hear you. ${lastUserMessage?.content ? `You said: \"${lastUserMessage.content}\". ` : ""}I'm running in mock mode right now, but the provider interface is wired for OpenAI, Anthropic, Gemini, Groq, and local backends.`;

    for (const chunk of text.split(" ")) {
      await sleep(30);
      yield `${chunk} `;
    }
  }
}
