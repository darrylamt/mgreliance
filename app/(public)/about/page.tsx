import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us — Our Story & Mission",
  description:
    "MG Reliance Property Developers was founded in Accra in 2010 by Wisdom Geotrah. Learn about our story, mission, core values, and our commitment to making property ownership accessible across Greater Accra, Ghana.",
  openGraph: {
    title: "About MG Reliance Property Developers",
    description:
      "Founded in 2010, MG Reliance is one of Greater Accra's most trusted real estate agencies. Discover our story, mission, and team.",
    url: "/about",
  },
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutContent />;
}
