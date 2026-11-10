import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiForbidden } from "@/lib/api-response";
/** GET - Admin dashboard stats */
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return apiForbidden();

  const [customers, products, orders, revenue, recentOrders] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "SHIPPED"] } },
      _sum: { totalAmount: true },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    }),
  ]);

  return apiSuccess({
    stats: {
      totalCustomers: customers,
      totalProducts: products,
      totalOrders: orders,
      revenue: Number(revenue._sum.totalAmount ?? 0),
    },
    recentOrders,
  });
}
