import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { toErrorResponse } from "@/lib/errors";
import {
  deleteConversation,
  getConversation,
  renameConversation,
} from "@/server/services/conversation-service";

const schema = z.object({ title: z.string().min(1).max(120) });

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const conversation = await getConversation(userId, id);

    return Response.json({
      conversation: {
        id: conversation.id,
        title: conversation.title,
        updatedAt: conversation.updatedAt,
      },
      messages: conversation.messages.map((message) => ({
        id: message.id,
        role: message.role.toLowerCase(),
        content: message.content,
        createdAt: message.createdAt,
      })),
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const body = schema.parse(await request.json());

    const conversation = await renameConversation(userId, id, body.title);
    return Response.json({ conversation });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    await deleteConversation(userId, id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
