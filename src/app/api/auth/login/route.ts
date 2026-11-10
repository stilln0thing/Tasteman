import { NextRequest } from "next/server";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken, setAuthCookie } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || "Validation failed");
    }
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return apiError("Invalid email or password", 401);

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return apiError("Invalid email or password", 401);

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
    console.error("Login error:", e);
    return apiError("Login failed", 500);
  }
}
