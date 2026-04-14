import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Properties & Projects | MG Reliance",
  description:
    "Browse MG Reliance's property listings across Greater Accra — residential, commercial, and land. Find your perfect property in Ghana.",
};

interface Props {
  searchParams: { type?: string; status?: string; location?: string; sort?: string };
}

export default async function ProjectsPage({ searchParams }: Props) {
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

  return (
    <ProjectsClient
      properties={properties}
      initialType={searchParams.type || ""}
      initialStatus={searchParams.status || ""}
      initialLocation={searchParams.location || ""}
      initialSort={searchParams.sort || "newest"}
    />
  );
}
