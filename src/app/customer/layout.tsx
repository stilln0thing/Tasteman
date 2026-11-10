import { HeaderAuth } from "@/components/layout/HeaderAuth";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-spice-50">
      <HeaderAuth role="CUSTOMER" />
      {children}
    </div>
  );
}
