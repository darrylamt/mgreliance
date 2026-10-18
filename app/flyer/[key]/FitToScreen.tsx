"use client";

import { useEffect, useState } from "react";

/** 210mm at 96dpi — the A4 sheet's fixed CSS width. */
const SHEET_WIDTH_PX = 794;
const GUTTER_PX = 24;

/**
 * Shrinks the fixed-size A4 sheet to fit narrow screens (like a print preview), using CSS zoom
 * so the surrounding layout shrinks with it. Printing always uses true size.
 */
export default function FitToScreen({ children }: { children: React.ReactNode }) {
  const [zoom, setZoom] = useState<number | null>(null);

  useEffect(() => {
    const fit = () => setZoom(Math.min(1, (window.innerWidth - GUTTER_PX) / SHEET_WIDTH_PX));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div
      className="flyer-fit w-fit mx-auto"
      // Hidden until sized so phones don't flash the oversized sheet.
      style={{ zoom: zoom ?? 1, visibility: zoom === null ? "hidden" : "visible" }}
    >
      <style>{`@media print { .flyer-fit { zoom: 1 !important; visibility: visible !important; } }`}</style>
      {children}
    </div>
  );
}
