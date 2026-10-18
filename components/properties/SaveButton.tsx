"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useSavedProperties } from "@/lib/useSavedProperties";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

interface SaveButtonProps {
  propertyId: string;
  className?: string;
  /** "icon" for the round button on cards, "full" for a labelled button. */
  variant?: "icon" | "full";
}

export default function SaveButton({ propertyId, className, variant = "icon" }: SaveButtonProps) {
  const { isSaved, toggle } = useSavedProperties();
  const saved = isSaved(propertyId);

  const handleClick = (e: React.MouseEvent) => {
    // Cards are wrapped in a link — don't navigate when saving.
    e.preventDefault();
    e.stopPropagation();
    if (!saved) track("save_property", { property_id: propertyId });
    toggle(propertyId);
  };

  const heart = (
    <span className="relative flex">
      <motion.span
        key={saved ? "on" : "off"}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
        className="flex"
      >
        <Heart
          size={variant === "icon" ? 17 : 16}
          className={saved ? "fill-red-500 text-red-500" : ""}
        />
      </motion.span>
      <AnimatePresence>
        {saved && (
          <motion.span
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 2.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-full bg-red-400/40"
          />
        )}
      </AnimatePresence>
    </span>
  );

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={saved}
        className={cn("btn btn-secondary", className)}
      >
        {heart}
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.88 }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save property"}
      className={cn(
        "w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-text-main hover:bg-white transition-colors",
        className
      )}
    >
      {heart}
    </motion.button>
  );
}
