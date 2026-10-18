"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const testimonials = [
  {
    name: "Abena Mensah",
    role: "Homeowner, East Legon",
    text: "MG Reliance made buying our first home in Accra an absolutely seamless experience. Their team was professional, patient, and incredibly knowledgeable about the local market.",
    rating: 5,
  },
  {
    name: "Kwame Asante",
    role: "Property Investor, Tema",
    text: "I've worked with several agencies across Accra, but MG Reliance stands out for their transparency and dedication. They helped me acquire three commercial properties — smooth every single time.",
    rating: 5,
  },
  {
    name: "Ama Boateng",
    role: "Business Owner, Airport Residential",
    text: "Finding the right office space was stressful until I found MG Reliance. They listened to exactly what we needed and delivered beyond our expectations.",
    rating: 5,
  },
  {
    name: "Kofi Darko",
    role: "Land Developer, Spintex",
    text: "The team guided us through land acquisition with expertise and care. Their market insights were invaluable, and we closed the deal in record time.",
    rating: 5,
  },
];

const AUTOPLAY_MS = 7000;

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(
      () => setCurrent((c) => (c + 1) % testimonials.length),
      AUTOPLAY_MS
    );
    return () => clearTimeout(id);
  }, [current, paused]);

  const t = testimonials[current];

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container-page">
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Reveal className="lg:col-span-4">
            <p className="eyebrow mb-4">Client stories</p>
            <h2 className="heading-lg">What our clients say</h2>

            <div className="mt-10 hidden lg:flex items-center gap-2">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="w-12 h-12 rounded-full bg-white border border-line flex items-center justify-center text-text-main hover:bg-primary hover:text-white hover:border-primary transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="w-12 h-12 rounded-full bg-white border border-line flex items-center justify-center text-text-main hover:bg-primary hover:text-white hover:border-primary transition-colors"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-8">
            <div className="relative bg-white rounded-4xl p-8 sm:p-12 min-h-[340px] flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 flex flex-col"
                >
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={16} className="fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-xl sm:text-2xl leading-relaxed tracking-tight text-text-main flex-1">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-text-main">{t.name}</p>
                      <p className="text-text-secondary text-sm">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress indicators */}
              <div className="mt-8 flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Show testimonial ${i + 1}`}
                    className="relative h-1 flex-1 rounded-full bg-line overflow-hidden"
                  >
                    {i < current && <span className="absolute inset-0 bg-primary" />}
                    {i === current && (
                      <motion.span
                        key={`${current}-${paused}`}
                        initial={{ width: "0%" }}
                        animate={{ width: paused ? undefined : "100%" }}
                        transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                        className="absolute inset-y-0 left-0 bg-primary"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex lg:hidden items-center justify-center gap-2">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="w-12 h-12 rounded-full bg-white border border-line flex items-center justify-center text-text-main"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="w-12 h-12 rounded-full bg-white border border-line flex items-center justify-center text-text-main"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
