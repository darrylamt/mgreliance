import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil, Calendar } from "lucide-react";
import type { Post } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import PostDeleteButton from "./PostDeleteButton";
import PaginationBar from "@/components/admin/PaginationBar";

const PAGE_SIZE = 10;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let posts: Post[] = [];
  let total = 0;

  try {
    const supabase = await createClient();
    const { data, count } = await supabase
      .from("posts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
    posts = data || [];
    total = count || 0;
  } catch {
    // handle gracefully
  }

  return (
    <>
      <AdminHeader
        title="Blog Posts"
        description={`${total} post${total !== 1 ? "s" : ""}`}
        action={
          <Link
            href="/admin/dashboard/posts/new"
            className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus size={15} />
            New Post
          </Link>
        }
      />

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
          <p className="text-text-secondary text-sm mb-4">No blog posts yet.</p>
          <Link
            href="/admin/dashboard/posts/new"
            className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Plus size={16} /> New Post
          </Link>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-3"
              >
                {/* Top row */}
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-main line-clamp-2 leading-snug">
                      {post.title}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5 truncate">
                      /{post.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/admin/dashboard/posts/${post.id}/edit`}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </Link>
                    <PostDeleteButton id={post.id} />
                  </div>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-2 flex-wrap border-t border-gray-50 pt-2">
                  <Badge variant={post.published ? "success" : "neutral"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                  {post.category && (
                    <span className="text-xs bg-gray-100 text-text-secondary px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-text-secondary ml-auto">
                    <Calendar size={11} />
                    {post.published_at ? formatDate(post.published_at) : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <PaginationBar
            page={page}
            total={total}
            pageSize={PAGE_SIZE}
            basePath="/admin/dashboard/posts"
          />
        </div>
      )}
    </>
  );
}
