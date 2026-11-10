"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message ?? "Registration failed");
      } else {
        router.push("/customer");
        router.refresh();
      }
    } catch {
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-spice-50 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader
          title="Create Account"
          description="Register for Tasteman Dry Fruits and Spices."
        />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand-500"
                minLength={8}
                required
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              Create account
            </Button>
            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-brand-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
