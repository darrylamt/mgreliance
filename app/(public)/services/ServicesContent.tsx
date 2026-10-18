"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import CTABanner from "@/components/home/CTABanner";

const services = [
  {
    title: "Residential Sales",
    description:
      "Matching families with their ideal homes. Our residential sales team combines deep market knowledge with a genuine passion for finding the perfect fit for every buyer.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80",
    features: [
      "Comprehensive property valuations",
      "Expert buyer and seller representation",
      "Market analysis and pricing strategy",
      "Contract negotiation and closing support",
      "Post-sale follow-up and aftercare",
    ],
  },
  {
    title: "Commercial Leasing",
    description:
      "Helping businesses find the perfect commercial spaces across Greater Accra. From office suites to retail units and warehouses — we handle everything from search to signing.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80",
    features: [
      "Office, retail, and industrial spaces",
      "Lease negotiation and review",
      "Market comparable analysis",
      "Tenant representation services",
      "Long-term portfolio management",
    ],
  },
  {
    title: "Land Acquisition",
    description:
      "Navigating the complexities of land purchase and investment in Ghana. We provide detailed due diligence, legal support coordination, and market insights for every land transaction.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000&q=80",
    features: [
      "Title search and verification",
      "Legal documentation support",
      "Site assessment and feasibility",
      "Investment return projections",
      "Residential and commercial land deals",
    ],
  },
  {
    title: "Property Management",
    description:
      "Full-service property management designed to maximise your investment performance while minimising your stress. We handle everything so you don't have to.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=80",
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
      <PageHeader
        eyebrow="Our services"
        title="Real estate, handled end to end."
        description="Comprehensive solutions tailored to your needs — delivered with expertise, care, and results."
        crumbs={[{ label: "Services" }]}
      >
        {/* Jump links */}
        <div className="mt-10 flex flex-wrap gap-2">
          {services.map((s, i) => (
            <a
              key={s.title}
              href={`#service-${i + 1}`}
              className="chip bg-background text-text-main px-4 py-2 text-sm font-medium hover:bg-primary hover:text-white transition-colors"
            >
              {s.title}
            </a>
          ))}
        </div>
      </PageHeader>

      <div className="bg-white pb-8">
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          return (
            <section
              key={service.title}
              id={`service-${index + 1}`}
              className="py-12 sm:py-16 scroll-mt-24"
            >
              <div className="container-page">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className={`group relative aspect-[4/3] rounded-4xl overflow-hidden ${
                      !isEven ? "lg:order-2" : ""
                    }`}
                  >
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>

                  <Reveal delay={0.1}>
                    <p className="text-sm font-medium text-text-secondary tabular-nums mb-4">
                      0{index + 1} <span className="text-line mx-1">/</span> 0{services.length}
                    </p>
                    <h2 className="heading-lg">{service.title}</h2>
                    <p className="mt-5 text-text-secondary leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Check size={11} className="text-primary" strokeWidth={3} />
                          </span>
                          <span className="text-text-main text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact" className="btn btn-primary mt-10 group">
                      Enquire about this service
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Reveal>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <CTABanner
        title="Not sure where to start?"
        description="Our team is here to guide you. Book a free consultation and let's find the right solution together."
        primary={{ href: "/contact", label: "Book a free consultation" }}
        secondary={null}
      />
    </>
  );
}
