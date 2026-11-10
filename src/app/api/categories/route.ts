import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";

/** GET /api/categories - List all categories */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return apiSuccess(categories);
  } catch (e) {
    console.error("Categories error:", e);
    return apiError("Failed to fetch categories", 500);
  }
}
