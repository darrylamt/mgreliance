import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import PostCard from "@/components/blog/PostCard";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Blog — Real Estate Insights & Market Updates",
  description:
    "Expert real estate insights, market updates, buying guides, and property tips from MG Reliance Property Developers in Accra, Ghana. Stay informed on the Greater Accra property market.",
  openGraph: {
    title: "Real Estate Blog | MG Reliance Property Developers",
    description:
      "Market updates, expert advice, and property tips from Accra's trusted real estate team.",
    url: "/blog",
  },
  alternates: { canonical: "/blog" },
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
      <PageHeader
        eyebrow="Blog"
        title="Real estate insights."
        description="Market updates, expert advice and property tips from the MG Reliance team."
        crumbs={[{ label: "Blog" }]}
      />

      <section className="pb-24 sm:pb-32 bg-white">
        <div className="container-page">
          {error ? (
            <div className="text-center py-20 rounded-4xl bg-background">
              <p className="text-text-secondary">
                Unable to load posts at this time. Please try again later.
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24 px-6 rounded-4xl bg-background">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen size={22} className="text-primary" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-text-main mb-2">
                Coming soon
              </h3>
              <p className="text-text-secondary text-sm max-w-md mx-auto">
                Our blog is being curated with expert real estate insights for
                the Accra market. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12">
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
