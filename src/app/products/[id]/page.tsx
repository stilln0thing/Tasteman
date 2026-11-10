"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";

type Product = {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  discountPrice: string | null;
  stock: number;
  category: { name: string };
  images: { url: string; alt: string | null }[];
  certificates: { url: string; name: string | null }[];
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => (d.success ? setProduct(d.data) : setProduct(null)))
      .finally(() => setLoading(false));
  }, [id]);

  async function addToCart() {
    setAdding(true);
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id, quantity: qty }),
    });
    const data = await res.json();
    setAdding(false);
    if (data.success) {
      alert("Added to cart! Log in to view your cart.");
    } else if (res.status === 401) {
      window.location.href = `/auth/login?redirect=/products/${id}`;
    } else {
      alert(data.message || "Failed to add to cart");
    }
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (!product) return <div className="flex min-h-screen items-center justify-center">Product not found</div>;

  const price = Number(product.discountPrice ?? product.basePrice);
  const orig = product.discountPrice ? Number(product.basePrice) : null;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link href="/products" className="text-sm text-brand-600 hover:underline">← Back to products</Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
            {product.images?.[0] ? (
              <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-8xl text-slate-400">🥜</div>
            )}
          </div>
          <div>
            <span className="text-sm text-slate-500">{product.category.name}</span>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{product.name}</h1>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-brand-600">${price.toFixed(2)}</span>
              {orig && <span className="text-slate-400 line-through">${orig.toFixed(2)}</span>}
            </div>
            <p className="mt-6 text-slate-600">{product.description}</p>
            <p className="mt-2 text-sm text-slate-500">Stock: {product.stock}</p>
            {product.certificates?.length > 0 && (
              <p className="mt-2 text-sm text-slate-500">Certificates available</p>
            )}
            <div className="mt-8 flex gap-4">
              <input
                type="number"
                min={1}
                max={product.stock}
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value, 10) || 1)}
                className="w-20 rounded-lg border border-slate-300 px-3 py-2"
              />
              <Button onClick={addToCart} loading={adding}>
                Add to Cart
              </Button>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              <Link href="/auth/login" className="text-brand-600 hover:underline">Log in</Link> to view your cart.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
