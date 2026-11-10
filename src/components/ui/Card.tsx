export function Card({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border-b border-slate-100 px-6 py-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-6 py-4 ${className}`} {...props} />;
}
