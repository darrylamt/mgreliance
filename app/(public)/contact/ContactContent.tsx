"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin, Twitter, Check, AlertCircle, ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";

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

export default function ContactContent() {
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
        track("contact_submit", { subject: form.subject || "none" });
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
      <PageHeader
        eyebrow="Contact"
        title="Let's talk property."
        description="Ready to start your property journey? Reach out and we'll respond within one business day."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="pb-24 sm:pb-32 bg-white">
        <div className="container-page grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Contact Form */}
          <Reveal className="lg:col-span-3 bg-background rounded-4xl p-6 sm:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-text-main">
              Send us a message
            </h2>
            <p className="text-text-secondary text-sm mt-1 mb-8">
              Fill in the form below and we&apos;ll get back to you shortly.
            </p>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-14 bg-white rounded-3xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                    className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-5"
                  >
                    <Check size={28} className="text-white" strokeWidth={2.5} />
                  </motion.div>
                  <h3 className="text-xl font-semibold tracking-tight text-text-main mb-2">
                    Message sent
                  </h3>
                  <p className="text-text-secondary text-sm mb-6 max-w-xs mx-auto">
                    Thank you for reaching out. We&apos;ll be in touch within one
                    business day.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="btn btn-secondary"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  noValidate
                >
                  {error && (
                    <div className="flex items-center gap-3 bg-red-50 text-red-700 rounded-2xl p-4 text-sm">
                      <AlertCircle size={16} className="shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="full_name" className="label">
                        Full name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        required
                        value={form.full_name}
                        onChange={handleChange}
                        className="input"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="label">
                        Email address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="input"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="label">
                        Phone{" "}
                        <span className="text-text-secondary text-xs font-normal">(optional)</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className="input"
                        placeholder="+233 244 000 000"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="label">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="">Select a subject</option>
                        <option value="Residential Sales">Residential Sales</option>
                        <option value="Commercial Leasing">Commercial Leasing</option>
                        <option value="Land Acquisition">Land Acquisition</option>
                        <option value="Property Management">Property Management</option>
                        <option value="General Enquiry">General Enquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="label">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      className="input resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full sm:w-auto">
                    Send message
                    <ArrowUpRight size={16} />
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>

          {/* Contact Info + Map */}
          <Reveal delay={0.1} className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-primary rounded-4xl p-8 text-white">
              <h3 className="text-xl font-semibold tracking-tight mb-8">Contact information</h3>
              <address className="not-italic space-y-6">
                {[
                  { icon: MapPin, label: "Address", value: "East Legon, Accra, Ghana" },
                  { icon: Phone, label: "Phone", value: "+233 244 27 4630", href: "tel:+233244274630" },
                  { icon: Mail, label: "Email", value: "info@mgrelianceproperties.com", href: "mailto:info@mgrelianceproperties.com" },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Icon size={17} className="text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white/50 text-xs mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm hover:text-accent transition-colors break-all">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </address>

              <div className="mt-8 pt-6 border-t border-white/10 flex gap-2">
                {[
                  { icon: Instagram, label: "Instagram" },
                  { icon: Facebook, label: "Facebook" },
                  { icon: Linkedin, label: "LinkedIn" },
                  { icon: Twitter, label: "Twitter / X" },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={`Follow MG Reliance on ${label}`}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-4xl overflow-hidden flex-1 min-h-[260px] bg-background">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.3879282720856!2d-0.15750668525823258!3d5.636069595975699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2d7f0c7%3A0xfcf2dd6c8f5b3efd!2sEast%20Legon%2C%20Accra%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1700000000000!5m2!1sen!2sgh"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 260 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MG Reliance Property Developers — East Legon, Accra, Ghana"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
