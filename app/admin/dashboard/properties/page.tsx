import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil, Upload, MapPin, Star, Bed, Bath } from "lucide-react";
import type { Property } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";
import Badge from "@/components/ui/Badge";
import PropertyDeleteButton from "./PropertyDeleteButton";
import PaginationBar from "@/components/admin/PaginationBar";

const PAGE_SIZE = 10;

const typeVariants: Record<string, "primary" | "accent" | "neutral"> = {
  residential: "primary",
  commercial: "accent",
  land: "neutral",
};

const statusVariants: Record<string, "success" | "danger" | "warning"> = {
  available: "success",
  sold: "danger",
  rented: "warning",
};

const statusLabels: Record<string, string> = {
  available: "For Sale",
  sold: "Sold",
  rented: "For Rent",
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let properties: Property[] = [];
  let total = 0;

  try {
    const supabase = await createClient();
    const { data, count } = await supabase
      .from("properties")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
    properties = data || [];
    total = count || 0;
  } catch {
    // handle gracefully
  }

  return (
    <>
      <AdminHeader
        title="Properties"
        description={`${total} listing${total !== 1 ? "s" : ""}`}
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/admin/dashboard/properties/import"
              className="flex items-center gap-2 bg-white border border-gray-200 text-text-main text-sm font-semibold px-3 py-2.5 rounded-xl hover:border-primary hover:text-primary transition-colors"
            >
              <Upload size={15} />
              <span className="hidden sm:inline">Import CSV</span>
            </Link>
            <Link
              href="/admin/dashboard/properties/new"
              className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-3 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus size={15} />
              Add Property
            </Link>
          </div>
        }
      />

      {properties.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
          <p className="text-text-secondary text-sm mb-4">No properties yet.</p>
          <Link
            href="/admin/dashboard/properties/new"
            className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Plus size={16} /> Add Property
          </Link>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-3"
              >
                {/* Top row: title + actions */}
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {property.featured && (
                        <Star size={12} className="text-accent fill-accent shrink-0" />
                      )}
                      <p className="text-sm font-semibold text-text-main line-clamp-2 leading-snug">
                        {property.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-secondary mt-1">
                      <MapPin size={11} className="shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/admin/dashboard/properties/${property.id}/edit`}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </Link>
                    <PropertyDeleteButton id={property.id} />
                  </div>
                </div>

                {/* Badges + specs */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={typeVariants[property.type]}>{property.type}</Badge>
                  <Badge variant={statusVariants[property.status]}>
                    {statusLabels[property.status]}
                  </Badge>
                  {property.price && (
                    <span className="text-xs font-semibold text-primary">
                      {property.price}
                    </span>
                  )}
                </div>

                {/* Specs row */}
                {(property.bedrooms != null || property.bathrooms != null) && (
                  <div className="flex items-center gap-4 text-xs text-text-secondary border-t border-gray-50 pt-2">
                    {property.bedrooms != null && (
                      <span className="flex items-center gap-1">
                        <Bed size={12} /> {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
                      </span>
                    )}
                    {property.bathrooms != null && (
                      <span className="flex items-center gap-1">
                        <Bath size={12} /> {property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <PaginationBar
            page={page}
            total={total}
            pageSize={PAGE_SIZE}
            basePath="/admin/dashboard/properties"
          />
        </div>
      )}
    </>
  );
}
