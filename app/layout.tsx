import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/seo/JsonLd";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mgrelianceproperty.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "MG Reliance Property Developers | Real Estate in Accra, Ghana",
    template: "%s | MG Reliance Property Developers",
  },
  description:
    "MG Reliance Property Developers is Accra's trusted real estate agency. Find residential homes, commercial properties, and land for sale or rent across Greater Accra, Ghana.",
  keywords: [
    "real estate Ghana",
    "property for sale Accra",
    "houses for sale Accra",
    "East Legon properties",
    "Ghana real estate agent",
    "MG Reliance",
    "residential properties Ghana",
    "commercial property Accra",
    "land for sale Ghana",
    "property management Accra",
    "Cantonments property",
    "Airport Residential homes",
    "Tema real estate",
  ],
  authors: [{ name: "MG Reliance Property Developers" }],
  creator: "MG Reliance Property Developers",
  publisher: "MG Reliance Property Developers",
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: BASE_URL,
    siteName: "MG Reliance Property Developers",
    title: "MG Reliance Property Developers | Real Estate in Accra, Ghana",
    description:
      "Find your perfect property in Accra with MG Reliance. Residential sales, commercial leasing, land acquisition, and property management across Greater Accra.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "MG Reliance Property Developers — Luxury Real Estate in Accra, Ghana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MG Reliance Property Developers | Real Estate in Accra, Ghana",
    description:
      "Find your perfect property in Accra with MG Reliance. Residential, commercial & land across Greater Accra.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "RealEstateAgent"],
  "@id": `${BASE_URL}/#organization`,
  name: "MG Reliance Property Developers",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/logo.jpeg`,
    width: 400,
    height: 150,
  },
  image: `${BASE_URL}/logo.jpeg`,
  description:
    "MG Reliance Property Developers is Accra's trusted real estate agency, founded in 2010 by Wisdom Geotrah. Specialising in residential sales, commercial leasing, land acquisition, and property management across Greater Accra, Ghana.",
  foundingDate: "2010",
  founder: {
    "@type": "Person",
    name: "Wisdom Geotrah",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "East Legon",
    addressLocality: "Accra",
    addressRegion: "Greater Accra",
    addressCountry: "GH",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 5.636,
    longitude: -0.158,
  },
  telephone: "+233244274630",
  email: "info@mgrelianceproperty.com",
  areaServed: {
    "@type": "City",
    name: "Accra",
    containedInPlace: {
      "@type": "Country",
      name: "Ghana",
    },
  },
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "14:00",
    },
  ],
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "MG Reliance Property Developers",
  url: BASE_URL,
  publisher: { "@id": `${BASE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/projects?location={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body>{children}</body>
    </html>
  );
}
