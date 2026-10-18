"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";

interface PostCardProps {
  post: Post;
  index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  const date = post.published_at || post.created_at;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        {/* Cover Image */}
        <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-background">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-primary/25 text-xl font-semibold tracking-tight">
                MG Reliance
              </span>
            </div>
          )}
          {post.category && (
            <span className="chip absolute top-4 left-4 bg-white/90 text-text-main backdrop-blur-md">
              {post.category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="pt-5 px-1">
          <div className="flex items-center gap-2 text-xs text-text-secondary mb-2.5">
            {date && <span>{formatDate(date)}</span>}
            {post.author && (
              <>
                <span className="w-1 h-1 rounded-full bg-line" />
                <span>{post.author}</span>
              </>
            )}
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-text-main leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mt-2 text-text-secondary text-sm leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-text-main">
            Read article
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
