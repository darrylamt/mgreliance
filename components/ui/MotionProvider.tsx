"use client";

import { MotionConfig } from "framer-motion";

/** Respects the visitor's OS "reduce motion" setting for all framer-motion animations. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
