"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const LEFT_IMAGE =
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&q=85";
const RIGHT_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=85";

export default function VisionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const leftY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rightY = useTransform(scrollYProgress, [0, 1], [-20, 40]);

  return (
    <section className="py-24 sm:py-32 bg-white overflow-hidden">
      <div className="container-page">
        <Reveal className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-6">MG Reliance Property Developers</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-text-main">
            If you can dream it, <span className="text-primary">we can find it.</span>
          </h2>
          <p className="mt-6 text-text-secondary leading-relaxed text-lg max-w-xl mx-auto">
            A personal approach to every client — understanding your vision and
            delivering properties that match it, backed by deep knowledge of
            Greater Accra&apos;s finest locations.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/projects" className="btn btn-primary btn-lg">
              Browse properties
            </Link>
            <Link href="/contact" className="link-arrow group px-4 py-3">
              Get in touch
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div ref={ref} className="mt-16 sm:mt-20 grid grid-cols-12 gap-4 sm:gap-5 items-start">
          <motion.div
            style={{ y: leftY }}
            className="col-span-7 relative aspect-[4/3] rounded-4xl overflow-hidden"
          >
            <Image src={LEFT_IMAGE} alt="Luxury villa" fill className="object-cover" sizes="60vw" />
          </motion.div>
          <motion.div
            style={{ y: rightY }}
            className="col-span-5 relative aspect-[3/4] rounded-4xl overflow-hidden mt-10"
          >
            <Image src={RIGHT_IMAGE} alt="Contemporary home" fill className="object-cover" sizes="40vw" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
