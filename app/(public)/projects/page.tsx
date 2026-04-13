import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Properties & Projects",
  description:
    "Browse MG Reliance's property listings across Greater Accra — residential, commercial, and land. Find your perfect property in Ghana.",
};

export default async function ProjectsPage() {
  let properties: Property[] = [];
  let error = false;

  try {
    const supabase = await createClient();
    const { data, error: dbError } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (dbError) throw dbError;
    properties = data || [];
  } catch {
    error = true;
  }

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
          <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-accent">Projects</span>
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Our Properties
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Explore our curated selection of residential, commercial, and land
            opportunities across Greater Accra.
          </p>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error ? (
            <div className="text-center py-16">
              <p className="text-text-secondary">
                Unable to load properties at this time. Please try again later.
              </p>
            </div>
          ) : (
            <ProjectsClient properties={properties} />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-4">
            Don&apos;t See What You&apos;re Looking For?
          </h2>
          <p className="text-white/70 mb-6">
            Tell us what you need and our team will find the right property for
            you.
          </p>
          <Link
            href="/contact"
            className="bg-accent text-white font-semibold px-8 py-3 rounded-xl hover:bg-accent/90 transition-colors inline-block"
          >
            Contact Our Team
          </Link>
        </div>
      </section>
    </>
  );
}
