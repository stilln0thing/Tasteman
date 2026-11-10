import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiUnauthorized, apiError } from "@/lib/api-response";

/** PATCH - Update cart item quantity */
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return apiUnauthorized();

  const { productId, quantity } = await req.json();
  if (!productId || typeof quantity !== "number" || quantity < 1)
    return apiError("productId and quantity (min 1) required");

  const item = await prisma.cartItem.updateMany({
    where: { userId: user.sub, productId },
    data: { quantity },
  });
  if (item.count === 0) return apiError("Cart item not found", 404);
  return apiSuccess({ updated: true });
}
