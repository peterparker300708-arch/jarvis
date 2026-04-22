import { requireUserId } from "@/lib/auth";
import { AppError, toErrorResponse } from "@/lib/errors";
import { getSTTProvider } from "@/server/providers/stt";

export async function POST(request: Request) {
  try {
    await requireUserId();
    const formData = await request.formData();
    const file = formData.get("audio");

    if (!(file instanceof File)) {
      throw new AppError("Audio file is required", 400);
    }

    const provider = getSTTProvider();
    const result = await provider.transcribe(await file.arrayBuffer(), "en");

    return Response.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
