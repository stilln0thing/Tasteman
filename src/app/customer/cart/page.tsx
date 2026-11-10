"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    basePrice: string;
    discountPrice: string | null;
    images: { url: string }[];
  };
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shipping, setShipping] = useState("");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then((d) => (d.success ? setItems(d.data) : setItems([])))
      .finally(() => setLoading(false));
  }, []);

  async function updateQty(productId: string, quantity: number) {
    const res = await fetch("/api/cart/quantity", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    if (res.ok) {
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        )
      );
    }
  }

  async function remove(productId: string) {
    await fetch(`/api/cart?productId=${productId}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }

  async function checkout() {
    if (!shipping.trim()) {
      alert("Please enter shipping address");
      return;
    }
    setChecking(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shippingAddress: shipping }),
    });
    const data = await res.json();
    setChecking(false);
    if (data.success) {
      setItems([]);
      alert("Order placed successfully! Redirecting to orders.");
      window.location.href = "/customer/orders";
    } else {
      alert(data.message || "Checkout failed");
    }
  }

  const total = items.reduce((sum, i) => {
    const p = Number(i.product.discountPrice ?? i.product.basePrice);
    return sum + p * i.quantity;
  }, 0);

  if (loading) return <main className="mx-auto max-w-4xl px-4 py-8">Loading...</main>;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Cart</h1>
      {items.length === 0 ? (
        <p className="mt-6 text-slate-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {items.map((item) => {
              const price = Number(item.product.discountPrice ?? item.product.basePrice);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-slate-100">
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0].url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl">🥜</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800">{item.product.name}</h3>
                    <p className="text-sm text-brand-600">${price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.product.id, Math.max(1, item.quantity - 1))}
                      className="rounded border border-slate-300 px-2 py-1 text-sm"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity + 1)}
                      className="rounded border border-slate-300 px-2 py-1 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-medium">${(price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => remove(item.product.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
            <label className="block text-sm font-medium text-slate-700">Shipping Address</label>
            <textarea
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Full address..."
            />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-semibold">Total: ${total.toFixed(2)}</span>
              <Button onClick={checkout} loading={checking}>
                Checkout (Mock Payment)
              </Button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
