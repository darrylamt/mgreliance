"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Abena Mensah",
    role: "Homeowner, East Legon",
    text: "MG Reliance made buying our first home in Accra an absolutely seamless experience. Their team was professional, patient, and incredibly knowledgeable about the local market. We couldn't be happier with our new home.",
    rating: 5,
  },
  {
    name: "Kwame Asante",
    role: "Property Investor, Tema",
    text: "I've worked with several agencies across Accra, but MG Reliance stands out for their transparency and dedication. They helped me acquire three commercial properties and the process was smooth every single time.",
    rating: 5,
  },
  {
    name: "Ama Boateng",
    role: "Business Owner, Airport Residential",
    text: "Finding the right office space for my company was stressful until I found MG Reliance. They listened to exactly what we needed and delivered beyond our expectations. Highly recommend their commercial leasing service.",
    rating: 5,
  },
  {
    name: "Kofi Darko",
    role: "Land Developer, Spintex",
    text: "The team at MG Reliance guided us through the land acquisition process with expertise and care. Their market insights were invaluable, and we closed the deal in record time. A truly trusted partner.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section className="py-24 bg-primary overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            Client Stories
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">
            What Our Clients Say
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-12 text-center"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={18} className="fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/85 text-lg sm:text-xl leading-relaxed mb-8 max-w-3xl mx-auto italic">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div>
                <p className="font-playfair text-lg font-semibold text-white">{t.name}</p>
                <p className="text-accent text-sm mt-1">{t.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Arrows */}
          <button
            onClick={prev}
            className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-8 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-8 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-200 ${
                i === current ? "w-6 h-2 bg-accent" : "w-2 h-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
