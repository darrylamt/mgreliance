import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import type { Property } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";
import Badge from "@/components/ui/Badge";
import PropertyDeleteButton from "./PropertyDeleteButton";

export default async function PropertiesPage() {
  let properties: Property[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    properties = data || [];
  } catch {
    // handle gracefully
  }

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

  return (
    <>
      <AdminHeader
        title="Properties"
        description="Manage your property listings."
        action={
          <Link
            href="/admin/dashboard/properties/new"
            className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            Add Property
          </Link>
        }
      />

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-secondary text-sm mb-4">
              No properties yet. Add your first listing.
            </p>
            <Link
              href="/admin/dashboard/properties/new"
              className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Add Property
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Property
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">
                  Location
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden lg:table-cell">
                  Price
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
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-text-main">
                      {property.title}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={typeVariants[property.type]}>
                      {property.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-text-secondary text-sm">
                      <MapPin size={12} />
                      <span className="truncate max-w-[150px]">
                        {property.location}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm text-text-secondary">
                      {property.price || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariants[property.status]}>
                      {property.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/dashboard/properties/${property.id}/edit`}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        aria-label="Edit property"
                      >
                        <Pencil size={15} />
                      </Link>
                      <PropertyDeleteButton id={property.id} />
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
