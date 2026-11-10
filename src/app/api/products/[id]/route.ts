import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound } from "@/lib/api-response";

/** GET /api/products/[id] - Single product with images & certificates */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id, isActive: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      certificates: true,
    },
  });
  if (!product) return apiNotFound("Product not found");
  return apiSuccess(product);
}
