import { z } from "zod";
import { AppError, toErrorResponse } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      throw new AppError("Invalid credentials", 401);
    }

    await setSessionCookie(user.id);

    return Response.json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    return toErrorResponse(error);
  }
}
