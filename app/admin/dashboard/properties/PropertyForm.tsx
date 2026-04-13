"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import type { Property } from "@/lib/types";

interface PropertyFormProps {
  initialData?: Partial<Property>;
  id?: string;
}

export default function PropertyForm({ initialData, id }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageInput, setImageInput] = useState("");

  const [form, setForm] = useState({
    title: initialData?.title || "",
    type: initialData?.type || "residential",
    location: initialData?.location || "",
    price: initialData?.price || "",
    description: initialData?.description || "",
    status: initialData?.status || "available",
    featured: initialData?.featured || false,
    images: initialData?.images || [],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addImage = () => {
    const trimmed = imageInput.trim();
    if (trimmed && !form.images.includes(trimmed)) {
      setForm((prev) => ({ ...prev, images: [...prev.images, trimmed] }));
      setImageInput("");
    }
  };

  const removeImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const payload = {
      title: form.title.trim(),
      type: form.type,
      location: form.location.trim(),
      price: form.price.trim() || null,
      description: form.description.trim() || null,
      status: form.status,
      featured: form.featured,
      images: form.images,
    };

    const { error: dbError } = id
      ? await supabase.from("properties").update(payload).eq("id", id)
      : await supabase.from("properties").insert([payload]);

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
    } else {
      router.push("/admin/dashboard/properties");
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

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h3 className="font-semibold text-text-main text-sm uppercase tracking-wide text-text-secondary">
          Basic Information
        </h3>

        <div>
          <label className="block text-sm font-medium text-text-main mb-2">
            Property Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder="e.g. 4-Bedroom Townhouse in East Legon"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              required
              value={form.type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Price
            </label>
            <input
              name="price"
              type="text"
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              placeholder="e.g. GHS 850,000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-main mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            name="location"
            type="text"
            required
            value={form.location}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder="e.g. East Legon, Accra"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-main mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
            placeholder="Describe the property..."
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            checked={form.featured}
            onChange={handleChange}
            className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
          />
          <label
            htmlFor="featured"
            className="text-sm font-medium text-text-main"
          >
            Mark as Featured Property
          </label>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-text-secondary">
          Property Images
        </h3>
        <div className="flex gap-2">
          <input
            type="url"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder="Paste image URL (Unsplash, etc.)"
          />
          <button
            type="button"
            onClick={addImage}
            className="flex items-center gap-2 px-4 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        {form.images.length > 0 && (
          <ul className="space-y-2">
            {form.images.map((url) => (
              <li
                key={url}
                className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
              >
                <span className="flex-1 text-xs text-text-secondary truncate">
                  {url}
                </span>
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" variant="primary" size="md" loading={loading}>
          {id ? "Save Changes" : "Add Property"}
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
