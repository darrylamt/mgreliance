import type { Metadata } from "next";
import ServicesContent from "./ServicesContent";

export const metadata: Metadata = {
  title: "Our Services — Real Estate Solutions in Accra",
  description:
    "MG Reliance offers residential sales, commercial leasing, land acquisition, property management, valuation, and investment advisory across Greater Accra, Ghana. Expert guidance at every step.",
  openGraph: {
    title: "Real Estate Services | MG Reliance Property Developers",
    description:
      "From residential sales to commercial leasing and land acquisition — comprehensive real estate services across Greater Accra.",
    url: "/services",
  },
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesContent />;
}
