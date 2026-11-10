import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-100 via-spice-50 to-amber-50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                Tasteman Dry Fruits & Spices
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
                Premium quality dry fruits, spices, and nuts for your home and business.
                Sourced with care, delivered fresh.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/products"
                  className="rounded-lg bg-brand-600 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-brand-700"
                >
                  Shop Products
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-lg border-2 border-brand-600 px-8 py-3 text-base font-semibold text-brand-700 hover:bg-brand-50"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-bold text-slate-800">Why Choose Tasteman?</h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-3xl">🥜</div>
                <h3 className="mt-4 font-semibold text-slate-800">Premium Quality</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Handpicked dry fruits and authentic spices, rigorously tested for quality.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-3xl">🏆</div>
                <h3 className="mt-4 font-semibold text-slate-800">Certified & Trusted</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Certificates available. Ideal for B2B and retail customers.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-3xl">🚚</div>
                <h3 className="mt-4 font-semibold text-slate-800">Fast Delivery</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Quick shipping. Order with confidence and receive fresh products.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <h2 className="text-2xl font-bold text-slate-800">Ready to Order?</h2>
            <p className="mt-4 text-slate-600">Create an account to browse products and place orders.</p>
            <Link
              href="/auth/register"
              className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-2.5 font-medium text-white hover:bg-brand-700"
            >
              Get Started
            </Link>
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-slate-50 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 flex justify-between items-center">
            <span className="text-sm text-slate-500">© Tasteman Dry Fruits and Spices</span>
            <div className="flex gap-6">
              <Link href="/about" className="text-sm text-slate-600 hover:text-brand-600">About</Link>
              <Link href="/contact" className="text-sm text-slate-600 hover:text-brand-600">Contact</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
