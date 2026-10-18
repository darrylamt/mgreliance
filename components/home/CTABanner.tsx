import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

interface CTABannerProps {
  title?: string;
  description?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string } | null;
}

export default function CTABanner({
  title = "Let's find your perfect property.",
  description = "Whether you are buying, selling, or investing — our team is ready to guide you every step of the way.",
  primary = { href: "/contact", label: "Get in touch" },
  secondary = { href: "/projects", label: "Browse properties" },
}: CTABannerProps) {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container-page">
        <Reveal className="relative overflow-hidden rounded-4xl bg-primary px-6 py-16 sm:px-16 sm:py-20">
          {/* Soft glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
          />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] text-white">
              {title}
            </h2>
            <p className="mt-5 text-white/70 text-lg leading-relaxed">{description}</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link href={primary.href} className="btn btn-light btn-lg">
                {primary.label}
                <ArrowUpRight size={16} />
              </Link>
              {secondary && (
                <Link href={secondary.href} className="btn btn-outline-light btn-lg">
                  {secondary.label}
                </Link>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
