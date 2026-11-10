import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(10),
  categoryId: z.string().min(1),
  basePrice: z.number().positive(),
  discountPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0),
  isActive: z.boolean().optional().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
