import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiUnauthorized, apiForbidden, apiError } from "@/lib/api-response";
import { createProductSchema } from "@/lib/validations/product";

/** GET - Admin list all products (including inactive) */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return apiForbidden();

  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return apiSuccess(products);
}

/** POST - Admin create product */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return apiForbidden();

  try {
    const body = await req.json();
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0]?.message || "Validation failed");

    const data = {
      ...parsed.data,
      discountPrice: parsed.data.discountPrice ?? undefined,
    };
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        basePrice: data.basePrice,
        discountPrice: data.discountPrice,
        stock: data.stock,
        isActive: data.isActive ?? true,
      },
    });
    return apiSuccess(product);
  } catch (e) {
    console.error("Create product error:", e);
    return apiError("Failed to create product", 500);
  }
}
