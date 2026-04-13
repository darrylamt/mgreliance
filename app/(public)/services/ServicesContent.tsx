"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Building2, TreePine, Settings, CheckCircle } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Residential Sales",
    description:
      "Matching families with their ideal homes. Our residential sales team combines deep market knowledge with a genuine passion for finding the perfect fit for every buyer.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    features: [
      "Comprehensive property valuations",
      "Expert buyer and seller representation",
      "Market analysis and pricing strategy",
      "Contract negotiation and closing support",
      "Post-sale follow-up and aftercare",
    ],
  },
  {
    icon: Building2,
    title: "Commercial Leasing",
    description:
      "Helping businesses find the perfect commercial spaces across Greater Accra. From office suites to retail units and warehouses — we handle everything from search to signing.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    features: [
      "Office, retail, and industrial spaces",
      "Lease negotiation and review",
      "Market comparable analysis",
      "Tenant representation services",
      "Long-term portfolio management",
    ],
  },
  {
    icon: TreePine,
    title: "Land Acquisition",
    description:
      "Navigating the complexities of land purchase and investment in Ghana. We provide detailed due diligence, legal support coordination, and market insights for every land transaction.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    features: [
      "Title search and verification",
      "Legal documentation support",
      "Site assessment and feasibility",
      "Investment return projections",
      "Residential and commercial land deals",
    ],
  },
  {
    icon: Settings,
    title: "Property Management",
    description:
      "Full-service property management designed to maximise your investment performance while minimising your stress. We handle everything so you don't have to.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    features: [
      "Tenant screening and placement",
      "Rent collection and disbursement",
      "Maintenance and repairs coordination",
      "Monthly financial reporting",
      "Lease renewal management",
    ],
  },
];

export default function ServicesContent() {
  return (
    <>
      {/* Page Hero */}
      <section className="relative pt-40 pb-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-accent">Services</span>
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Our Services
            </h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Comprehensive real estate solutions tailored to your needs —
              delivered with expertise, care, and results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Detail Sections */}
      <div className="py-8">
        {services.map((service, index) => {
          const Icon = service.icon;
          const isEven = index % 2 === 0;
          return (
            <section
              key={service.title}
              className={`py-20 ${isEven ? "bg-white" : "bg-background"}`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                    !isEven ? "lg:grid-flow-col-dense" : ""
                  }`}
                >
                  {/* Image */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className={`relative h-[400px] rounded-2xl overflow-hidden ${
                      !isEven ? "lg:col-start-2" : ""
                    }`}
                  >
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>

                  {/* Text */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className={`space-y-6 ${!isEven ? "lg:col-start-1 lg:row-start-1" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                        <Icon size={22} className="text-accent" />
                      </div>
                      <div className="h-0.5 flex-1 bg-gray-100" />
                    </div>
                    <div>
                      <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
                        Service 0{index + 1}
                      </p>
                      <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-text-main">
                        {service.title}
                      </h2>
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <CheckCircle size={16} className="text-accent shrink-0" />
                          <span className="text-text-secondary text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm"
                    >
                      Enquire About This Service
                    </Link>
                  </motion.div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-5">
              Not Sure Where to Start?
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Our team is here to guide you. Book a free consultation and let&apos;s
              find the right solution together.
            </p>
            <Link
              href="/contact"
              className="bg-accent text-white font-semibold px-8 py-4 rounded-xl hover:bg-accent/90 transition-colors inline-block"
            >
              Book a Free Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
