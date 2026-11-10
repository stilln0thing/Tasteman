import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiForbidden } from "@/lib/api-response";

/** GET - Admin list all orders */
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return apiForbidden();

  const orders = await prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return apiSuccess(orders);
}
