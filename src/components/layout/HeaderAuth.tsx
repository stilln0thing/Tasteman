"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = { name: string; email: string; role: string } | null;

export function HeaderAuth({ role }: { role?: "ADMIN" | "CUSTOMER" }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => (d.success ? setUser(d.data) : setUser(null)))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const baseHref = role === "ADMIN" ? "/admin" : "/customer";
  const nav = [
    { href: baseHref, label: "Dashboard" },
    ...(role === "ADMIN"
      ? [
          { href: "/admin/products", label: "Products" },
          { href: "/admin/orders", label: "Orders" },
          { href: "/admin/insights", label: "Insights" },
        ]
      : [
          { href: "/customer/products", label: "Products" },
          { href: "/customer/cart", label: "Cart" },
          { href: "/customer/orders", label: "Orders" },
        ]),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href={baseHref} className="text-xl font-bold text-brand-700">
          Tasteman {role === "ADMIN" ? "Admin" : ""}
        </Link>
        <nav className="flex items-center gap-4">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium ${
                pathname.startsWith(href) ? "text-brand-600" : "text-slate-600 hover:text-brand-600"
              }`}
            >
              {label}
            </Link>
          ))}
          {user && (
            <span className="text-sm text-slate-500">{user.name}</span>
          )}
          <button
            onClick={logout}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
