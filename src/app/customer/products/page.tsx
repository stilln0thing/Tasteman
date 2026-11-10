"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  basePrice: string;
  discountPrice: string | null;
  stock: number;
  category: { name: string };
  images: { url: string }[];
};

export default function CustomerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((d) => (d.success ? setProducts(d.data.products) : []));
  }, [search, category]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => (d.success ? setCategories(d.data) : []));
  }, []);

  return (
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
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const price = Number(p.discountPrice ?? p.basePrice);
          return (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md"
            >
              <div className="aspect-square bg-slate-100">
                {p.images?.[0] ? (
                  <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl">🥜</div>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs text-slate-500">{p.category.name}</span>
                <h3 className="font-semibold text-slate-800">{p.name}</h3>
                <p className="font-semibold text-brand-600">${price.toFixed(2)}</p>
                <p className="text-xs text-slate-500">Stock: {p.stock}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
