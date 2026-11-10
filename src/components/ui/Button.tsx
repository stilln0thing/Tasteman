import { forwardRef } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500",
  secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400",
  outline: "border-2 border-brand-600 text-brand-700 hover:bg-brand-50 focus:ring-brand-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className = "", disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  )
);

Button.displayName = "Button";
