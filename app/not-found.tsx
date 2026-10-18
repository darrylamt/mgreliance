import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="eyebrow justify-center mb-6">Error 404</p>
        <h1 className="heading-xl">Page not found.</h1>
        <p className="mt-5 text-text-secondary leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let us help you find your way back.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn btn-primary btn-lg">
            <ArrowLeft size={16} />
            Back home
          </Link>
          <Link href="/contact" className="btn btn-secondary btn-lg">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
