"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin, Twitter, CheckCircle, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initialForm: FormData = {
  full_name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
        setForm(initialForm);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

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
              <span className="text-accent">Contact</span>
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Ready to start your property journey? Our team is here to help.
              Reach out and we&apos;ll respond within one business day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="bg-card rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h2 className="font-playfair text-2xl font-bold text-text-main mb-2">
                  Send Us a Message
                </h2>
                <p className="text-text-secondary text-sm mb-8">
                  Fill in the form below and we&apos;ll get back to you shortly.
                </p>

                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h3 className="font-playfair text-xl font-bold text-text-main mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-text-secondary text-sm mb-6">
                      Thank you for reaching out. We&apos;ll be in touch within one
                      business day.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="text-primary text-sm font-semibold hover:text-accent transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {/* Error Alert */}
                    {error && (
                      <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                        <AlertCircle size={16} className="shrink-0" />
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="full_name"
                          className="block text-sm font-medium text-text-main mb-2"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="full_name"
                          name="full_name"
                          type="text"
                          required
                          value={form.full_name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-text-main mb-2"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-text-main mb-2"
                        >
                          Phone Number{" "}
                          <span className="text-text-secondary text-xs font-normal">
                            (optional)
                          </span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                          placeholder="+233 244 000 000"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-text-main mb-2"
                        >
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors bg-white"
                        >
                          <option value="">Select a subject</option>
                          <option value="Residential Sales">
                            Residential Sales
                          </option>
                          <option value="Commercial Leasing">
                            Commercial Leasing
                          </option>
                          <option value="Land Acquisition">
                            Land Acquisition
                          </option>
                          <option value="Property Management">
                            Property Management
                          </option>
                          <option value="General Enquiry">
                            General Enquiry
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-text-main mb-2"
                      >
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={loading}
                      className="w-full"
                    >
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info + Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Contact Details */}
              <div className="bg-primary rounded-2xl p-8 text-white">
                <h3 className="font-playfair text-xl font-bold mb-6">
                  Contact Information
                </h3>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs mb-0.5">Address</p>
                      <p className="text-sm">East Legon, Accra, Ghana</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs mb-0.5">Phone</p>
                      <a
                        href="tel:+233244274630"
                        className="text-sm hover:text-accent transition-colors"
                      >
                        +233 244 27 4630
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs mb-0.5">Email</p>
                      <a
                        href="mailto:info@mgrelianceproperty.com"
                        className="text-sm hover:text-accent transition-colors break-all"
                      >
                        info@mgrelianceproperty.com
                      </a>
                    </div>
                  </li>
                </ul>

                {/* Social Links */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-white/50 text-xs mb-4">Follow Us</p>
                  <div className="flex gap-3">
                    {[
                      { icon: Instagram, label: "Instagram" },
                      { icon: Facebook, label: "Facebook" },
                      { icon: Linkedin, label: "LinkedIn" },
                      { icon: Twitter, label: "Twitter" },
                    ].map(({ icon: Icon, label }) => (
                      <a
                        key={label}
                        href="#"
                        aria-label={label}
                        className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
                      >
                        <Icon size={15} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Google Map Embed */}
              <div className="rounded-2xl overflow-hidden border border-gray-100 h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.3879282720856!2d-0.15750668525823258!3d5.636069595975699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2d7f0c7%3A0xfcf2dd6c8f5b3efd!2sEast%20Legon%2C%20Accra%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1700000000000!5m2!1sen!2sgh"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MG Reliance location - East Legon, Accra"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
