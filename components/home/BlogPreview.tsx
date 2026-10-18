"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PostCard from "@/components/blog/PostCard";
import Reveal from "@/components/ui/Reveal";
import type { Post } from "@/lib/types";

interface BlogPreviewProps {
  posts: Post[];
}

export default function BlogPreview({ posts }: BlogPreviewProps) {
  if (posts.length === 0) return null;

  return (
    <section className="pt-24 sm:pt-32 pb-8 bg-white">
      <div className="container-page">
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="eyebrow mb-4">News &amp; insights</p>
            <h2 className="heading-lg">From the blog</h2>
          </div>
          <Link href="/blog" className="link-arrow group shrink-0">
            View all posts
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-10">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
