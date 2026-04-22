import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { AppError, toErrorResponse } from "@/lib/errors";
import { checkRateLimit } from "@/lib/rate-limit";
import { streamAssistantReply } from "@/server/services/chat-service";

const schema = z.object({
  conversationId: z.string().min(1),
  message: z.string().min(1),
  model: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const body = schema.parse(await request.json());

    const limit = checkRateLimit(`chat:${userId}`, 60, 60_000);
    if (!limit.allowed) {
      throw new AppError("Too many chat requests", 429);
    }

    const stream = await streamAssistantReply(userId, body.conversationId, body.message, body.model);
    const encoder = new TextEncoder();

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
