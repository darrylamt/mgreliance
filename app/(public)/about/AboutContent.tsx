"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Target, Heart, Award, Users, Shield } from "lucide-react";

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
      "We are committed to delivering exceptional service and results, consistently exceeding the expectations of our clients.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We invest in the communities we serve, contributing to a thriving Accra real estate market that benefits everyone.",
  },
];

export default function AboutContent() {
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
              <span className="text-accent">About</span>
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              About Us
            </h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Accra&apos;s trusted real estate partner — built on integrity,
              driven by results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Full Company Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative h-[500px] rounded-2xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80"
                alt="MG Reliance office in East Legon"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-5"
            >
              <div>
                <div className="h-0.5 w-12 bg-accent mb-4" />
                <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
                  Our Story
                </p>
                <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-text-main mb-5">
                  Building Ghana&apos;s Real Estate Future
                </h2>
              </div>
              <p className="text-text-secondary leading-relaxed">
                MG Reliance Property Developers is a premier real estate agency
                founded in Accra, Ghana. We specialise in residential and
                commercial properties, serving a diverse clientele across
                Greater Accra.
              </p>
              <p className="text-text-secondary leading-relaxed">
                With a dedicated team of experienced agents, we guide clients
                through every step of the buying, selling, or leasing process
                with transparency, market expertise, and a personal touch.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Our mission is to make homeownership accessible and investment
                straightforward for every Ghanaian family and individual. From
                first-time buyers to seasoned investors, every client receives
                the same high standard of care and professionalism.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="h-0.5 w-12 bg-accent mx-auto mb-4" />
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-text-main">
              Vision &amp; Mission
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-5">
                <Eye size={24} className="text-accent" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-text-main mb-4">
                Our Vision
              </h3>
              <p className="text-text-secondary leading-relaxed">
                To be the most trusted real estate agency in Ghana, recognised
                for integrity and innovation. We envision a Ghana where every
                family has access to quality housing and every investor can
                build lasting wealth through property.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-5">
                <Target size={24} className="text-accent" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-text-main mb-4">
                Our Mission
              </h3>
              <p className="text-text-secondary leading-relaxed">
                To provide exceptional real estate services that exceed client
                expectations, understanding and fulfilling the unique needs of
                every client. We are committed to transparency, expertise, and
                delivering results that make a lasting difference.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Spotlight */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="h-0.5 w-12 bg-accent mx-auto mb-4" />
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-text-main">
              Meet the Founder
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-background rounded-2xl overflow-hidden border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative h-80 md:h-auto min-h-[320px]">
                  <Image
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80"
                    alt="Wisdom Geotrah, Founder of MG Reliance"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/80 to-transparent p-6 md:hidden">
                    <h3 className="font-playfair text-xl font-bold text-white">
                      Wisdom Geotrah
                    </h3>
                    <p className="text-accent text-sm">
                      Founder &amp; Managing Director
                    </p>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="hidden md:block mb-4">
                    <h3 className="font-playfair text-2xl font-bold text-text-main">
                      Wisdom Geotrah
                    </h3>
                    <p className="text-accent font-semibold text-sm mt-1">
                      Founder &amp; Managing Director
                    </p>
                  </div>
                  <div className="h-0.5 w-12 bg-accent mb-5" />
                  <p className="text-text-secondary leading-relaxed text-sm mb-4">
                    Wisdom Geotrah founded MG Reliance in 2010 with a vision to
                    transform the real estate experience in Ghana. With over a
                    decade of hands-on experience in the Accra property market,
                    he brings unmatched local insight and a deep passion for
                    connecting people with the right properties.
                  </p>
                  <p className="text-text-secondary leading-relaxed text-sm">
                    Under his leadership, MG Reliance has grown into one of
                    Greater Accra&apos;s most trusted agencies, helping over 500
                    clients achieve their property goals with integrity and
                    excellence.
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <Shield size={16} className="text-accent" />
                    <span className="text-text-secondary text-xs">
                      Over 15 years in Ghana real estate
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Values */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="h-0.5 w-12 bg-accent mx-auto mb-4" />
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-text-main">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center bg-card rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-playfair text-xl font-semibold text-text-main mb-3">
                    {value.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-5">
              Ready to Work With Us?
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Let our expert team help you find your perfect property in Accra.
            </p>
            <Link
              href="/contact"
              className="bg-accent text-white font-semibold px-8 py-4 rounded-xl hover:bg-accent/90 transition-colors inline-block"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
