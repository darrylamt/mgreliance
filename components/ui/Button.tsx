import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary",
      secondary:
        "bg-white text-primary border border-primary hover:bg-primary/5 focus-visible:ring-primary",
      accent:
        "bg-accent text-white hover:bg-accent/90 focus-visible:ring-accent",
      outline:
        "bg-transparent text-white border border-white hover:bg-white/10 focus-visible:ring-white",
      ghost:
        "bg-transparent text-primary hover:bg-primary/5 focus-visible:ring-primary",
    };

    const sizes = {
      sm: "text-sm px-4 py-2",
      md: "text-sm px-6 py-3",
      lg: "text-base px-8 py-4",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
