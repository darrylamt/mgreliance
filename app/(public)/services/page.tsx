import type { Metadata } from "next";
import ServicesContent from "./ServicesContent";

export const metadata: Metadata = {
  title: "Our Services — Real Estate Solutions",
  description:
    "Explore MG Reliance's real estate services in Accra: residential sales, commercial leasing, land acquisition, and full-service property management.",
};

export default function ServicesPage() {
  return <ServicesContent />;
}
