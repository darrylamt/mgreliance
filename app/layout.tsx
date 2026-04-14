import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://mgrelianceproperty.com"
  ),
  title: {
    default: "MG Reliance Property Developers | Accra, Ghana",
    template: "%s | MG Reliance Property Developers",
  },
  description:
    "MG Reliance Property Developers is Accra's trusted real estate agency, specialising in residential sales, commercial leasing, land acquisition, and property management across Greater Accra, Ghana.",
  keywords: [
    "real estate Ghana",
    "property Accra",
    "houses for sale Accra",
    "East Legon properties",
    "Ghana real estate agent",
    "MG Reliance",
    "residential properties Ghana",
    "commercial property Accra",
  ],
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://mgrelianceproperty.com",
    siteName: "MG Reliance Property Developers",
    title: "MG Reliance Property Developers | Accra, Ghana",
    description:
      "Your trusted partner in residential real estate across Greater Accra, Ghana. Expert agents. Proven results.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "MG Reliance Property Developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MG Reliance Property Developers | Accra, Ghana",
    description:
      "Your trusted partner in residential real estate across Greater Accra, Ghana.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
