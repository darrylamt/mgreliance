import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us — Our Story & Team",
  description:
    "Learn about MG Reliance Property Developers — founded in Accra, Ghana in 2010 by Wisdom Geotrah. Our story, vision, mission, and core values.",
};

export default function AboutPage() {
  return <AboutContent />;
}
