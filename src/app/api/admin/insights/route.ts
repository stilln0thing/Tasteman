import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiForbidden } from "@/lib/api-response";

/** GET - Sales trends and product performance for charts */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return apiForbidden();

  const { searchParams } = new URL(req.url);
  const days = Math.min(90, Math.max(7, parseInt(searchParams.get("days") || "30", 10) || 30));

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["PAID", "SHIPPED"] },
      createdAt: { gte: startDate },
    },
    include: { items: { include: { product: true } } },
  });

  const byDate: Record<string, number> = {};
  const byProduct: Record<string, { name: string; total: number; quantity: number }> = {};

  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    byDate[d.toISOString().slice(0, 10)] = 0;
  }

  for (const o of orders) {
    const dateKey = o.createdAt.toISOString().slice(0, 10);
    if (byDate[dateKey] !== undefined) {
      byDate[dateKey] += Number(o.totalAmount);
    }
    for (const item of o.items) {
      const pid = item.productId;
      if (!byProduct[pid]) {
        byProduct[pid] = { name: item.product.name, total: 0, quantity: 0 };
      }
      byProduct[pid].total += Number(item.totalPrice);
      byProduct[pid].quantity += item.quantity;
    }
  }

  const salesTrend = Object.entries(byDate).map(([date, amount]) => ({ date, amount }));
  const productPerformance = Object.values(byProduct)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return apiSuccess({
    salesTrend,
    productPerformance,
  });
}
