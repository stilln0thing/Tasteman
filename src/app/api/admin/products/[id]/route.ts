import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiForbidden, apiNotFound, apiError } from "@/lib/api-response";
import { updateProductSchema } from "@/lib/validations/product";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

/** GET - Admin fetch single product (including inactive) */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return apiForbidden();
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, images: true, certificates: true },
  });
  if (!product) return apiNotFound("Product not found");
  return apiSuccess(product);
}

/** PUT - Admin update product */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return apiForbidden();
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.errors[0]?.message || "Validation failed");

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(parsed.data.name && { name: parsed.data.name }),
      ...(parsed.data.slug && { slug: parsed.data.slug }),
      ...(parsed.data.description && { description: parsed.data.description }),
      ...(parsed.data.categoryId && { categoryId: parsed.data.categoryId }),
      ...(parsed.data.basePrice != null && { basePrice: parsed.data.basePrice }),
      ...(parsed.data.discountPrice !== undefined && { discountPrice: parsed.data.discountPrice }),
      ...(parsed.data.stock != null && { stock: parsed.data.stock }),
      ...(parsed.data.isActive !== undefined && { isActive: parsed.data.isActive }),
    },
  }).catch(() => null);

  if (!product) return apiNotFound("Product not found");
  return apiSuccess(product);
}

/** DELETE - Admin delete product */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return apiForbidden();
  }

  const { id } = await params;
  await prisma.product.delete({ where: { id } }).catch(() => null);
  return apiSuccess({ deleted: true });
}
