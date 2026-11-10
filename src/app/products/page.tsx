"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: string;
  discountPrice: string | null;
  stock: number;
  category: { name: string; slug: string };
  images: { url: string; alt: string | null }[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((d) => (d.success ? setProducts(d.data.products) : []))
      .finally(() => setLoading(false));
  }, [search, category]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => (d.success ? setCategories(d.data) : []));
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <div className="mt-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="mt-8 text-slate-500">Loading...</p>
        ) : products.length === 0 ? (
          <p className="mt-8 text-slate-500">No products found.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => {
              const price = Number(p.discountPrice ?? p.basePrice);
              const orig = p.discountPrice ? Number(p.basePrice) : null;
              return (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="aspect-square bg-slate-100">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0].url}
                        alt={p.images[0].alt || p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl text-slate-400">🥜</div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-slate-500">{p.category.name}</span>
                    <h3 className="mt-1 font-semibold text-slate-800 group-hover:text-brand-600">{p.name}</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-semibold text-brand-600">${price.toFixed(2)}</span>
                      {orig && <span className="text-sm text-slate-400 line-through">${orig.toFixed(2)}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
