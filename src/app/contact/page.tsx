import { Header } from "@/components/layout/Header";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
        <p className="mt-4 text-slate-600">
          Have questions? Reach out to our team. We&apos;re here to help.
        </p>
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-800">Email</h3>
              <a href="mailto:support@tasteman.com" className="text-brand-600 hover:underline">
                support@tasteman.com
              </a>
            </div>
            <div>
              <h3 className="font-medium text-slate-800">Phone</h3>
              <p className="text-slate-600">+1 (234) 567-8900</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-800">Address</h3>
              <p className="text-slate-600">
                123 Spice Lane, Food District<br />
                City, State 12345
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
