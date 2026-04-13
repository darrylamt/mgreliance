"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";

interface PostCardProps {
  post: Post;
  index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
      className="group bg-card rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <span className="font-playfair text-primary/30 text-xl">
              MG Reliance
            </span>
          </div>
        )}
        {post.category && (
          <div className="absolute top-3 left-3">
            <Badge variant="accent">{post.category}</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="font-playfair text-lg font-semibold text-text-main mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-text-secondary mb-5">
          {post.author && (
            <div className="flex items-center gap-1.5">
              <User size={12} className="shrink-0" />
              <span>{post.author}</span>
            </div>
          )}
          {post.published_at && (
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="shrink-0" />
              <span>{formatDate(post.published_at)}</span>
            </div>
          )}
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-accent transition-colors group/link"
        >
          Read More
          <ArrowRight
            size={14}
            className="group-hover/link:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </motion.article>
  );
}
