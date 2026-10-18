"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Link2, Check, X, Smartphone, Printer, Loader2, MoreHorizontal } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  url: string;
  title: string;
  /** Short line used in WhatsApp / X messages, e.g. price + location. */
  text?: string;
  /** Property extras: portrait Status image + printable flyer. */
  storyImageUrl?: string;
  flyerUrl?: string;
  /** Analytics label, e.g. "property" or "post". */
  contentType?: string;
  className?: string;
}

function FacebookIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41Z" />
    </svg>
  );
}

export default function ShareButton({
  url,
  title,
  text,
  storyImageUrl,
  flyerUrl,
  contentType = "page",
  className,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [storyBusy, setStoryBusy] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share), []);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || sheetRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const message = text ? `${title} — ${text}` : title;
  const done = (method: string) => {
    track("share", { method, content_type: contentType });
    setOpen(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      track("share", { method: "copy", content_type: contentType });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked — the native share sheet is the fallback.
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text: message, url });
      done("native");
    } catch {
      // User cancelled.
    }
  };

  /** Share the portrait image straight to WhatsApp Status where supported, else download it. */
  const shareStory = async () => {
    if (!storyImageUrl) return;
    setStoryBusy(true);
    try {
      const res = await fetch(storyImageUrl);
      const blob = await res.blob();
      const file = new File([blob], "mg-reliance-property.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: `${message}\n${url}` });
        track("story_image", { method: "share" });
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
        track("story_image", { method: "download" });
      }
      setOpen(false);
    } catch {
      // Cancelled or failed — leave the menu open so they can try another option.
    } finally {
      setStoryBusy(false);
    }
  };

  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  /**
   * On phones the Facebook app intercepts sharer.php links and drops the URL, so it just
   * opens the feed. The native share sheet hands the link to the app properly; desktop
   * gets the classic sharer popup.
   */
  const shareFacebook = async (e: React.MouseEvent) => {
    e.preventDefault();
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (touch && navigator.share) {
      try {
        await navigator.share({ title, text: message, url });
        done("facebook");
      } catch {
        // User cancelled.
      }
      return;
    }
    const w = 600;
    const h = 560;
    const popup = window.open(
      facebookHref,
      "fb-share",
      `width=${w},height=${h},left=${window.screenX + (window.outerWidth - w) / 2},top=${window.screenY + (window.outerHeight - h) / 2}`
    );
    if (!popup) window.location.href = facebookHref;
    done("facebook");
  };

  const links: {
    label: string;
    icon: React.ReactNode;
    href: string;
    method: string;
    color: string;
    onClick?: (e: React.MouseEvent) => void;
  }[] = [
    {
      label: "WhatsApp",
      icon: <WhatsAppIcon size={17} />,
      href: `https://wa.me/?text=${encodeURIComponent(`${message}\n${url}`)}`,
      method: "whatsapp",
      color: "text-[#25D366]",
    },
    {
      label: "Facebook",
      icon: <FacebookIcon />,
      href: facebookHref,
      method: "facebook",
      onClick: shareFacebook,
      color: "text-[#1877F2]",
    },
    {
      label: "X",
      icon: <XIcon />,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`,
      method: "x",
      color: "text-text-main",
    },
  ];

  const itemClass =
    "w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-text-main hover:bg-background transition-colors text-left";

  const menu = (
    <>
      <div className="grid grid-cols-3 gap-2 p-1">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={l.onClick ?? (() => done(l.method))}
            className="flex flex-col items-center gap-2 rounded-2xl bg-background py-3.5 text-xs font-medium text-text-main hover:bg-line transition-colors"
          >
            <span className={l.color}>{l.icon}</span>
            {l.label}
          </a>
        ))}
      </div>
      <div className="mt-1 space-y-0.5">
        <button type="button" onClick={copy} className={itemClass}>
          {copied ? <Check size={16} className="text-primary" /> : <Link2 size={16} />}
          {copied ? "Link copied" : "Copy link"}
        </button>
        {storyImageUrl && (
          <button type="button" onClick={shareStory} disabled={storyBusy} className={itemClass}>
            {storyBusy ? <Loader2 size={16} className="animate-spin" /> : <Smartphone size={16} />}
            <span className="flex-1">
              Share to WhatsApp Status
              <span className="block text-xs font-normal text-text-secondary">
                Portrait image with price & our number
              </span>
            </span>
          </button>
        )}
        {flyerUrl && (
          <a
            href={flyerUrl}
            target="_blank"
            rel="noopener"
            onClick={() => {
              track("flyer_open");
              setOpen(false);
            }}
            className={itemClass}
          >
            <Printer size={16} />
            <span className="flex-1">
              Print flyer
              <span className="block text-xs font-normal text-text-secondary">A4 with photos & QR code</span>
            </span>
          </a>
        )}
        {canNativeShare && (
          <button type="button" onClick={nativeShare} className={itemClass}>
            <MoreHorizontal size={16} />
            More options
          </button>
        )}
      </div>
    </>
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn("btn btn-secondary", className)}
      >
        <Share2 size={16} />
        Share
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Desktop: dropdown */}
            <motion.div
              key="share-dropdown"
              role="dialog"
              aria-label="Share"
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="hidden sm:block absolute right-0 top-full mt-2 z-50 w-80 max-w-[calc(100vw-2rem)] origin-top-right rounded-3xl border border-line bg-white p-2 shadow-soft"
            >
              {menu}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              // Mobile bottom sheet, portalled so `fixed` isn't trapped by transformed ancestors.
              <motion.div key="share-sheet" ref={sheetRef} className="sm:hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-black/30"
                  onClick={() => setOpen(false)}
                />
                <motion.div
                  role="dialog"
                  aria-label="Share"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 380, damping: 36 }}
                  className="fixed inset-x-0 bottom-0 z-[61] rounded-t-4xl bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
                >
                  <div className="flex items-center justify-between px-2 pb-3">
                    <p className="font-semibold text-text-main">Share</p>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close"
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-background"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  {menu}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
