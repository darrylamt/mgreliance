import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types";
import PropertyDetailClient from "./PropertyDetailClient";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("properties")
      .select("title, description, location")
      .eq("id", params.id)
      .single();

    if (!data) return { title: "Property Not Found" };

    return {
      title: `${data.title} | MG Reliance`,
      description: data.description || `${data.title} located in ${data.location}`,
    };
  } catch {
    return { title: "Property | MG Reliance" };
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  let property: Property | null = null;
  let related: Property[] = [];

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !data) notFound();
    property = data;

    // Related properties — same type, exclude current
    const { data: relatedData } = await supabase
      .from("properties")
      .select("*")
      .eq("type", data.type)
      .neq("id", params.id)
      .limit(3);

    related = relatedData || [];
  } catch {
    notFound();
  }

  if (!property) notFound();

  return <PropertyDetailClient property={property} related={related} />;
}
