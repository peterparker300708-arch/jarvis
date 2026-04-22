import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { toErrorResponse } from "@/lib/errors";
import { getUserSettings, updateUserSettings } from "@/server/services/settings-service";

const schema = z.object({
  model: z.string().optional(),
  voiceEnabled: z.boolean().optional(),
  avatarEnabled: z.boolean().optional(),
  selectedVoice: z.string().optional(),
  language: z.string().optional(),
  animationIntensity: z.number().min(0).max(1).optional(),
  avatarStyle: z.string().optional(),
  avatarId: z.string().optional(),
  emotionIntensity: z.number().min(0).max(1).optional(),
});

export async function GET() {
  try {
    const userId = await requireUserId();
    const data = await getUserSettings(userId);
    return Response.json(data);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await requireUserId();
    const body = schema.parse(await request.json());
    const data = await updateUserSettings(userId, body);
    return Response.json(data);
  } catch (error) {
    return toErrorResponse(error);
  }
}
