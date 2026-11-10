import { Header } from "@/components/layout/Header";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">About Tasteman</h1>
        <div className="mt-8 space-y-6 text-slate-600">
          <p>
            Tasteman Dry Fruits and Spices is a trusted supplier of premium quality dry fruits,
            spices, and nuts. We serve both individual customers and businesses with bulk orders.
          </p>
          <p>
            Our products are sourced with care, ensuring freshness, authenticity, and the highest
            standards. We offer certified products where applicable, making us a reliable choice
            for B2B clients and health-conscious consumers alike.
          </p>
          <h2 className="text-xl font-semibold text-slate-800">Our Commitment</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>Quality-first sourcing and processing</li>
            <li>Transparent pricing and certifications</li>
            <li>Fast, reliable delivery</li>
            <li>Exceptional customer support</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
