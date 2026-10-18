import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribed",
  robots: { index: false, follow: false },
};

export default function UnsubscribedPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 pt-32 pb-20 bg-white">
      <div className="text-center max-w-md">
        <p className="eyebrow justify-center mb-6">Listing alerts</p>
        <h1 className="heading-lg">You&apos;ve been unsubscribed.</h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          You won&apos;t get any more emails for that alert. You can set up a new one any time from the
          properties page.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/projects" className="btn btn-primary">
            Browse properties
          </Link>
          <Link href="/" className="btn btn-secondary">
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
