import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import JsonLd from "@/components/seo/JsonLd";
import Reveal from "@/components/ui/Reveal";
import CTABanner from "@/components/home/CTABanner";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mgrelianceproperties.com";

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const supabase = await createClient();
    const { data: post } = await supabase
      .from("posts")
      .select("title, excerpt, cover_image_url, author, published_at, category")
      .eq("slug", params.slug)
      .eq("published", true)
      .single();

    if (!post) return { title: "Post Not Found" };

    const description =
      post.excerpt ||
      `Read ${post.title} on the MG Reliance Property Developers blog — real estate insights for Accra, Ghana.`;

    return {
      title: post.title,
      description,
      authors: post.author ? [{ name: post.author }] : undefined,
      openGraph: {
        title: post.title,
        description,
        url: `/blog/${params.slug}`,
        type: "article",
        publishedTime: post.published_at || undefined,
        authors: post.author ? [post.author] : undefined,
        tags: post.category ? [post.category] : undefined,
        images: post.cover_image_url
          ? [{ url: post.cover_image_url, width: 1200, height: 630, alt: post.title }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: post.cover_image_url ? [post.cover_image_url] : [],
      },
      alternates: { canonical: `/blog/${params.slug}` },
    };
  } catch {
    return { title: "Blog Post | MG Reliance" };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (error || !post) {
    notFound();
  }

  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${BASE_URL}/blog/${post.slug}`,
    headline: post.title,
    description: post.excerpt || post.title,
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: {
      "@type": "Person",
      name: post.author || "MG Reliance Team",
    },
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "MG Reliance Property Developers",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.jpeg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`,
    },
    ...(post.cover_image_url && {
      image: {
        "@type": "ImageObject",
        url: post.cover_image_url,
        width: 1200,
        height: 630,
      },
    }),
    ...(post.category && { articleSection: post.category }),
    isPartOf: {
      "@type": "Blog",
      "@id": `${BASE_URL}/blog`,
      name: "MG Reliance Real Estate Blog",
      publisher: { "@id": `${BASE_URL}/#organization` },
    },
  };

  return (
    <>
      <JsonLd data={blogPostSchema} />

      {/* Post Header */}
      <header className="pt-36 sm:pt-40 pb-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-text-secondary mb-8 min-w-0">
              <Link href="/" className="hover:text-text-main transition-colors">Home</Link>
              <ChevronRight size={14} className="text-text-secondary/50 shrink-0" />
              <Link href="/blog" className="hover:text-text-main transition-colors">Blog</Link>
              <ChevronRight size={14} className="text-text-secondary/50 shrink-0" />
              <span className="text-text-main line-clamp-1">{post.title}</span>
            </nav>

            {post.category && (
              <div className="mb-5">
                <Badge variant="neutral">{post.category}</Badge>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] text-text-main">
              {post.title}
            </h1>

            <div className="mt-8 flex items-center gap-3 text-sm">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold shrink-0">
                {(post.author || "MG Reliance").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-medium text-text-main">{post.author || "MG Reliance"}</p>
                {post.published_at && (
                  <time dateTime={post.published_at} className="text-text-secondary">
                    {formatDate(post.published_at)}
                  </time>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="container-page">
          <Reveal className="relative aspect-[16/9] lg:aspect-[21/9] rounded-4xl overflow-hidden bg-background">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </Reveal>
        </div>
      )}

      {/* Post Content */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {post.excerpt && (
            <p className="text-xl text-text-main leading-relaxed mb-10 pb-10 border-b border-line">
              {post.excerpt}
            </p>
          )}

          {post.content ? (
            <article
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className="text-text-secondary">No content available.</p>
          )}

          <div className="mt-16 pt-8 border-t border-line">
            <Link href="/blog" className="link-arrow group">
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
              Back to blog
            </Link>
          </div>
        </div>
      </section>

      <CTABanner
        title="Looking for a property?"
        description="Let our expert team help you find the perfect property in Accra."
      />
    </>
  );
}
