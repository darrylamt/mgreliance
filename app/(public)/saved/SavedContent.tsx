"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import PropertyCard from "@/components/properties/PropertyCard";
import { createClient } from "@/lib/supabase/client";
import { useSavedProperties } from "@/lib/useSavedProperties";
import type { Property } from "@/lib/types";

export default function SavedContent() {
  const { ids, clear } = useSavedProperties();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Only refetch when a property is added — removals just filter what we already have.
  const idsKey = ids.join(",");
  useEffect(() => {
    if (!mounted) return;
    const missing = ids.filter((id) => !properties.some((p) => p.id === id));
    if (missing.length === 0) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    createClient()
      .from("properties")
      .select("*")
      .in("id", ids)
      .then(({ data }) => {
        if (!cancelled) {
          setProperties(data || []);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, mounted]);

  // Keep the visitor's saved order (most recently saved first); drop deleted listings.
  const visible = ids
    .map((id) => properties.find((p) => p.id === id))
    .filter((p): p is Property => Boolean(p));

  const showEmpty = mounted && !loading && visible.length === 0;

  return (
    <>
      <PageHeader
        eyebrow="Saved"
        title="Your saved properties."
        description="Tap the heart on any listing to keep it here. Saved properties stay on this device."
        crumbs={[{ label: "Saved" }]}
      >
        {visible.length > 0 && (
          <div className="mt-8 flex items-center gap-4 text-sm">
            <span className="text-text-secondary tabular-nums">
              {visible.length} saved
            </span>
            <button
              onClick={clear}
              className="font-medium text-text-secondary hover:text-text-main underline underline-offset-4 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </PageHeader>

      <section className="pb-24 sm:pb-32 bg-white">
        <div className="container-page">
          {!mounted || (loading && visible.length === 0) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
              {[0, 1, 2].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] rounded-3xl bg-background" />
                  <div className="mt-4 h-4 w-2/3 rounded-full bg-background" />
                  <div className="mt-2 h-3 w-1/3 rounded-full bg-background" />
                </div>
              ))}
            </div>
          ) : showEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 px-6 bg-background rounded-4xl"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart size={22} className="text-primary" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-text-main mb-2">
                Nothing saved yet
              </h3>
              <p className="text-text-secondary text-sm max-w-sm mx-auto mb-8">
                Browse our listings and tap the heart on the ones you like to
                compare them later.
              </p>
              <Link href="/projects" className="btn btn-primary">
                Browse properties
              </Link>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
              <AnimatePresence mode="popLayout">
                {visible.map((property, index) => (
                  <motion.div
                    key={property.id}
                    layout
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PropertyCard property={property} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
