"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, X, AlertCircle, Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import type { Property } from "@/lib/types";

interface PropertyFormProps {
  initialData?: Partial<Property>;
  id?: string;
}

type UploadState = "idle" | "uploading" | "done" | "error";

export default function PropertyForm({ initialData, id }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [amenityInput, setAmenityInput] = useState("");

  const [form, setForm] = useState({
    title: initialData?.title || "",
    type: initialData?.type || "residential",
    location: initialData?.location || "",
    price: initialData?.price || "",
    description: initialData?.description || "",
    status: initialData?.status || "available",
    featured: initialData?.featured || false,
    bedrooms: initialData?.bedrooms?.toString() || "",
    bathrooms: initialData?.bathrooms?.toString() || "",
    area: initialData?.area?.toString() || "",
    agent_name: initialData?.agent_name || "",
    amenities: initialData?.amenities || [] as string[],
    images: initialData?.images || [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addUrl = () => {
    const trimmed = urlInput.trim();
    if (trimmed && !form.images.includes(trimmed)) {
      setForm((prev) => ({ ...prev, images: [...prev.images, trimmed] }));
      setUrlInput("");
    }
  };

  const removeImage = (url: string) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((img) => img !== url) }));
  };

  const addAmenity = () => {
    const trimmed = amenityInput.trim();
    if (trimmed && !form.amenities.includes(trimmed)) {
      setForm((prev) => ({ ...prev, amenities: [...prev.amenities, trimmed] }));
      setAmenityInput("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setForm((prev) => ({ ...prev, amenities: prev.amenities.filter((a) => a !== amenity) }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadState("uploading");
    setUploadError(null);

    const supabase = createClient();
    const uploaded: string[] = [];
    const errors: string[] = [];

    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name} is too large (max 10MB)`);
        continue;
      }

      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const path = `properties/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        errors.push(`${file.name}: ${uploadError.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("property-images")
        .getPublicUrl(path);

      if (urlData?.publicUrl) {
        uploaded.push(urlData.publicUrl);
      }
    }

    if (uploaded.length > 0) {
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
    }

    if (errors.length > 0) {
      setUploadError(errors.join(" · "));
      setUploadState("error");
    } else {
      setUploadState("done");
      setTimeout(() => setUploadState("idle"), 2000);
    }

    e.target.value = "";
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
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
      area: form.area ? parseFloat(form.area) : null,
      agent_name: form.agent_name.trim() || null,
      amenities: form.amenities,
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

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h3 className="font-semibold text-xs uppercase tracking-wide text-text-secondary">
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
            <label className="block text-sm font-medium text-text-main mb-2">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
            >
              <option value="available">For Sale</option>
              <option value="rented">For Rent</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">Price</label>
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
          <label className="block text-sm font-medium text-text-main mb-2">Description</label>
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
          <label htmlFor="featured" className="text-sm font-medium text-text-main">
            Mark as Featured Property
          </label>
        </div>
      </div>

      {/* Property Specs */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h3 className="font-semibold text-xs uppercase tracking-wide text-text-secondary">
          Property Specs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">Bedrooms</label>
            <input
              name="bedrooms"
              type="number"
              min="0"
              value={form.bedrooms}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              placeholder="e.g. 4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">Bathrooms</label>
            <input
              name="bathrooms"
              type="number"
              min="0"
              value={form.bathrooms}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              placeholder="e.g. 3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">Area (m²)</label>
            <input
              name="area"
              type="number"
              min="0"
              step="0.1"
              value={form.area}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              placeholder="e.g. 250"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">Agent Name</label>
            <input
              name="agent_name"
              type="text"
              value={form.agent_name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              placeholder="e.g. Kwame Asante"
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-2">Amenities</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              placeholder="e.g. Swimming Pool, then press Enter"
            />
            <button
              type="button"
              onClick={addAmenity}
              className="flex items-center gap-2 px-4 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus size={16} /> Add
            </button>
          </div>
          {form.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm px-3 py-1.5 rounded-full"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="text-primary/60 hover:text-primary"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h3 className="font-semibold text-xs uppercase tracking-wide text-text-secondary">
          Property Images
        </h3>

        {/* File Upload */}
        <div>
          <p className="text-sm font-medium text-text-main mb-3 flex items-center gap-2">
            <Upload size={14} /> Upload from device
          </p>
          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            uploadState === "uploading"
              ? "border-primary bg-primary/5"
              : uploadState === "done"
              ? "border-green-400 bg-green-50"
              : uploadState === "error"
              ? "border-red-300 bg-red-50"
              : "border-gray-200 bg-gray-50 hover:border-primary hover:bg-primary/5"
          }`}>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleFileUpload}
              disabled={uploadState === "uploading"}
            />
            {uploadState === "uploading" ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 size={24} className="text-primary animate-spin" />
                <span className="text-sm text-primary font-medium">Uploading…</span>
              </div>
            ) : uploadState === "done" ? (
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="text-sm text-green-600 font-medium">Upload complete</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center px-4">
                <Upload size={22} className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  <span className="font-semibold text-primary">Click to upload</span> or drag & drop
                </span>
                <span className="text-xs text-gray-400">JPEG, PNG, WebP — up to 10MB each, multiple allowed</span>
              </div>
            )}
          </label>
          {uploadError && (
            <p className="text-xs text-red-500 mt-2">{uploadError}</p>
          )}
        </div>

        {/* URL Input */}
        <div>
          <p className="text-sm font-medium text-text-main mb-3 flex items-center gap-2">
            <LinkIcon size={14} /> Or paste an image URL
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              placeholder="https://images.unsplash.com/..."
            />
            <button
              type="button"
              onClick={addUrl}
              className="flex items-center gap-2 px-4 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Image Preview Grid */}
        {form.images.length > 0 && (
          <div>
            <p className="text-xs text-text-secondary mb-3">
              {form.images.length} image{form.images.length !== 1 ? "s" : ""} added
              {form.images.length > 0 && " — first image will be the cover"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {form.images.map((url, index) => (
                <div key={url} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-video">
                  <Image
                    src={url}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {index === 0 && (
                    <div className="absolute top-1.5 left-1.5 bg-accent text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      Cover
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
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
