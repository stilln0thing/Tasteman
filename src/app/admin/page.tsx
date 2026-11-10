"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
};

type RecentOrder = {
  id: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  user: { name: string; email: string };
  items: { product: { name: string }; quantity: number }[];
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setStats(d.data.stats);
          setRecentOrders(d.data.recentOrders || []);
        }
      });
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
      {stats && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Customers</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalCustomers}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Products</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalProducts}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Orders</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalOrders}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Revenue</p>
            <p className="text-2xl font-bold text-brand-600">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-800">Recent Orders</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Order</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 text-sm">{o.id.slice(-8)}</td>
                  <td className="px-4 py-3 text-sm">{o.user?.name} ({o.user?.email})</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">{o.status}</span>
                  </td>
                  <td className="px-4 py-3 font-medium">${Number(o.totalAmount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 flex gap-4">
        <Link
          href="/admin/products"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Manage Products
        </Link>
        <Link
          href="/admin/insights"
          className="rounded-lg border border-brand-600 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
        >
          View Insights
        </Link>
      </div>
    </main>
  );
}
