import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { productQuerySchema } from "@/lib/validations/product";

/** GET /api/products - List products (search, filter, paginate) */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = Object.fromEntries(searchParams);
    const parsed = productQuerySchema.safeParse(raw);
    const q = parsed.success ? parsed.data : { page: 1, limit: 12 };

    const where: Record<string, unknown> = { isActive: true };
    if (q.search) {
      where.OR = [
        { name: { contains: q.search, mode: "insensitive" } },
        { description: { contains: q.search, mode: "insensitive" } },
      ];
    }
    if (q.category) {
      where.category = { slug: q.category };
    }
    if (q.minPrice != null || q.maxPrice != null) {
      where.OR = where.OR || [];
      const priceFilter: Record<string, unknown> = {};
      if (q.minPrice != null) priceFilter.gte = q.minPrice;
      if (q.maxPrice != null) priceFilter.lte = q.maxPrice;
      where.basePrice = priceFilter;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        skip: (q.page - 1) * q.limit,
        take: q.limit,
      }),
      prisma.product.count({ where }),
    ]);

    return apiSuccess({
      products,
      pagination: {
        page: q.page,
        limit: q.limit,
        total,
        totalPages: Math.ceil(total / q.limit),
      },
    });
  } catch (e) {
    console.error("Products list error:", e);
    return apiError("Failed to fetch products", 500);
  }
}
