import { MessageRole } from "@prisma/client";
import { AppError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { makeConversationTitle } from "@/server/utils/conversation";

export async function listConversations(userId: string) {
  return prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, updatedAt: true },
  });
}

export async function getConversation(userId: string, conversationId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        select: { id: true, role: true, content: true, createdAt: true },
      },
    },
  });

  if (!conversation) throw new AppError("Conversation not found", 404);

  return conversation;
}

export async function createConversation(userId: string) {
  return prisma.conversation.create({
    data: { userId },
    select: { id: true, title: true, updatedAt: true },
  });
}

export async function renameConversation(userId: string, conversationId: string, title: string) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
  });

  if (!conversation) throw new AppError("Conversation not found", 404);

  return prisma.conversation.update({
    where: { id: conversationId },
    data: { title: title.trim() || conversation.title },
    select: { id: true, title: true, updatedAt: true },
  });
}

export async function deleteConversation(userId: string, conversationId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
  });

  if (!conversation) throw new AppError("Conversation not found", 404);

  await prisma.conversation.delete({ where: { id: conversationId } });
}

export async function addMessage(
  userId: string,
  conversationId: string,
  role: MessageRole,
  content: string,
  tokenCount?: number,
) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
  });

  if (!conversation) throw new AppError("Conversation not found", 404);

  const message = await prisma.message.create({
    data: {
      conversationId,
      role,
      content,
      tokenCount,
    },
  });

  if (role === MessageRole.USER && conversation.title === "New chat") {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { title: makeConversationTitle(content) },
    });
  }

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}
