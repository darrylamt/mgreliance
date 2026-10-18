import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: { href?: string; label: string }[];
  children?: React.ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  children,
}: PageHeaderProps) {
  return (
    <section className="pt-36 pb-14 sm:pt-40 sm:pb-16 bg-white">
      <div className="container-page">
        {crumbs && (
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-sm text-text-secondary mb-8"
          >
            <Link href="/" className="hover:text-text-main transition-colors">
              Home
            </Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5 min-w-0">
                <ChevronRight size={14} className="text-text-secondary/50 shrink-0" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-text-main transition-colors">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-text-main line-clamp-1">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
        <h1 className="heading-xl max-w-4xl">{title}</h1>
        {description && (
          <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
