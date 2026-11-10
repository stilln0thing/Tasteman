import { HeaderAuth } from "@/components/layout/HeaderAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderAuth role="ADMIN" />
      {children}
    </div>
  );
}
