import { env } from "@/lib/env";
import type { LLMProvider } from "@/server/providers/llm/base";
import { MockLLMProvider } from "@/server/providers/llm/mock-provider";
import { OpenAIProvider } from "@/server/providers/llm/openai-provider";

export function getLLMProvider(): LLMProvider {
  if (env.LLM_PROVIDER === "openai") {
    return new OpenAIProvider();
  }

  return new MockLLMProvider();
}
