"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Building2, TreePine, Settings, FileSearch, Handshake, ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const services = [
  {
    icon: Home,
    title: "Residential Sales",
    description:
      "Matching families with their ideal homes, with expert guidance through every step of buying and selling.",
  },
  {
    icon: Building2,
    title: "Commercial Leasing",
    description:
      "Offices, retail units and warehouses — efficient, hassle-free and results-driven.",
  },
  {
    icon: TreePine,
    title: "Land Acquisition",
    description:
      "Navigating land purchase with due diligence and clear market insight.",
  },
  {
    icon: Settings,
    title: "Property Management",
    description:
      "Tenant relations, maintenance coordination and financial reporting, handled for you.",
  },
  {
    icon: FileSearch,
    title: "Property Valuation",
    description:
      "Accurate, data-driven valuations so you can buy, sell and invest with confidence.",
  },
  {
    icon: Handshake,
    title: "Investment Advisory",
    description:
      "Strategic guidance tailored to your goals — from buy-to-let to portfolio growth.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <Reveal className="lg:col-span-4 lg:sticky lg:top-32 self-start">
            <p className="eyebrow mb-4">What we offer</p>
            <h2 className="heading-lg">Everything you need, under one roof.</h2>
            <p className="mt-5 text-text-secondary leading-relaxed">
              Real estate solutions for every client — from first-time buyers
              to seasoned investors.
            </p>
            <Link href="/services" className="btn btn-primary mt-8 group">
              Explore services
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4 }}
                  className="group rounded-3xl bg-background p-7 transition-colors duration-300 hover:bg-primary"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-10 transition-colors duration-300 group-hover:bg-white/10">
                    <Icon size={20} className="text-primary transition-colors duration-300 group-hover:text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-text-main transition-colors duration-300 group-hover:text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary transition-colors duration-300 group-hover:text-white/70">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
