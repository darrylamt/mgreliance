import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "success" | "warning" | "danger" | "neutral";
  className?: string;
}

export default function Badge({
  children,
  variant = "primary",
  className,
}: BadgeProps) {
  const variants = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    neutral: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
