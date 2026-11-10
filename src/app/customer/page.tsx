"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = { name: string; email: string };

export default function CustomerDashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => (d.success ? setUser(d.data) : setUser(null)));
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-600">Welcome back{user ? `, ${user.name}` : ""}!</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/customer/products"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-800">Products</h3>
          <p className="mt-2 text-sm text-slate-600">Browse and add to cart</p>
        </Link>
        <Link
          href="/customer/cart"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-800">Cart</h3>
          <p className="mt-2 text-sm text-slate-600">View and checkout</p>
        </Link>
        <Link
          href="/customer/orders"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-800">Orders</h3>
          <p className="mt-2 text-sm text-slate-600">Order history and status</p>
        </Link>
      </div>
    </main>
  );
}
