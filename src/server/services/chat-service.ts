import { MessageRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getLLMProvider } from "@/server/providers/llm";
import { addMessage } from "@/server/services/conversation-service";

export async function streamAssistantReply(
  userId: string,
  conversationId: string,
  userMessage: string,
  model?: string,
) {
  await addMessage(userId, conversationId, MessageRole.USER, userMessage);

  const history = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    select: { role: true, content: true },
  });

  const provider = getLLMProvider();

  let assistantReply = "";
  async function* run() {
    for await (const chunk of provider.streamCompletion(
      history.map((message) => ({
        role: message.role.toLowerCase() as "system" | "user" | "assistant",
        content: message.content,
      })),
      model,
    )) {
      assistantReply += chunk;
      yield chunk;
    }

    await addMessage(userId, conversationId, MessageRole.ASSISTANT, assistantReply);
  }

  return run();
}

export async function regenerateAssistantReply(userId: string, conversationId: string, model?: string) {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });

  const lastAssistant = [...messages].reverse().find((message) => message.role === MessageRole.ASSISTANT);
  if (lastAssistant) {
    await prisma.message.delete({ where: { id: lastAssistant.id } });
  }

  const lastUser = [...messages].reverse().find((message) => message.role === MessageRole.USER);
  if (!lastUser) {
    throw new Error("No user message to regenerate from");
  }

  const updated = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    select: { role: true, content: true },
  });

  const provider = getLLMProvider();
  let assistantReply = "";

  async function* run() {
    for await (const chunk of provider.streamCompletion(
      updated.map((message) => ({
        role: message.role.toLowerCase() as "system" | "user" | "assistant",
        content: message.content,
      })),
      model,
    )) {
      assistantReply += chunk;
      yield chunk;
    }

    await addMessage(userId, conversationId, MessageRole.ASSISTANT, assistantReply);
  }

  return run();
}
