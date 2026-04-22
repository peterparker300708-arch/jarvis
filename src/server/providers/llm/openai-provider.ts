import { env } from "@/lib/env";
import { AppError } from "@/lib/errors";
import type { LLMProvider, ProviderMessage } from "@/server/providers/llm/base";

export class OpenAIProvider implements LLMProvider {
  id = "openai";

  async *streamCompletion(messages: ProviderMessage[], model = env.OPENAI_MODEL) {
    if (!env.OPENAI_API_KEY) {
      throw new AppError("OPENAI_API_KEY is required for OpenAI provider", 500);
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: true,
        messages,
      }),
    });

    if (!response.ok || !response.body) {
      throw new AppError(`OpenAI error: ${response.statusText}`, 502);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") return;

        try {
          const parsed = JSON.parse(data);
          const content: string | undefined = parsed.choices?.[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch {
          // ignore invalid SSE chunks
        }
      }
    }
  }
}
