"use client";

import { FormEvent, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

type Category = { id: string; name: string };

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => (d.success ? setCategories(d.data) : []));
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const p = d.data;
          setName(p.name);
          setSlug(p.slug);
          setDescription(p.description);
          setCategoryId(p.categoryId);
          setBasePrice(String(p.basePrice));
          setDiscountPrice(p.discountPrice ? String(p.discountPrice) : "");
          setStock(String(p.stock));
          setIsActive(p.isActive ?? true);
        }
      });
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        description,
        categoryId,
        basePrice: parseFloat(basePrice) || 0,
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stock: parseInt(stock, 10) || 0,
        isActive,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError(data.message || "Failed to update product");
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link href="/admin/products" className="text-sm text-brand-600 hover:underline">← Back</Link>
      <Card className="mt-6">
        <CardHeader title="Edit Product" />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <div>
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Base Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Discount Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Stock</label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <label htmlFor="isActive" className="text-sm text-slate-700">Active</label>
            </div>
            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
