"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { generateSlug } from "@/lib/utils";
import type { Post } from "@/lib/types";

interface PostFormProps {
  initialData?: Partial<Post>;
  id?: string;
}

export default function PostForm({ initialData, id }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!id);

  const [form, setForm] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    cover_image_url: initialData?.cover_image_url || "",
    category: initialData?.category || "",
    published: initialData?.published || false,
    author: initialData?.author || "MG Reliance",
  });

  // Auto-generate slug from title (unless manually edited)
  useEffect(() => {
    if (!slugManuallyEdited && form.title) {
      setForm((prev) => ({ ...prev, slug: generateSlug(form.title) }));
    }
  }, [form.title, slugManuallyEdited]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (name === "slug") setSlugManuallyEdited(true);
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const payload = {
      title: form.title.trim(),
      slug: generateSlug(form.slug || form.title),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim() || null,
      cover_image_url: form.cover_image_url.trim() || null,
      category: form.category.trim() || null,
      published: form.published,
      author: form.author.trim() || "MG Reliance",
      published_at: form.published ? new Date().toISOString() : null,
    };

    const { error: dbError } = id
      ? await supabase.from("posts").update(payload).eq("id", id)
      : await supabase.from("posts").insert([payload]);

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
    } else {
      router.push("/admin/dashboard/posts");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                type="text"
                required
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Post title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Slug
              </label>
              <div className="flex items-center">
                <span className="text-text-secondary text-sm px-3 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl">
                  /blog/
                </span>
                <input
                  name="slug"
                  type="text"
                  value={form.slug}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="auto-generated-from-title"
                />
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Auto-generated from title. You can edit manually.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                rows={3}
                value={form.excerpt}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                placeholder="Short summary shown in blog listing..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Content (HTML)
              </label>
              <textarea
                name="content"
                rows={16}
                value={form.content}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none font-mono"
                placeholder="<p>Write your article content here...</p>&#10;<p>You can use HTML tags for formatting.</p>"
              />
              <p className="text-xs text-text-secondary mt-1">
                Supports HTML. Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;, etc.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publish Settings */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-text-secondary">
              Publish Settings
            </h3>
            <div className="flex items-center gap-3">
              <input
                id="published"
                name="published"
                type="checkbox"
                checked={form.published}
                onChange={handleChange}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <label
                htmlFor="published"
                className="text-sm font-medium text-text-main"
              >
                Published
              </label>
            </div>
            <p className="text-xs text-text-secondary">
              Published posts are visible to site visitors.
            </p>
          </div>

          {/* Meta */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-text-secondary">
              Post Details
            </h3>
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
              >
                <option value="">Select category</option>
                <option value="Market Insights">Market Insights</option>
                <option value="Buying Tips">Buying Tips</option>
                <option value="Investment">Investment</option>
                <option value="Property Management">Property Management</option>
                <option value="Neighbourhood Guide">Neighbourhood Guide</option>
                <option value="Company News">Company News</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Author
              </label>
              <input
                name="author"
                type="text"
                value={form.author}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="MG Reliance"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Cover Image URL
              </label>
              <input
                name="cover_image_url"
                type="url"
                value={form.cover_image_url}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" variant="primary" size="md" loading={loading}>
          {id ? "Save Changes" : "Create Post"}
        </Button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-text-secondary hover:text-text-main transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
