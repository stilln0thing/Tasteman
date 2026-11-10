"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  user: { name: string; email: string };
  items: { quantity: number; unitPrice: string; product: { name: string } }[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => (d.success ? setOrders(d.data) : setOrders([])));
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
      <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Order</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Total</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-slate-100">
                <td className="px-4 py-3 text-sm font-mono">{o.id.slice(-8)}</td>
                <td className="px-4 py-3 text-sm">
                  {o.user?.name}<br />
                  <span className="text-slate-500">{o.user?.email}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">{o.status}</span>
                </td>
                <td className="px-4 py-3 font-medium">${Number(o.totalAmount).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
