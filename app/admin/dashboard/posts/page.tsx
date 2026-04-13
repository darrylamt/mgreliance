import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import type { Post } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import PostDeleteButton from "./PostDeleteButton";

export default async function PostsPage() {
  let posts: Post[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    posts = data || [];
  } catch {
    // handle gracefully
  }

  return (
    <>
      <AdminHeader
        title="Blog Posts"
        description="Manage your blog content."
        action={
          <Link
            href="/admin/dashboard/posts/new"
            className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            New Post
          </Link>
        }
      />

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-secondary text-sm mb-4">
              No blog posts yet. Write your first article.
            </p>
            <Link
              href="/admin/dashboard/posts/new"
              className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={16} />
              New Post
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden lg:table-cell">
                  Date
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-text-main line-clamp-1">
                      {post.title}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      /{post.slug}
                    </p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-text-secondary">
                      {post.category || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm text-text-secondary">
                      {post.published_at
                        ? formatDate(post.published_at)
                        : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={post.published ? "success" : "neutral"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/dashboard/posts/${post.id}/edit`}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        aria-label="Edit post"
                      >
                        <Pencil size={15} />
                      </Link>
                      <PostDeleteButton id={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
