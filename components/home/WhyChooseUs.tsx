"use client";

import { motion } from "framer-motion";
import { MapPin, Users, LifeBuoy } from "lucide-react";

const reasons = [
  {
    icon: MapPin,
    title: "Local Knowledge",
    description:
      "Deep expertise in the Greater Accra property market. We know the neighbourhoods, the prices, the trends, and the opportunities that others miss.",
  },
  {
    icon: Users,
    title: "Client-Centric Approach",
    description:
      "Every client is unique. We take the time to understand your specific needs and goals, delivering personalised service that exceeds expectations.",
  },
  {
    icon: LifeBuoy,
    title: "Comprehensive Support",
    description:
      "From your first enquiry to the final handover — and beyond — we are with you at every stage, ensuring a smooth and stress-free experience.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="h-0.5 w-12 bg-accent mx-auto mb-4" />
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            Why MG Reliance
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-text-main mb-4">
            The MG Reliance Difference
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            We combine local market expertise with a genuine commitment to your
            success, making us the preferred choice for property in Accra.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative bg-card rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Gold accent top bar */}
                <div className="absolute top-0 left-8 right-8 h-0.5 bg-accent rounded-b-full" />

                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-playfair text-xl font-semibold text-text-main mb-3">
                  {reason.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
