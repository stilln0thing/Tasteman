import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiForbidden, apiNotFound } from "@/lib/api-response";

const VALID_STATUSES = ["PENDING", "PAID", "SHIPPED", "CANCELLED"] as const;

/** PATCH - Admin update order status */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return apiForbidden();

  const { id } = await params;
  const { status } = await req.json();
  if (!status || !VALID_STATUSES.includes(status)) {
    return Response.json(
      { success: false, message: "Invalid status" },
      { status: 400 }
    );
  }

  const order = await prisma.order
    .update({
      where: { id },
      data: { status },
    })
    .catch(() => null);

  if (!order) return apiNotFound("Order not found");
  return apiSuccess(order);
}
