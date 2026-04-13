import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import ServicesSection from "@/components/home/ServicesSection";
import AboutPreview from "@/components/home/AboutPreview";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CTABanner from "@/components/home/CTABanner";

export const metadata: Metadata = {
  title: "MG Reliance Property Developers | Trusted Real Estate in Accra, Ghana",
  description:
    "Find your perfect property in Accra with MG Reliance. Residential sales, commercial leasing, land acquisition, and property management across Greater Accra.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ServicesSection />
      <AboutPreview />
      <WhyChooseUs />
      <CTABanner />
    </>
  );
}
