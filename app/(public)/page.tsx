import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Property, Post } from "@/lib/types";

import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedListings from "@/components/home/FeaturedListings";
import ServicesSection from "@/components/home/ServicesSection";
import FreshListings from "@/components/home/FreshListings";
import AboutPreview from "@/components/home/AboutPreview";
import Testimonials from "@/components/home/Testimonials";
import BlogPreview from "@/components/home/BlogPreview";
import CTABanner from "@/components/home/CTABanner";

export const metadata: Metadata = {
  title: "MG Reliance Property Developers | Real Estate in Accra, Ghana",
  description:
    "Find your perfect property in Accra with MG Reliance Property Developers. Residential homes, commercial spaces & land for sale or rent across Greater Accra, Ghana. Trusted since 2010.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  let featured: Property[] = [];
  let fresh: Property[] = [];
  let posts: Post[] = [];
  let counts = { residential: 0, commercial: 0, land: 0 };

  try {
    const supabase = await createClient();

    const [featuredRes, freshRes, postsRes, countsRes] = await Promise.all([
      supabase
        .from("properties")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(3),
      supabase
        .from("properties")
        .select("type"),
    ]);

    featured = featuredRes.data || [];
    fresh = freshRes.data || [];
    posts = postsRes.data || [];

    const allProps = countsRes.data || [];
    counts = {
      residential: allProps.filter((p) => p.type === "residential").length,
      commercial: allProps.filter((p) => p.type === "commercial").length,
      land: allProps.filter((p) => p.type === "land").length,
    };
  } catch {
    // fallback to empty — sections handle gracefully
  }

  return (
    <>
      <Hero />
      <Categories counts={counts} />
      <FeaturedListings properties={featured} />
      <ServicesSection />
      <FreshListings properties={fresh} />
      <AboutPreview />
      <Testimonials />
      <BlogPreview posts={posts} />
      <CTABanner />
    </>
  );
}
