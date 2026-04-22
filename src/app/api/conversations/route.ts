import { checkRateLimit } from "@/lib/rate-limit";
import { requireUserId } from "@/lib/auth";
import { AppError, toErrorResponse } from "@/lib/errors";
import { createConversation, listConversations } from "@/server/services/conversation-service";

export async function GET() {
  try {
    const userId = await requireUserId();
    const data = await listConversations(userId);
    return Response.json({ conversations: data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST() {
  try {
    const userId = await requireUserId();
    const rate = checkRateLimit(`conversation:create:${userId}`, 20, 60_000);
    if (!rate.allowed) throw new AppError("Too many requests", 429);

    const conversation = await createConversation(userId);
    return Response.json({ conversation }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
