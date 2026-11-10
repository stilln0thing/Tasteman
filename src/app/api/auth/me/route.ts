import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiUnauthorized } from "@/lib/api-response";

export async function GET() {
  const payload = await getCurrentUser();
  if (!payload) return apiUnauthorized();

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, role: true, phone: true, address: true },
  });
  if (!user) return apiUnauthorized();

  return apiSuccess(user);
}
