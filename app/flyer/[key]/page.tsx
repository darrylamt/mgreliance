/* eslint-disable @next/next/no-img-element -- plain <img> so every photo is loaded before printing */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import { isUuid, propertyUrl } from "@/lib/urls";
import { PHONE_DISPLAY } from "@/lib/contact";
import type { Property } from "@/lib/types";
import FlyerToolbar from "./FlyerToolbar";
import FitToScreen from "./FitToScreen";

export const metadata: Metadata = {
  title: "Property Flyer",
  robots: { index: false, follow: false },
};

const STATUS_LABELS: Record<string, string> = { available: "For Sale", rented: "For Rent", sold: "Sold" };
const TYPE_LABELS: Record<string, string> = { residential: "Residential", commercial: "Commercial", land: "Land" };

async function getProperty(key: string): Promise<Property | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq(isUuid(key) ? "id" : "slug", key)
    .maybeSingle();
  return data;
}

export default async function FlyerPage({ params }: { params: { key: string } }) {
  let property: Property | null = null;
  try {
    property = await getProperty(params.key);
  } catch {
    notFound();
  }
  if (!property) notFound();

  const url = propertyUrl(property);
  const qrSvg = await QRCode.toString(url, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#1a3c34", light: "#ffffff00" },
  });

  const photos = property.images || [];
  const specs = [
    property.bedrooms != null && { label: "Bedrooms", value: property.bedrooms },
    property.bathrooms != null && { label: "Bathrooms", value: property.bathrooms },
    property.area != null && { label: "Floor area", value: `${property.area} m²` },
    property.land_size != null && { label: "Land size", value: `${property.land_size} m²` },
    property.parking != null && { label: "Parking", value: property.parking },
    property.furnishing && { label: "Furnishing", value: property.furnishing },
  ].filter(Boolean).slice(0, 4) as { label: string; value: string | number }[];

  const description = property.description
    ? property.description.replace(/\s+/g, " ").trim().slice(0, 420) +
      (property.description.length > 420 ? "…" : "")
    : null;

  return (
    <div className="min-h-screen bg-background print:bg-white py-8 print:py-0">
      <style>{`
        @page { size: A4; margin: 0; }
        @media print {
          html, body { background: #fff !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <FlyerToolbar backHref={url} />

      {/* A4 sheet: 210 × 297 mm — shrunk to fit on phones, true size when printed */}
      <FitToScreen>
      <article className="mx-auto bg-white shadow-soft print:shadow-none w-[210mm] h-[297mm] p-[12mm] flex flex-col gap-[6mm] overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between">
          <img src="/logo.jpeg" alt="MG Reliance Property Developers" className="h-[14mm] w-auto" />
          <div className="flex gap-2">
            <span className="chip bg-primary text-white">{STATUS_LABELS[property.status]}</span>
            <span className="chip bg-background text-text-main">{TYPE_LABELS[property.type]}</span>
          </div>
        </header>

        {/* Photos */}
        <div className="grid grid-cols-3 gap-[3mm] h-[105mm]">
          <div className={`${photos.length > 1 ? "col-span-2" : "col-span-3"} rounded-[6mm] overflow-hidden bg-background`}>
            {photos[0] && <img src={photos[0]} alt="" className="w-full h-full object-cover" />}
          </div>
          {photos.length > 1 && (
            <div className="grid grid-rows-2 gap-[3mm]">
              {photos.slice(1, 3).map((src) => (
                <div key={src} className="rounded-[6mm] overflow-hidden bg-background">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Title + price */}
        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-[26pt] leading-[1.08] font-semibold tracking-tight text-text-main">
              {property.title}
            </h1>
            <p className="mt-1.5 text-[11pt] text-text-secondary">{property.location}</p>
          </div>
          <p className="shrink-0 text-[20pt] font-semibold tracking-tight text-primary">
            {property.price || "Price on request"}
          </p>
        </div>

        {/* Specs */}
        {specs.length > 0 && (
          <div className="grid grid-cols-4 gap-[3mm]">
            {specs.map((s) => (
              <div key={s.label} className="rounded-[4mm] bg-background px-[4mm] py-[3mm]">
                <p className="text-[13pt] font-semibold text-text-main">{s.value}</p>
                <p className="text-[8.5pt] text-text-secondary">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Description + amenities */}
        <div className="flex-1 min-h-0 grid grid-cols-5 gap-[6mm] text-[9.5pt] leading-relaxed">
          <div className="col-span-3 text-text-secondary overflow-hidden">{description}</div>
          {property.amenities?.length > 0 && (
            <ul className="col-span-2 space-y-1.5 overflow-hidden">
              {property.amenities.slice(0, 8).map((a) => (
                <li key={a} className="flex items-center gap-2 text-text-main">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <footer className="rounded-[6mm] bg-primary text-white p-[6mm] flex items-center gap-[6mm]">
          <div
            className="w-[30mm] h-[30mm] shrink-0 rounded-[3mm] bg-white p-[2.5mm] [&>svg]:w-full [&>svg]:h-full"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-[13pt] font-semibold">Scan to see every photo & book a viewing</p>
            <p className="text-[9pt] text-white/70 mt-1 break-all">{url.replace(/^https?:\/\//, "")}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[8.5pt] text-white/60">WhatsApp or call</p>
            <p className="text-[15pt] font-semibold tracking-tight">{PHONE_DISPLAY}</p>
            <p className="text-[8.5pt] text-accent mt-0.5">info@mgrelianceproperties.com</p>
          </div>
        </footer>
      </article>
      </FitToScreen>
    </div>
  );
}
