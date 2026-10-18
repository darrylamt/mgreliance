import { createPublicClient } from "@/lib/supabase/public";
import { AREAS, locationInArea, type Area } from "@/lib/areas";
import type { Property } from "@/lib/types";

export async function getAllProperties(): Promise<Property[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export function propertiesInArea(properties: Property[], area: Area): Property[] {
  return properties.filter((p) => locationInArea(p.location, area));
}

export function areaCounts(properties: Property[]): Record<string, number> {
  return Object.fromEntries(AREAS.map((a) => [a.slug, propertiesInArea(properties, a).length]));
}
