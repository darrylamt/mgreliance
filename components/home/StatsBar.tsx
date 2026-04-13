"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "500+", label: "Happy Clients" },
  { value: "4", label: "Core Services" },
  { value: "100%", label: "Trusted" },
];

export default function StatsBar() {
  return (
    <section className="bg-primary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="font-playfair text-4xl font-bold text-accent mb-1">
                {stat.value}
              </div>
              <div className="text-white/70 text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
