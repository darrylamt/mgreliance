import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import JsonLd from "@/components/seo/JsonLd";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mgrelianceproperty.com";

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

      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="relative w-full h-[40vh] min-h-[300px] mt-0">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/20" />
        </div>
      )}

      {/* Post Header */}
      <div className={`bg-primary ${post.cover_image_url ? "" : "pt-32"} pb-16`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/50 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-accent line-clamp-1">{post.title}</span>
          </nav>

          {post.category && (
            <div className="mb-4">
              <Badge variant="accent">{post.category}</Badge>
            </div>
          )}

          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <User size={14} />
              <span>{post.author || "MG Reliance"}</span>
            </div>
            {post.published_at && (
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              </div>
            )}
            {post.category && (
              <div className="flex items-center gap-2">
                <Tag size={14} />
                <span>{post.category}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {post.excerpt && (
            <p className="text-lg text-text-secondary font-medium leading-relaxed mb-8 pb-8 border-b border-gray-100">
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

          {/* Back to Blog */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Blog
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-16 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-playfair text-2xl font-bold text-text-main mb-3">
            Looking for a Property?
          </h3>
          <p className="text-text-secondary mb-6">
            Let our expert team help you find the perfect property in Accra.
          </p>
          <Link
            href="/contact"
            className="bg-primary text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors inline-block"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
