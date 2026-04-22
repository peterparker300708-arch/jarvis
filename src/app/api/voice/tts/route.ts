import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { toErrorResponse } from "@/lib/errors";
import { getTTSProvider } from "@/server/providers/tts";

const schema = z.object({
  text: z.string().min(1),
  voice: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    await requireUserId();
    const body = schema.parse(await request.json());
    const provider = getTTSProvider();
    const result = await provider.synthesize(body.text, body.voice);

    return Response.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
