"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navPublic = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/products", label: "Products" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-bold text-brand-700">
          Tasteman
        </Link>
        <nav className="flex items-center gap-6">
          {navPublic.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium ${
                pathname === href ? "text-brand-600" : "text-slate-600 hover:text-brand-600"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/auth/login"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg border border-brand-600 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
