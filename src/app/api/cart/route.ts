import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiUnauthorized, apiError } from "@/lib/api-response";

/** GET - Cart items for current user */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return apiUnauthorized();

  const items = await prisma.cartItem.findMany({
    where: { userId: user.sub },
    include: {
      product: {
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      },
    },
  });
  return apiSuccess(items);
}

/** POST - Add to cart or update quantity */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return apiUnauthorized();

  try {
    const { productId, quantity = 1 } = await req.json();
    if (!productId) return apiError("productId required");

    const item = await prisma.cartItem.upsert({
      where: {
        userId_productId: { userId: user.sub, productId },
      },
      create: { userId: user.sub, productId, quantity: Math.max(1, quantity) },
      update: { quantity: Math.max(1, quantity) },
      include: {
        product: {
          include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
        },
      },
    });
    return apiSuccess(item);
  } catch (e) {
    console.error("Cart add error:", e);
    return apiError("Failed to add to cart", 500);
  }
}

/** DELETE - Remove from cart */
export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return apiUnauthorized();

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return apiError("productId required");

  await prisma.cartItem.deleteMany({
    where: { userId: user.sub, productId },
  });
  return apiSuccess({ removed: true });
}
