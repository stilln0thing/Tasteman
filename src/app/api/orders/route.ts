import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiUnauthorized, apiError } from "@/lib/api-response";
import { createPayment } from "@/lib/payment";
import { Decimal } from "@prisma/client/runtime/library";

/** GET - Customer's order history */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return apiUnauthorized();

  const orders = await prisma.order.findMany({
    where: { userId: user.sub },
    include: {
      items: {
        include: {
          product: {
            include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return apiSuccess(orders);
}

/** POST - Checkout: create order from cart, process payment (mock) */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return apiUnauthorized();

  try {
    const { shippingAddress } = await req.json();
    if (!shippingAddress || typeof shippingAddress !== "string")
      return apiError("shippingAddress required");

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.sub },
      include: { product: true },
    });

    if (cartItems.length === 0) return apiError("Cart is empty");

    let total = 0;
    const orderItems: { productId: string; quantity: number; unitPrice: number; totalPrice: number }[] = [];

    for (const ci of cartItems) {
      const price = Number(ci.product.discountPrice ?? ci.product.basePrice);
      const qty = ci.quantity;
      const lineTotal = price * qty;
      if (ci.product.stock < qty)
        return apiError(`Insufficient stock for ${ci.product.name}`);
      orderItems.push({
        productId: ci.productId,
        quantity: qty,
        unitPrice: price,
        totalPrice: lineTotal,
      });
      total += lineTotal;
    }

    // Create mock payment
    const payment = await createPayment({
      amount: Math.round(total * 100),
      currency: "inr",
      orderId: `ord_${Date.now()}`,
      customerEmail: user.email,
    });

    if (!payment.success) return apiError(payment.error || "Payment failed", 500);

    const order = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.create({
        data: {
          userId: user.sub!,
          status: "PAID",
          totalAmount: new Decimal(total),
          shippingAddress,
          paymentId: payment.paymentId,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: { include: { images: true } },
            },
          },
        },
      });

      for (const ci of cartItems) {
        await tx.product.update({
          where: { id: ci.productId },
          data: { stock: { decrement: ci.quantity } },
        });
      }
      await tx.cartItem.deleteMany({ where: { userId: user.sub } });
      return ord;
    });

    return apiSuccess(order);
  } catch (e) {
    console.error("Checkout error:", e);
    return apiError("Checkout failed", 500);
  }
}
