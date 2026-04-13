"use client";

import { motion } from "framer-motion";
import { Home, Building2, TreePine, Settings } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Home,
    title: "Residential Sales",
    description:
      "Matching families with their ideal homes. Expert guidance through every step of the buying and selling process with market-leading insights.",
  },
  {
    icon: Building2,
    title: "Commercial Leasing",
    description:
      "Helping businesses find the perfect commercial spaces. From negotiation to lease signing — hassle-free, efficient, and results-driven.",
  },
  {
    icon: TreePine,
    title: "Land Acquisition",
    description:
      "Navigating the complexities of land purchase and investment. Detailed market insights for residential and commercial land across Accra.",
  },
  {
    icon: Settings,
    title: "Property Management",
    description:
      "Full-service management including tenant relations, maintenance, and financial reporting to maximise your property's performance.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="h-0.5 w-12 bg-accent mx-auto mb-4" />
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            What We Offer
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-text-main mb-4">
            Our Core Services
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Comprehensive real estate solutions tailored to the unique needs of
            every client — from first-time buyers to seasoned investors.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-card rounded-xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300">
                  <Icon
                    size={24}
                    className="text-primary group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <h3 className="font-playfair text-lg font-semibold text-text-main mb-3">
                  {service.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-accent transition-colors group"
          >
            Explore All Services
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
