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
  isActive: boolean;
  category: { name: string };
  images: { url: string }[];
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => (d.success ? setProducts(d.data) : setProducts([])));
  }, []);

  async function toggleActive(id: string, isActive: boolean) {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive } : p))
      );
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Add Product
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Product</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-slate-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-slate-100">
                      {p.images?.[0] ? (
                        <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-lg">🥜</div>
                      )}
                    </div>
                    <span className="font-medium text-slate-800">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{p.category.name}</td>
                <td className="px-4 py-3 text-sm">
                  ${Number(p.discountPrice ?? p.basePrice).toFixed(2)}
                  {p.discountPrice && (
                    <span className="ml-1 text-slate-400 line-through">${Number(p.basePrice).toFixed(2)}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">{p.stock}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(p.id, !p.isActive)}
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.isActive ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {p.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="text-sm font-medium text-brand-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
