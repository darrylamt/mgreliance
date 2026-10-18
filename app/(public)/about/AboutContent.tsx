"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, Target, Heart, Award, Users } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import CTABanner from "@/components/home/CTABanner";

const values = [
  {
    icon: Heart,
    title: "Integrity",
    description:
      "We operate with complete transparency and honesty, building relationships based on trust and mutual respect.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We are committed to exceptional service and results, consistently exceeding the expectations of our clients.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We invest in the communities we serve, contributing to a thriving Accra real estate market that benefits everyone.",
  },
];

const stats = [
  { value: 15, suffix: "+", label: "Years of experience" },
  { value: 500, suffix: "+", label: "Happy clients" },
  { value: 1000, suffix: "+", label: "Properties sold" },
  { value: 6, suffix: "", label: "Core services" },
];

export default function AboutContent() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Accra's trusted real estate partner."
        description="Built on integrity, driven by results — helping families and investors across Greater Accra since 2010."
        crumbs={[{ label: "About" }]}
      />

      {/* Wide image */}
      <section className="bg-white">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[16/9] sm:aspect-[21/9] rounded-4xl overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1800&q=80"
              alt="MG Reliance office in East Legon"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container-page grid grid-cols-2 lg:grid-cols-4 gap-8 border-b border-line pb-16 sm:pb-20">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <p className="text-4xl sm:text-5xl font-semibold tracking-tight text-text-main tabular-nums">
                <CountUp to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-text-secondary">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="pb-24 sm:pb-32 bg-white">
        <div className="container-page grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-4">Our story</p>
            <h2 className="heading-lg">Building Ghana&apos;s real estate future.</h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7 space-y-5 text-lg text-text-secondary leading-relaxed">
            <p>
              MG Reliance Property Developers is a premier real estate agency
              founded in Accra, Ghana. We specialise in residential and
              commercial properties, serving a diverse clientele across Greater
              Accra.
            </p>
            <p>
              With a dedicated team of experienced agents, we guide clients
              through every step of buying, selling, or leasing with
              transparency, market expertise, and a personal touch.
            </p>
            <p>
              Our mission is to make homeownership accessible and investment
              straightforward for every Ghanaian family and individual — from
              first-time buyers to seasoned investors.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 sm:py-32 bg-background">
        <div className="container-page grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {[
            {
              icon: Eye,
              title: "Our vision",
              text: "To be the most trusted real estate agency in Ghana, recognised for integrity and innovation — a Ghana where every family has access to quality housing and every investor can build lasting wealth through property.",
            },
            {
              icon: Target,
              title: "Our mission",
              text: "To provide exceptional real estate services that exceed expectations, understanding and fulfilling the unique needs of every client with transparency, expertise, and results that make a lasting difference.",
            },
          ].map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.1} className="bg-white rounded-4xl p-8 sm:p-10">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-10">
                <Icon size={20} className="text-accent" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-text-main mb-3">{title}</h3>
              <p className="text-text-secondary leading-relaxed">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <Reveal className="relative aspect-[4/5] rounded-4xl overflow-hidden bg-background max-w-md w-full mx-auto lg:mx-0">
            <Image
              src="https://ykxikguqtlkbpturlyhs.supabase.co/storage/v1/object/public/website-content/CEO1.jpeg"
              alt="Wisdom Geotrah, Founder of MG Reliance"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow mb-4">Meet the founder</p>
            <h2 className="heading-lg">Wisdom Geotrah</h2>
            <p className="mt-2 text-text-secondary">Founder &amp; Managing Director</p>
            <div className="mt-8 space-y-4 text-text-secondary leading-relaxed">
              <p>
                Wisdom Geotrah founded MG Reliance in 2010 with a vision to
                transform the real estate experience in Ghana. With over a decade
                of hands-on experience in the Accra property market, he brings
                unmatched local insight and a deep passion for connecting people
                with the right properties.
              </p>
              <p>
                Under his leadership, MG Reliance has grown into one of Greater
                Accra&apos;s most trusted agencies, helping over 500 clients
                achieve their property goals with integrity and excellence.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 sm:py-32 bg-background">
        <div className="container-page">
          <Reveal className="mb-12">
            <p className="eyebrow mb-4">What drives us</p>
            <h2 className="heading-lg">Our core values</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Reveal key={value.title} delay={index * 0.08} className="bg-white rounded-4xl p-8">
                  <Icon size={22} className="text-primary mb-10" />
                  <h3 className="text-xl font-semibold tracking-tight text-text-main mb-2">
                    {value.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {value.description}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to work with us?"
        description="Let our expert team help you find your perfect property in Accra."
        secondary={null}
      />
    </>
  );
}
