import { NextRequest } from "next/server";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken, setAuthCookie } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || "Validation failed");
    }
    const { email, password, name } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return apiError("Email already registered", 409);

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, role: "CUSTOMER" },
    });

    const token = await createToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    await setAuthCookie(token);

    return apiSuccess({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (e) {
    console.error("Register error:", e);
    return apiError("Registration failed", 500);
  }
}
