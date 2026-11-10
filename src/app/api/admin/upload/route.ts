import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { saveFile } from "@/lib/storage";
import { apiSuccess, apiForbidden, apiError } from "@/lib/api-response";

/** POST - Admin upload image or certificate */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return apiForbidden();

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const type = (formData.get("type") as string) || "product"; // product | certificate
  const productId = formData.get("productId") as string | null;

  if (!file || file.size === 0) return apiError("No file provided");

  const folder = type === "certificate" ? "certificates" : "products";
  const result = await saveFile(file, folder);

  if (!result.success) return apiError(result.error || "Upload failed", 500);

  return apiSuccess({
    url: result.url,
    path: result.path,
  });
}
