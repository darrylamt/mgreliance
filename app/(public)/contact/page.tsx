import type { Metadata } from "next";
import ContactContent from "./ContactContent";
import JsonLd from "@/components/seo/JsonLd";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mgrelianceproperty.com";

export const metadata: Metadata = {
  title: "Contact Us — Get in Touch",
  description:
    "Contact MG Reliance Property Developers in Accra, Ghana. Call +233 244 27 4630, email info@mgrelianceproperty.com, or visit us in East Legon. We respond within one business day.",
  openGraph: {
    title: "Contact MG Reliance Property Developers",
    description:
      "Get in touch with our team in East Legon, Accra. We're ready to help with residential sales, commercial leasing, land acquisition, and property management.",
    url: "/contact",
  },
  alternates: { canonical: "/contact" },
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${BASE_URL}/contact`,
  name: "Contact MG Reliance Property Developers",
  url: `${BASE_URL}/contact`,
  description:
    "Contact page for MG Reliance Property Developers. Reach our team in East Legon, Accra for all real estate enquiries.",
  mainEntity: {
    "@type": "RealEstateAgent",
    "@id": `${BASE_URL}/#organization`,
    name: "MG Reliance Property Developers",
    telephone: "+233244274630",
    email: "info@mgrelianceproperty.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "East Legon",
      addressLocality: "Accra",
      addressRegion: "Greater Accra",
      addressCountry: "GH",
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageSchema} />
      <ContactContent />
    </>
  );
}
