"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/lib/contact";
import { track } from "@/lib/analytics";

const BUBBLE_KEY = "mgr:wa-bubble-seen";

export default function WhatsAppButton() {
  const [showBubble, setShowBubble] = useState(false);

  // Show a one-time "chat with us" bubble per session.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(BUBBLE_KEY) === "1";
    } catch {}
    if (seen) return;
    const show = setTimeout(() => setShowBubble(true), 4000);
    const hide = setTimeout(() => setShowBubble(false), 12000);
    try {
      sessionStorage.setItem(BUBBLE_KEY, "1");
    } catch {}
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-end gap-3">
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, x: 12, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-1 bg-white rounded-2xl rounded-br-md shadow-soft border border-line pl-4 pr-9 py-3 max-w-[220px]"
          >
            <p className="text-sm font-semibold text-text-main">Questions about a property?</p>
            <p className="text-xs text-text-secondary mt-0.5">Chat with us on WhatsApp.</p>
            <button
              onClick={() => setShowBubble(false)}
              aria-label="Dismiss"
              className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-text-secondary hover:bg-background"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsappLink("Hi MG Reliance, I'd like to make an enquiry.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with MG Reliance on WhatsApp"
        onClick={() => track("whatsapp_click", { location: "floating" })}
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.2 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] motion-safe:animate-ping opacity-20" />
        <WhatsAppIcon size={28} className="relative" />
      </motion.a>
    </div>
  );
}
