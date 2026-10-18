"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

export default function FlyerToolbar({ backHref }: { backHref: string }) {
  return (
    <div className="print:hidden mx-auto w-[210mm] max-w-full px-4 sm:px-0 mb-4 flex flex-wrap items-center justify-between gap-3">
      <Link href={backHref} className="link-arrow group">
        <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
        Back to listing
      </Link>
      <button type="button" onClick={() => window.print()} className="btn btn-primary">
        <Printer size={16} />
        Print / Save as PDF
      </button>
    </div>
  );
}
