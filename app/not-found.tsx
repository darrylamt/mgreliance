import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-playfair text-[120px] lg:text-[160px] font-bold text-primary/10 leading-none select-none">
          404
        </div>
        <div className="-mt-8 relative z-10">
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-text-main mb-3">
            Page Not Found
          </h1>
          <p className="text-text-secondary max-w-md mx-auto mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let us help you find your way back.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Home size={16} />
              Go Home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary font-semibold px-8 py-3 rounded-xl hover:bg-primary/5 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
