import { requireUserId } from "@/lib/auth";
import { toErrorResponse } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userId = await requireUserId();
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true } });
    return Response.json({ user });
  } catch (error) {
    return toErrorResponse(error);
  }
}
