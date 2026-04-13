import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import PostCard from "@/components/blog/PostCard";

export const metadata: Metadata = {
  title: "Blog — Real Estate Insights",
  description:
    "Expert real estate insights, market updates, and property tips from MG Reliance Property Developers in Accra, Ghana.",
};

export default async function BlogPage() {
  let posts: Post[] = [];
  let error = false;

  try {
    const supabase = await createClient();
    const { data, error: dbError } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (dbError) throw dbError;
    posts = data || [];
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
            <span className="text-accent">Blog</span>
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Real Estate Insights
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Market updates, expert advice, and property tips from the MG
            Reliance team.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error ? (
            <div className="text-center py-16">
              <p className="text-text-secondary">
                Unable to load posts at this time. Please try again later.
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <BookOpen size={28} className="text-primary" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-text-main mb-3">
                Coming Soon
              </h3>
              <p className="text-text-secondary text-sm max-w-md mx-auto">
                Our blog is being curated with expert real estate insights for
                the Accra market. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
