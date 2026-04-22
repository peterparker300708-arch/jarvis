import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { toErrorResponse } from "@/lib/errors";
import { regenerateAssistantReply } from "@/server/services/chat-service";

const schema = z.object({
  conversationId: z.string().min(1),
  model: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const body = schema.parse(await request.json());

    const stream = await regenerateAssistantReply(userId, body.conversationId, body.model);
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
