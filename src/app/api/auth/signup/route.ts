import { z } from "zod";
import { AppError, toErrorResponse } from "@/lib/errors";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) throw new AppError("Email is already registered", 409);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash: await hashPassword(body.password),
      },
      select: { id: true, email: true },
    });

    await setSessionCookie(user.id);

    return Response.json({ user });
  } catch (error) {
    return toErrorResponse(error);
  }
}
