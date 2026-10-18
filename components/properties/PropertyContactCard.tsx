"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Phone, Loader2, AlertCircle, ArrowUpRight, CalendarCheck } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  slotsForDate,
  upcomingViewingDays,
  whatsappLink,
} from "@/lib/contact";
import type { Property } from "@/lib/types";

type Mode = "enquiry" | "viewing";

const ease = [0.22, 1, 0.36, 1] as const;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mgrelianceproperties.com";

function dayParts(date: string) {
  const d = new Date(`${date}T12:00:00`);
  return {
    weekday: d.toLocaleDateString("en-GB", { weekday: "short" }),
    day: d.getDate(),
    month: d.toLocaleDateString("en-GB", { month: "short" }),
    long: d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }),
  };
}

export default function PropertyContactCard({ property }: { property: Property }) {
  const [mode, setMode] = useState<Mode>("enquiry");
  const days = useMemo(() => upcomingViewingDays(14), []);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    message: `Hi, I'm interested in "${property.title}". Please contact me with more details.`,
    notes: "",
  });
  const [viewingDate, setViewingDate] = useState(days[0]);
  const [viewingTime, setViewingTime] = useState<string | null>(null);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<Mode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const slots = slotsForDate(viewingDate);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const pickDate = (date: string) => {
    setViewingDate(date);
    if (viewingTime && !slotsForDate(date).includes(viewingTime)) setViewingTime(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "viewing" && !viewingTime) {
      setError("Please pick a time for your viewing.");
      return;
    }
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: mode,
          property_id: property.id,
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          message: mode === "viewing" ? form.notes : form.message,
          ...(mode === "viewing" && { viewing_date: viewingDate, viewing_time: viewingTime }),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send. Please try again.");
      } else {
        setSent(mode);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const pageUrl = `${SITE_URL}/projects/${property.id}`;
  const waMessage = `Hi MG Reliance, I'm interested in "${property.title}" (${property.location}). ${pageUrl}`;

  return (
    <div className="bg-background rounded-4xl p-6 sm:p-7">
      <h3 className="text-xl font-semibold tracking-tight text-text-main">Interested?</h3>
      <p className="text-sm text-text-secondary mt-1 mb-5">
        Ask a question or book a time to see it in person.
      </p>

      {/* Mode toggle */}
      {!sent && (
        <div className="flex bg-white rounded-full p-1 mb-5">
          {(
            [
              { key: "enquiry", label: "Enquire" },
              { key: "viewing", label: "Book a viewing" },
            ] as const
          ).map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => {
                setMode(m.key);
                setError(null);
              }}
              className={`relative flex-1 px-3 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                mode === m.key ? "text-white" : "text-text-secondary hover:text-text-main"
              }`}
            >
              {mode === m.key && (
                <motion.span
                  layoutId="contact-mode"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  className="absolute inset-0 rounded-full bg-primary"
                />
              )}
              <span className="relative">{m.label}</span>
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 px-4 bg-white rounded-3xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
              className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              {sent === "viewing" ? (
                <CalendarCheck size={24} className="text-white" />
              ) : (
                <Check size={26} className="text-white" strokeWidth={2.5} />
              )}
            </motion.div>
            <p className="font-semibold text-text-main mb-1">
              {sent === "viewing" ? "Viewing requested" : "Enquiry sent"}
            </p>
            <p className="text-text-secondary text-sm">
              {sent === "viewing"
                ? `We'll call to confirm ${dayParts(viewingDate).long} at ${viewingTime}.`
                : "Our team will get back to you within 24 hours."}
            </p>
            <button
              type="button"
              onClick={() => setSent(null)}
              className="mt-5 text-sm font-medium text-text-secondary hover:text-text-main underline underline-offset-4"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-2xl p-3 text-sm">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            {mode === "viewing" && (
              <div className="space-y-3 pb-1">
                {/* Date strip */}
                <div>
                  <p className="text-xs font-medium text-text-secondary mb-2">Choose a day</p>
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1 pb-1">
                    {days.map((d) => {
                      const p = dayParts(d);
                      const active = d === viewingDate;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => pickDate(d)}
                          aria-pressed={active}
                          aria-label={p.long}
                          className={`shrink-0 w-14 rounded-2xl py-2.5 text-center transition-colors ${
                            active
                              ? "bg-primary text-white"
                              : "bg-white text-text-main hover:bg-white/70"
                          }`}
                        >
                          <span className={`block text-[11px] ${active ? "text-white/70" : "text-text-secondary"}`}>
                            {p.weekday}
                          </span>
                          <span className="block text-base font-semibold leading-tight">{p.day}</span>
                          <span className={`block text-[11px] ${active ? "text-white/70" : "text-text-secondary"}`}>
                            {p.month}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                <div>
                  <p className="text-xs font-medium text-text-secondary mb-2">Choose a time</p>
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setViewingTime(t);
                          if (error) setError(null);
                        }}
                        aria-pressed={viewingTime === t}
                        className={`rounded-full py-2 text-sm font-medium tabular-nums transition-colors ${
                          viewingTime === t
                            ? "bg-primary text-white"
                            : "bg-white text-text-main hover:bg-white/70"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <input
              name="full_name"
              type="text"
              required
              placeholder="Your name"
              aria-label="Your name"
              value={form.full_name}
              onChange={handleChange}
              className="input"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              aria-label="Email address"
              value={form.email}
              onChange={handleChange}
              className="input"
            />
            <input
              name="phone"
              type="tel"
              required={mode === "viewing"}
              placeholder={mode === "viewing" ? "Phone number" : "Phone (optional)"}
              aria-label="Phone"
              value={form.phone}
              onChange={handleChange}
              className="input"
            />
            {mode === "enquiry" ? (
              <textarea
                name="message"
                rows={4}
                required
                aria-label="Message"
                value={form.message}
                onChange={handleChange}
                className="input resize-none"
              />
            ) : (
              <textarea
                name="notes"
                rows={2}
                placeholder="Anything we should know? (optional)"
                aria-label="Notes"
                value={form.notes}
                onChange={handleChange}
                className="input resize-none"
              />
            )}

            <button type="submit" disabled={sending} className="btn btn-primary btn-lg w-full">
              {sending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending…
                </>
              ) : mode === "viewing" ? (
                <>
                  Request viewing <CalendarCheck size={16} />
                </>
              ) : (
                <>
                  Send enquiry <ArrowUpRight size={16} />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Direct contact */}
      <div className="mt-5 pt-5 border-t border-line grid grid-cols-2 gap-2">
        <a
          href={whatsappLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn bg-[#25D366] text-white hover:bg-[#1fbd59] px-4"
        >
          <WhatsAppIcon size={17} />
          WhatsApp
        </a>
        <a href={`tel:${PHONE_TEL}`} className="btn btn-secondary px-4" aria-label={`Call ${PHONE_DISPLAY}`}>
          <Phone size={15} />
          Call
        </a>
      </div>
    </div>
  );
}
