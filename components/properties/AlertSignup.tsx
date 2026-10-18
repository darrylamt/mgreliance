"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, Check, Loader2 } from "lucide-react";
import { describeAlert } from "@/lib/alerts";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface AlertSignupProps {
  type?: string;
  status?: string;
  location?: string;
  title?: string;
  description?: string;
  /** "card" = full panel, "inline" = compact bar for toolbars. */
  variant?: "card" | "inline";
  className?: string;
}

export default function AlertSignup({
  type,
  status,
  location,
  title,
  description,
  variant = "card",
  className,
}: AlertSignupProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const what = describeAlert({ type, status, location });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type, status, location }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setState("idle");
        return;
      }
      setState("done");
      track("alert_signup", { type: type || "any", status: status || "any", location: location || "any" });
    } catch {
      setError("Network error. Please try again.");
      setState("idle");
    }
  };

  const form = (
    <form onSubmit={submit} className={cn("flex gap-2", variant === "card" ? "flex-col sm:flex-row" : "flex-row")}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError(null);
        }}
        placeholder="Your email"
        aria-label="Email for listing alerts"
        className={cn("input flex-1 min-w-0", variant === "card" ? "rounded-full" : "rounded-full py-2.5")}
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className={cn("btn btn-primary shrink-0", variant === "card" && "btn-lg")}
      >
        {state === "sending" ? <Loader2 size={16} className="animate-spin" /> : <BellRing size={16} />}
        Notify me
      </button>
    </form>
  );

  const success = (
    <motion.div
      key="done"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3"
    >
      <span className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
        <Check size={17} className="text-white" strokeWidth={2.5} />
      </span>
      <p className="text-sm text-text-main">
        You&apos;re on the list — we&apos;ll email you new {what}.
      </p>
    </motion.div>
  );

  if (variant === "inline") {
    return (
      <div className={cn("rounded-3xl bg-background p-4 sm:p-5", className)}>
        <AnimatePresence mode="wait">
          {state === "done" ? (
            success
          ) : (
            <motion.div key="form" exit={{ opacity: 0 }} className="flex flex-col lg:flex-row lg:items-center gap-3">
              <p className="text-sm text-text-main lg:flex-1">
                <BellRing size={15} className="inline -mt-0.5 mr-1.5 text-primary" />
                Get an email when new <strong className="font-semibold">{what}</strong> are listed.
              </p>
              <div className="lg:w-[420px]">{form}</div>
            </motion.div>
          )}
        </AnimatePresence>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className={cn("h-full rounded-4xl bg-background p-7 sm:p-10 flex flex-col justify-center", className)}>
      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-8">
        <BellRing size={20} className="text-primary" />
      </div>
      <h3 className="text-2xl font-semibold tracking-tight text-text-main">
        {title || `Get new ${what} by email`}
      </h3>
      <p className="mt-2 mb-7 text-text-secondary leading-relaxed">
        {description || "Be first to hear about new listings. One email per new property, unsubscribe any time."}
      </p>
      <AnimatePresence mode="wait">{state === "done" ? success : <motion.div key="form" exit={{ opacity: 0 }}>{form}</motion.div>}</AnimatePresence>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
