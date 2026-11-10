"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  status: string;
  totalAmount: string;
  shippingAddress: string;
  createdAt: string;
  items: {
    quantity: number;
    unitPrice: string;
    product: { name: string };
  }[];
};

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => (d.success ? setOrders(d.data) : setOrders([])));
  }, []);

  const statusColor: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    PAID: "bg-green-100 text-green-800",
    SHIPPED: "bg-blue-100 text-blue-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Order History</h1>
      {orders.length === 0 ? (
        <p className="mt-6 text-slate-600">No orders yet.</p>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((o) => (
            <div
              key={o.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Order #{o.id.slice(-8)}</p>
                  <p className="font-medium text-slate-800">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    statusColor[o.status] || "bg-slate-100 text-slate-800"
                  }`}
                >
                  {o.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{o.shippingAddress}</p>
              <ul className="mt-4 space-y-1 text-sm text-slate-600">
                {o.items.map((item, idx) => (
                  <li key={idx}>
                    {item.product.name} × {item.quantity} @ ${Number(item.unitPrice).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-semibold text-brand-600">
                Total: ${Number(o.totalAmount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
